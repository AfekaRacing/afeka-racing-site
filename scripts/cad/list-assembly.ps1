# קורא את מבנה המכלול הראשי מ-SolidWorks ושומר רשימה של הרכיבים הראשיים (רמה ראשונה) לקובץ JSON.
# שימוש: powershell -File scripts/cad/list-assembly.ps1 "<נתיב ל-Full Assembly.SLDASM>" "<קובץ פלט.json>"
param(
  [Parameter(Mandatory = $true)][string]$AssemblyPath,
  [Parameter(Mandatory = $true)][string]$OutFile
)
$ErrorActionPreference = 'Stop'

$sw = New-Object -ComObject SldWorks.Application
$sw.Visible = $false
$sw.UserControl = $false

$errors = 0
$warnings = 0
# 2 = מכלול, 1 = Silent
$doc = $sw.OpenDoc6($AssemblyPath, 2, 1, '', [ref]$errors, [ref]$warnings)
if ($null -eq $doc) { throw "Could not open assembly (errors=$errors, warnings=$warnings)" }

$config = $doc.GetActiveConfiguration()
$root = $config.GetRootComponent3($true)
$children = $root.GetChildren()

function Count-Leaves($comp) {
  $kids = $comp.GetChildren()
  if ($null -eq $kids -or $kids.Count -eq 0) { return 1 }
  $n = 0
  foreach ($k in $kids) { $n += Count-Leaves $k }
  return $n
}

$list = @()
foreach ($c in $children) {
  $list += [pscustomobject]@{
    name       = $c.Name2
    file       = $c.GetPathName()
    suppressed = $c.IsSuppressed()
    hidden     = $c.IsHidden($true)
    parts      = (Count-Leaves $c)
  }
}

$list | ConvertTo-Json -Depth 4 | Out-File -FilePath $OutFile -Encoding utf8
Write-Output "components: $($list.Count)"
$sw.CloseAllDocuments($true) | Out-Null
