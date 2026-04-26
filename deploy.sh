#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Forjit AI — Deploy Script (Mac / Linux / WSL)
#  Usage: ./deploy.sh
#  Or with options:
#    ./deploy.sh --preview    → deploy to preview URL only
#    ./deploy.sh --skip-git   → skip git push
#    ./deploy.sh --build-only → only build, don't deploy
# ─────────────────────────────────────────────────────────────

set -e  # Exit on any error

# ── Colors ──────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Args ─────────────────────────────────────────────────────
PREVIEW=false
SKIP_GIT=false
BUILD_ONLY=false
for arg in "$@"; do
  case $arg in
    --preview)    PREVIEW=true ;;
    --skip-git)   SKIP_GIT=true ;;
    --build-only) BUILD_ONLY=true ;;
  esac
done

# ── Header ───────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║     Forjit AI — Deploy Script        ║${NC}"
echo -e "${CYAN}${BOLD}║     forjitai.in                      ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

START_TIME=$(date +%s)

# ── Step 1: Check dependencies ───────────────────────────────
echo -e "${BLUE}[1/6]${NC} Checking dependencies..."

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from nodejs.org${NC}"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found. Install from nodejs.org${NC}"
  exit 1
fi

NODE_VER=$(node -v)
echo -e "    Node: ${GREEN}${NODE_VER}${NC}"

if ! command -v vercel &> /dev/null && [ "$BUILD_ONLY" = false ]; then
  echo -e "${YELLOW}    Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
fi

echo -e "    ${GREEN}✓ Dependencies OK${NC}"

# ── Step 2: Install packages ─────────────────────────────────
echo -e "${BLUE}[2/6]${NC} Installing packages..."
npm install --silent
echo -e "    ${GREEN}✓ Packages ready${NC}"

# ── Step 3: Generate tools + sitemap ─────────────────────────
echo -e "${BLUE}[3/6]${NC} Generating tools index + sitemap..."
npm run gen-tools
echo -e "    ${GREEN}✓ index.html + sitemap.xml regenerated${NC}"

# ── Step 4: Build ────────────────────────────────────────────
echo -e "${BLUE}[4/6]${NC} Building production bundle..."
npm run build

BUILD_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1)
echo -e "    ${GREEN}✓ Build complete — dist/ size: ${BUILD_SIZE}${NC}"

if [ "$BUILD_ONLY" = true ]; then
  echo ""
  echo -e "${GREEN}${BOLD}✓ Build complete. Skipping deploy (--build-only).${NC}"
  echo -e "  dist/ folder is ready for manual upload."
  exit 0
fi

# ── Step 5: Git push ─────────────────────────────────────────
if [ "$SKIP_GIT" = false ]; then
  echo -e "${BLUE}[5/6]${NC} Pushing to GitHub..."
  if git rev-parse --git-dir > /dev/null 2>&1; then
    # Get current branch
    BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

    git add -A
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
    git commit -m "🚀 Deploy ${TIMESTAMP}" 2>/dev/null || echo "    Nothing new to commit"
    git push origin "$BRANCH" 2>/dev/null && \
      echo -e "    ${GREEN}✓ Pushed to GitHub (${BRANCH})${NC}" || \
      echo -e "    ${YELLOW}⚠ Git push failed — continuing with deploy${NC}"
  else
    echo -e "    ${YELLOW}⚠ Not a git repo — skipping git push${NC}"
  fi
else
  echo -e "${BLUE}[5/6]${NC} Skipping git push (--skip-git)"
fi

# ── Step 6: Deploy to Vercel ─────────────────────────────────
echo -e "${BLUE}[6/6]${NC} Deploying to Vercel..."

if [ "$PREVIEW" = true ]; then
  echo -e "    Deploying to ${YELLOW}preview${NC}..."
  vercel --yes 2>&1 | tee /tmp/vercel_output.txt
  DEPLOY_URL=$(grep "https://" /tmp/vercel_output.txt | tail -1)
else
  echo -e "    Deploying to ${GREEN}production${NC} (forjitai.in)..."
  vercel --prod --yes 2>&1 | tee /tmp/vercel_output.txt
  DEPLOY_URL="https://www.forjitai.in"
fi

# ── Done ─────────────────────────────────────────────────────
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║          ✓ Deploy Complete!          ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}URL:${NC}      ${CYAN}${DEPLOY_URL}${NC}"
echo -e "  ${BOLD}Time:${NC}     ${ELAPSED}s"
echo -e "  ${BOLD}Tools:${NC}    42 calculators live"
echo -e "  ${BOLD}Sitemap:${NC}  forjitai.in/sitemap.xml"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Open Google Search Console"
echo -e "  2. Request indexing for new pages"
echo -e "  3. Check Analytics: analytics.google.com"
echo ""
