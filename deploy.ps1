# Forjit AI - Deploy Script
# Just push to GitHub - Vercel auto-deploys

param([string]$Message = "")

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Forjit AI - Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Stage
Write-Host "[1/3] Staging changes..." -ForegroundColor Cyan
& git add -A
$status = & git status --short 2>&1
if (-not $status) {
    Write-Host "    No changes to deploy" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}
Write-Host "    OK: Changes staged" -ForegroundColor Green

# Commit
Write-Host "[2/3] Committing..." -ForegroundColor Cyan
if ($Message -eq "") { $Message = "Deploy " + (Get-Date -Format "yyyy-MM-dd HH:mm") }
& git commit -m $Message 2>&1 | Out-Null
Write-Host "    OK: $Message" -ForegroundColor Green

# Push
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Cyan
& git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "    FAIL: Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running setup.ps1 first" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "    OK: Pushed - Vercel deploying now..." -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Live in ~30 seconds" -ForegroundColor Green
Write-Host "   https://forjitai.in" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close"
