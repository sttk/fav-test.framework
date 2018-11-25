@echo off

setlocal enabledelayedexpansion

set CWD=%~d0%~p0
set ERR=0

for %%f in (%CWD%unit\util\*.test.js) do (
  node %%f --silent
  set /a ERR=!ERR! + %ERRORLEVEL%
)

for %%f in (%CWD%unit\*.test.js) do (
  node %%f --silent
  set /a ERR=!ERR! + %ERRORLEVEL%
)

for %%f in (%CWD%join\*.test.js) do (
  node %%f --silent
  set /a ERR=!ERR! + %ERRORLEVEL%
)

echo.
echo.Mocha samples
echo.

for %%f in (%CWD%mocha-samples\*.test.js) do (
  node %%f --silent
  set /a ERR=!ERR! + %ERRORLEVEL%
)

exit /b %ERR%

endlocal
