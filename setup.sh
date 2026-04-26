#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Forjit AI — First Time Setup Script
#  Run this ONCE on a new machine before deploying
#  Usage: ./setup.sh
# ─────────────────────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║     Forjit AI — First Time Setup     ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 1. Check Node.js ─────────────────────────────────────────
echo -e "${BOLD}[1] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js not found.${NC}"
  echo "Install from: https://nodejs.org (LTS version)"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VER}${NC}"

# ── 2. Install Vercel CLI ─────────────────────────────────────
echo -e "${BOLD}[2] Installing Vercel CLI...${NC}"
if command -v vercel &> /dev/null; then
  echo -e "${GREEN}✓ Vercel already installed$(vercel -v 2>/dev/null)${NC}"
else
  npm install -g vercel
  echo -e "${GREEN}✓ Vercel CLI installed${NC}"
fi

# ── 3. Login to Vercel ────────────────────────────────────────
echo -e "${BOLD}[3] Vercel login...${NC}"
echo -e "${YELLOW}  A browser will open. Log in with your Vercel account.${NC}"
vercel login
echo -e "${GREEN}✓ Logged in to Vercel${NC}"

# ── 4. Install project dependencies ──────────────────────────
echo -e "${BOLD}[4] Installing project dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ── 5. Setup Git ─────────────────────────────────────────────
echo -e "${BOLD}[5] Setting up Git...${NC}"
if ! command -v git &> /dev/null; then
  echo -e "${YELLOW}Git not found — install from git-scm.com${NC}"
else
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    git init
    git remote add origin https://github.com/forjitai/forjitai
    echo -e "${GREEN}✓ Git repo initialized${NC}"
  else
    echo -e "${GREEN}✓ Git already initialized${NC}"
    git remote set-url origin https://github.com/forjitai/forjitai 2>/dev/null || true
  fi
fi

# ── 6. Make scripts executable ───────────────────────────────
echo -e "${BOLD}[6] Making scripts executable...${NC}"
chmod +x deploy.sh setup.sh 2>/dev/null || true
echo -e "${GREEN}✓ Scripts ready${NC}"

# ── 7. Test build ────────────────────────────────────────────
echo -e "${BOLD}[7] Test build...${NC}"
npm run gen-tools
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║       ✓ Setup Complete!              ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "You are ready to deploy. Run:"
echo ""
echo -e "  ${CYAN}./deploy.sh${NC}          → Deploy to production"
echo -e "  ${CYAN}./deploy.sh --preview${NC} → Deploy preview only"
echo -e "  ${CYAN}./deploy.sh --build-only${NC} → Build only"
echo ""
echo -e "${YELLOW}Remember to:${NC}"
echo -e "  1. Push code to GitHub: git push origin main"
echo -e "  2. Add GROQ_API_KEY to GitHub Secrets for auto-blog"
echo -e "  3. Submit sitemap in Google Search Console"
echo ""
