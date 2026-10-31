@echo off
rem Builds swmesh.exe from swmesh.cs using the installed SolidWorks API libraries
set SWAPI=C:\Program Files\SOLIDWORKS Corp\SOLIDWORKS\api\redist
"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /nologo /platform:x64 /out:"%~dp0swmesh.exe" ^
  /r:"%SWAPI%\SolidWorks.Interop.sldworks.dll" /r:"%SWAPI%\SolidWorks.Interop.swconst.dll" ^
  "%~dp0swmesh.cs"
copy /y "%SWAPI%\SolidWorks.Interop.sldworks.dll" "%~dp0" >nul
copy /y "%SWAPI%\SolidWorks.Interop.swconst.dll" "%~dp0" >nul
