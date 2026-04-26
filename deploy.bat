@echo off
REM ─────────────────────────────────────────────────────────────
REM  Forjit AI — Deploy Script (Windows Command Prompt)
REM  Double-click to run, or: deploy.bat
REM  Options:
REM    deploy.bat preview    → preview URL only
REM    deploy.bat build-only → only build
REM ─────────────────────────────────────────────────────────────

setlocal EnableDelayedExpansion
set START=%TIME%

echo.
echo ╔══════════════════════════════════════╗
echo ║     Forjit AI — Deploy Script        ║
echo ║     forjitai.in                      ║
echo ╚══════════════════════════════════════╝
echo.

set MODE=production
if "%1"=="preview"    set MODE=preview
if "%1"=="build-only" set MODE=build-only

REM ── Check Node ────────────────────────────────────────────
echo [1/6] Checking dependencies...
node -v >nul 2>&1
if errorlevel 1 (
  echo    ERROR: Node.js not found.
  echo    Download from: https://nodejs.org
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo     Node: %NODE_VER%

vercel -v >nul 2>&1
if errorlevel 1 (
  if not "%MODE%"=="build-only" (
    echo     Installing Vercel CLI...
    call npm install -g vercel
  )
)
echo     OK - Dependencies ready

REM ── Install packages ──────────────────────────────────────
echo [2/6] Installing packages...
call npm install --silent
if errorlevel 1 (
  echo     ERROR: npm install failed
  pause
  exit /b 1
)
echo     OK - Packages ready

REM ── Generate tools + sitemap ──────────────────────────────
echo [3/6] Generating tools index + sitemap...
call npm run gen-tools
if errorlevel 1 (
  echo     ERROR: gen-tools failed
  pause
  exit /b 1
)
echo     OK - index.html + sitemap.xml regenerated

REM ── Build ─────────────────────────────────────────────────
echo [4/6] Building production bundle...
call npm run build
if errorlevel 1 (
  echo     ERROR: Build failed
  pause
  exit /b 1
)
echo     OK - Build complete

if "%MODE%"=="build-only" (
  echo.
  echo BUILD COMPLETE - dist/ folder ready
  echo You can drag dist/ to netlify.com/drop to deploy
  pause
  exit /b 0
)

REM ── Git push ──────────────────────────────────────────────
echo [5/6] Pushing to GitHub...
git rev-parse --git-dir >nul 2>&1
if not errorlevel 1 (
  git add -A
  for /f "tokens=1-3 delims=/ " %%a in ("%DATE%") do set DATESTAMP=%%c-%%a-%%b
  git commit -m "Deploy %DATESTAMP% %TIME:~0,5%" 2>nul
  git push origin main 2>nul
  if errorlevel 1 (
    echo     WARNING: Git push failed - continuing with deploy
  ) else (
    echo     OK - Pushed to GitHub
  )
) else (
  echo     SKIP - Not a git repo
)

REM ── Deploy ────────────────────────────────────────────────
echo [6/6] Deploying to Vercel...

if "%MODE%"=="preview" (
  echo     Deploying preview...
  call vercel --yes
) else (
  echo     Deploying to production forjitai.in...
  call vercel --prod --yes
)

if errorlevel 1 (
  echo     ERROR: Vercel deploy failed
  echo     Try running: vercel login
  pause
  exit /b 1
)

REM ── Done ──────────────────────────────────────────────────
echo.
echo ╔══════════════════════════════════════╗
echo ║          Deploy Complete!            ║
echo ╚══════════════════════════════════════╝
echo.
echo   URL:      https://www.forjitai.in
echo   Tools:    42 calculators live
echo   Sitemap:  forjitai.in/sitemap.xml
echo.
echo Next steps:
echo   1. Open Google Search Console
echo   2. Submit sitemap: forjitai.in/sitemap.xml
echo   3. Check Analytics: analytics.google.com
echo.
pause
