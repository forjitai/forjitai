# Forjit AI - First Time Setup
# Run from inside app-forge folder

param()
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

function Write-Step { param($n,$msg) Write-Host "[$n] $msg" -ForegroundColor Cyan }
function Write-OK   { param($msg)    Write-Host "    OK: $msg" -ForegroundColor Green }
function Write-Warn { param($msg)    Write-Host "    WARN: $msg" -ForegroundColor Yellow }

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Forjit AI - First Time Setup"           -ForegroundColor Cyan
Write-Host "   Folder: $ScriptDir"                     -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1 - Node
Write-Step 1 "Checking Node.js..."
$nodeVer = & node -v 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js not found. Get it from: https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-OK "Node.js $nodeVer"

# Step 2 - Vercel
Write-Step 2 "Checking Vercel CLI..."
$v = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $v) {
    & npm install -g vercel
}
Write-OK "Vercel ready"

# Step 3 - Vercel login
Write-Step 3 "Vercel login..."
Write-Host "    Browser will open - log in" -ForegroundColor Yellow
& vercel login
Write-OK "Vercel logged in"

# Step 4 - npm install
Write-Step 4 "Installing packages..."
& npm install
Write-OK "Packages installed"

# Step 5 - Git
Write-Step 5 "Setting up Git..."

$gitOk = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitOk) {
    Write-Warn "Git not found - get from https://git-scm.com"
    Read-Host "Press Enter to exit"
    exit 1
}

# Set git config
& git config --global user.email "forjitai@gmail.com" 2>$null
& git config --global user.name "Forjit AI" 2>$null

# Check if already a git repo
$isRepo = & git rev-parse --git-dir 2>$null
if (-not $isRepo) {
    & git init
    Write-OK "Git initialized"
} else {
    Write-OK "Git already initialized"
}

# Set remote
& git remote remove origin 2>$null
& git remote add origin https://github.com/forjitai/forjitai
Write-OK "Remote set: github.com/forjitai/forjitai"

# Stage and commit
& git add -A
& git commit -m "Initial commit - Forjit AI" 2>$null

# Rename to main (handles both master and already-main)
& git branch -M main 2>$null

# Push
Write-Host "    Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "    If asked for password - use a GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "    Get token: github.com -> Settings -> Developer settings -> Tokens" -ForegroundColor Gray
& git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-OK "Pushed to GitHub"
} else {
    Write-Warn "Push failed - try manually: git push -u origin main"
}

# Step 6 - Test build
Write-Step 6 "Test build..."
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-OK "Build passed"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Setup Complete!"                         -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy changes from now on:" -ForegroundColor Yellow
Write-Host "   git add -A"
Write-Host "   git commit -m 'your message'"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "Or double-click run.bat and choose option 1"
Write-Host ""
Read-Host "Press Enter to close"
