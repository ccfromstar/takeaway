@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\browserslist\cli.js" %*
) ELSE (
  node  "%~dp0\..\browserslist\cli.js" %*
)