# Forjit AI - Deployment Guide

**Domain:** forjitai.in
**GitHub:** github.com/forjitai/forjitai
**Vercel:** vercel.com/forjitai-9589s-projects/forjitai
**GA4:** G-DYR402JFVG
**AdSense:** ca-pub-5102938260449475

---

## How Deployment Works

```
You push code to GitHub
         ↓
GitHub triggers Vercel webhook
         ↓
Vercel runs: npm run build
             (which runs gen-tools + vite build)
         ↓
forjitai.in is live in ~30 seconds
```

No manual vercel commands needed anymore.

---

## Deploy Every Time (2 options)

### Option A - Double-click run.bat
```
Double-click run.bat
Choose option 1
Done
```

### Option B - Manual commands
```powershell
cd D:\workspace\forjitai\app-forge
git add -A
git commit -m "Your change description"
git push origin main
```

Vercel auto-deploys. Live in ~30 seconds.

---

## First Time Setup (new machine only)

```powershell
cd D:\workspace\forjitai\app-forge

# Install tools
npm install -g vercel
npm install

# Setup git
git init
git config user.email "forjitai@gmail.com"
git config user.name "Forjit AI"
git remote add origin https://github.com/forjitai/forjitai
git add -A
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

Then connect GitHub to Vercel:
```
vercel.com -> New Project -> Import from GitHub
-> forjitai/forjitai -> Deploy
```

---

## Adding a New Tool

```powershell
# 1. Create tool file
# public/tools/your-tool.html

# 2. Add to src/data/tools.js

# 3. Add before </body>:
# <script src="tool-common.js"></script>

# 4. Deploy
git add -A
git commit -m "Add new tool: your-tool"
git push origin main
```

Sitemap auto-updates on every build.

---

## Auto Blog (GitHub Actions)

Runs daily at 6 AM IST automatically.

Setup:
```
github.com/forjitai/forjitai
-> Settings -> Secrets -> Actions -> New secret
   Name:  GROQ_API_KEY
   Value: gsk_your_key
```

---

## Key IDs

| Service | ID |
|---------|-----|
| GA4 | G-DYR402JFVG |
| AdSense | ca-pub-5102938260449475 |
| GitHub | github.com/forjitai/forjitai |
| Vercel | forjitai-9589s-projects |
