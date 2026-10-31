// swmesh: מייצא רשתות משולשים מהמכלול של SolidWorks, רכיב ראשי אחד לקובץ, במיקום שלו ברכב.
// מתחבר ל-SolidWorks שכבר פתוח (או פותח אחד), ומשתמש בממשק הרשמי של SolidWorks.
//
// קומפילציה (פעם אחת):  scripts\cad\build.cmd
// שימוש:
//   swmesh list   "<Full Assembly.SLDASM>" "<out.txt>"   ← מבנה המכלול (2 רמות) ומספר החלקים
//   swmesh export "<Full Assembly.SLDASM>" "<outDir>"    ← קובץ STL לכל רכיב ראשי ולכל צבע
//
// הקבצים יוצאים במטרים, בצירים של SolidWorks. ההמרה לאתר נעשית ב-scripts/build-models.mjs.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

static class SwMesh
{
    static SldWorks sw;

    static int Main(string[] args)
    {
        if (args.Length < 3) { Console.WriteLine("usage: swmesh list|export <assembly> <out>"); return 1; }
        Console.OutputEncoding = Encoding.UTF8;
        try { sw = (SldWorks)Marshal.GetActiveObject("SldWorks.Application"); }
        catch { sw = (SldWorks)Activator.CreateInstance(Type.GetTypeFromProgID("SldWorks.Application")); }

        ModelDoc2 doc = (ModelDoc2)sw.GetOpenDocumentByName(args[1]);
        if (doc == null)
        {
            int errs = 0, warns = 0;
            doc = sw.OpenDoc6(args[1], (int)swDocumentTypes_e.swDocASSEMBLY, (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref errs, ref warns);
            if (doc == null) { Console.WriteLine("cannot open: errors=" + errs); return 1; }
        }
        AssemblyDoc asm = (AssemblyDoc)doc;
        asm.ResolveAllLightWeightComponents(false);

        object[] top = (object[])asm.GetComponents(true);
        if (args[0] == "list") return List(top, args[2]);
        if (args[0] == "export") return Export(top, args[2]);
        Console.WriteLine("unknown mode");
        return 1;
    }

    static List<Component2> Leaves(Component2 c)
    {
        var result = new List<Component2>();
        object[] kids = (object[])c.GetChildren();
        if (kids == null || kids.Length == 0) { result.Add(c); return result; }
        foreach (object k in kids)
        {
            var kc = (Component2)k;
            if (kc.IsSuppressed() || kc.IsHidden(true)) continue;
            // חלקי עזר שלא שייכים לרכב האמיתי (למשל שלדת דמה בתוך מכלול המתלה)
            if (kc.Name2.IndexOf("dummy", StringComparison.OrdinalIgnoreCase) >= 0) continue;
            result.AddRange(Leaves(kc));
        }
        return result;
    }

    static int List(object[] top, string outFile)
    {
        var sb = new StringBuilder();
        foreach (object o in top)
        {
            var c = (Component2)o;
            sb.AppendLine(string.Format("{0}\t{1}\tsuppressed={2}\thidden={3}\t{4}", c.Name2, Leaves(c).Count, c.IsSuppressed(), c.IsHidden(true), c.GetPathName()));
            object[] kids = (object[])c.GetChildren();
            if (kids == null) continue;
            foreach (object k in kids)
            {
                var kc = (Component2)k;
                sb.AppendLine(string.Format("    {0}\t{1}\tsuppressed={2}\thidden={3}", kc.Name2, Leaves(kc).Count, kc.IsSuppressed(), kc.IsHidden(true)));
            }
        }
        File.WriteAllText(outFile, sb.ToString(), Encoding.UTF8);
        Console.WriteLine("components: " + top.Length);
        return 0;
    }

    // [x y z 1] * M  (המוסכמה של SolidWorks: 9 ערכי סיבוב, 3 הזזה, 1 קנה מידה)
    static void Apply(double[] m, float[] v, int i, out float x, out float y, out float z)
    {
        double px = v[i], py = v[i + 1], pz = v[i + 2], s = m[12];
        x = (float)((px * m[0] + py * m[3] + pz * m[6]) * s + m[9]);
        y = (float)((px * m[1] + py * m[4] + pz * m[7]) * s + m[10]);
        z = (float)((px * m[2] + py * m[5] + pz * m[8]) * s + m[11]);
    }

    static string ColorOf(Component2 c)
    {
        double[] mp = c.MaterialPropertyValues as double[];
        if (mp == null || mp.Length < 3)
        {
            var md = c.GetModelDoc2() as ModelDoc2;
            if (md != null) mp = md.MaterialPropertyValues as double[];
        }
        if (mp == null || mp.Length < 3) return "b8c4bd";
        return string.Format("{0:x2}{1:x2}{2:x2}", (int)(mp[0] * 255), (int)(mp[1] * 255), (int)(mp[2] * 255));
    }

    static double BoxError(double[] box, float minX, float minY, float minZ, float maxX, float maxY, float maxZ)
    {
        return Math.Abs(box[0] - minX) + Math.Abs(box[1] - minY) + Math.Abs(box[2] - minZ)
             + Math.Abs(box[3] - maxX) + Math.Abs(box[4] - maxY) + Math.Abs(box[5] - maxZ);
    }

    static int Export(object[] top, string outDir)
    {
        Directory.CreateDirectory(outDir);
        var log = new StringBuilder();
        int index = 0;
        foreach (object o in top)
        {
            index++;
            var group = (Component2)o;
            if (group.IsSuppressed() || group.IsHidden(true)) continue;
            var byColor = new Dictionary<string, List<float>>();
            int leaves = 0, failed = 0;

            foreach (Component2 leaf in Leaves(group))
            {
                object info;
                object[] bodies = leaf.GetBodies3((int)swBodyType_e.swSolidBody, out info) as object[];
                if (bodies == null) { failed++; continue; }
                MathTransform t = leaf.Transform2;
                double[] m = t != null ? (double[])t.ArrayData : null;
                double[] box = leaf.GetBox(false, false) as double[];

                var raw = new List<float>();
                foreach (object b in bodies)
                {
                    object[] faces = ((Body2)b).GetFaces() as object[];
                    if (faces == null) continue;
                    foreach (object f in faces)
                    {
                        float[] tris = ((Face2)f).GetTessTriangles(true) as float[];
                        if (tris != null) raw.AddRange(tris);
                    }
                }
                if (raw.Count == 0) { failed++; continue; }
                float[] arr = raw.ToArray();

                // בודקים אם הגוף כבר בצירי המכלול או בצירי החלק, לפי התיבה החוסמת ש-SolidWorks מדווח
                float[] moved = new float[arr.Length];
                float[] mn = { float.MaxValue, float.MaxValue, float.MaxValue }, mx = { float.MinValue, float.MinValue, float.MinValue };
                float[] rmn = { float.MaxValue, float.MaxValue, float.MaxValue }, rmx = { float.MinValue, float.MinValue, float.MinValue };
                for (int i = 0; i < arr.Length; i += 3)
                {
                    float x = arr[i], y = arr[i + 1], z = arr[i + 2];
                    if (m != null) Apply(m, arr, i, out x, out y, out z);
                    moved[i] = x; moved[i + 1] = y; moved[i + 2] = z;
                    mn[0] = Math.Min(mn[0], x); mn[1] = Math.Min(mn[1], y); mn[2] = Math.Min(mn[2], z);
                    mx[0] = Math.Max(mx[0], x); mx[1] = Math.Max(mx[1], y); mx[2] = Math.Max(mx[2], z);
                    rmn[0] = Math.Min(rmn[0], arr[i]); rmn[1] = Math.Min(rmn[1], arr[i + 1]); rmn[2] = Math.Min(rmn[2], arr[i + 2]);
                    rmx[0] = Math.Max(rmx[0], arr[i]); rmx[1] = Math.Max(rmx[1], arr[i + 1]); rmx[2] = Math.Max(rmx[2], arr[i + 2]);
                }
                float[] use = moved;
                if (box != null && m != null &&
                    BoxError(box, rmn[0], rmn[1], rmn[2], rmx[0], rmx[1], rmx[2]) < BoxError(box, mn[0], mn[1], mn[2], mx[0], mx[1], mx[2]))
                    use = arr;

                string color = ColorOf(leaf);
                List<float> list;
                if (!byColor.TryGetValue(color, out list)) { list = new List<float>(); byColor[color] = list; }
                list.AddRange(use);
                leaves++;
            }

            string safe = MakeSafe(group.Name2);
            foreach (var kv in byColor)
            {
                string file = Path.Combine(outDir, string.Format("{0:00}__{1}__{2}.stl", index, safe, kv.Key));
                WriteStl(file, kv.Value);
            }
            string line = string.Format(CultureInfo.InvariantCulture, "{0:00}\t{1}\tparts={2}\tfailed={3}\tcolors={4}", index, group.Name2, leaves, failed, byColor.Count);
            log.AppendLine(line);
            Console.WriteLine(line);
        }
        File.WriteAllText(Path.Combine(outDir, "export-log.txt"), log.ToString(), Encoding.UTF8);
        return 0;
    }

    static string MakeSafe(string name)
    {
        var sb = new StringBuilder();
        foreach (char ch in name) sb.Append(char.IsLetterOrDigit(ch) || ch == '-' ? ch : '_');
        return sb.ToString();
    }

    static void WriteStl(string file, List<float> v)
    {
        int tris = v.Count / 9;
        using (var bw = new BinaryWriter(File.Create(file)))
        {
            bw.Write(new byte[80]);
            bw.Write((uint)tris);
            for (int t = 0; t < tris; t++)
            {
                int i = t * 9;
                float ax = v[i + 3] - v[i], ay = v[i + 4] - v[i + 1], az = v[i + 5] - v[i + 2];
                float bx = v[i + 6] - v[i], by = v[i + 7] - v[i + 1], bz = v[i + 8] - v[i + 2];
                float nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
                float len = (float)Math.Sqrt(nx * nx + ny * ny + nz * nz);
                if (len > 0) { nx /= len; ny /= len; nz /= len; }
                bw.Write(nx); bw.Write(ny); bw.Write(nz);
                for (int k = 0; k < 9; k++) bw.Write(v[i + k]);
                bw.Write((ushort)0);
            }
        }
    }
}
