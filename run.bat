@echo off
cd /d "%~dp0"

echo.
echo  ==========================================
echo    Forjit AI - Deploy Menu
echo    GitHub push = Vercel auto-deploys
echo  ==========================================
echo.
echo  [1] Deploy (push changes to GitHub)
echo  [2] First time setup (new machine only)
echo  [3] Exit
echo.
set /p choice=  Enter choice (1-3): 

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto setup
if "%choice%"=="3" exit /b 0

echo Invalid choice.
pause
exit /b 1

:deploy
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
goto end

:setup
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
goto end

:end
pause
