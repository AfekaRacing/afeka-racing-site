' קורא את מבנה המכלול הראשי מ-SolidWorks ושומר את הרכיבים (רמה ראשונה ושנייה) לקובץ טקסט.
' שימוש: cscript //nologo scripts\cad\list-assembly.vbs "<Full Assembly.SLDASM>" "<פלט.txt>"
' מתחבר ל-SolidWorks פתוח אם יש, אחרת פותח אחד.
Option Explicit
Dim sw, doc, errs, warns, wasOpen, fso, out, root, kids, c, sub2, k, i

Set fso = CreateObject("Scripting.FileSystemObject")
Set out = fso.CreateTextFile(WScript.Arguments(1), True, True) ' Unicode

On Error Resume Next
Set sw = GetObject(, "SldWorks.Application")
If Err.Number <> 0 Then
  Err.Clear
  Set sw = CreateObject("SldWorks.Application")
End If
On Error GoTo 0

Set doc = sw.GetOpenDocumentByName(WScript.Arguments(0))
wasOpen = Not (doc Is Nothing)
If Not wasOpen Then
  errs = 0 : warns = 0
  Set doc = sw.OpenDoc6(WScript.Arguments(0), 2, 1, "", errs, warns)
  If doc Is Nothing Then
    out.WriteLine "ERROR open errors=" & errs & " warnings=" & warns
    WScript.Quit 1
  End If
End If

Function CountLeaves(comp)
  Dim ch, n, x
  ch = comp.GetChildren()
  If IsEmpty(ch) Or IsNull(ch) Then
    CountLeaves = 1
    Exit Function
  End If
  If UBound(ch) < 0 Then
    CountLeaves = 1
    Exit Function
  End If
  n = 0
  For Each x In ch
    n = n + CountLeaves(x)
  Next
  CountLeaves = n
End Function

out.WriteLine "# doc: " & doc.GetTitle() & " type=" & doc.GetType() & " components=" & doc.GetComponentCount(False)
doc.ResolveAllLightWeightComponents False
kids = doc.GetComponents(True) ' רק רמה ראשונה
If IsEmpty(kids) Then
  out.WriteLine "# no components"
  out.Close
  WScript.Quit 1
End If
For Each c In kids
  out.WriteLine c.Name2 & vbTab & CountLeaves(c) & vbTab & c.IsSuppressed() & vbTab & c.IsHidden(True) & vbTab & c.GetPathName()
  sub2 = c.GetChildren()
  If Not IsEmpty(sub2) Then
    For Each k In sub2
      out.WriteLine "    " & k.Name2 & vbTab & CountLeaves(k) & vbTab & k.IsSuppressed() & vbTab & k.IsHidden(True)
    Next
  End If
Next
out.Close

If Not wasOpen Then sw.CloseDoc doc.GetTitle()
WScript.Echo "done"
