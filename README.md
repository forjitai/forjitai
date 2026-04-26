# 🔨 App Forge

**Describe an app → get one instantly → refine it → ship it.**

A prompt-to-app generator powered by open-source LLMs (Llama, Qwen, DeepSeek, Mistral). Users bring their own API key from Groq or OpenRouter (both have free tiers). No backend needed.

![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Generate** — describe any app in plain text, get a working single-file HTML app
- **Iterate** — refine with follow-up prompts or one-click smart suggestions (dark mode, accessibility, mobile layout, etc.)
- **Upload** — drop in existing HTML and iterate on it
- **Export** — project ZIP (code + README + setup guide), single .html, CodePen, data URL
- **Deploy** — one-click GitHub Gist deploy with live preview
- **History** — revert to any previous version, track iterations
- **BYO key** — users provide their own Groq or OpenRouter API key. Keys stay in browser memory, never persisted

## Supported models

| Provider | Models | Cost |
|---|---|---|
| **Groq** | Llama 3.3 70B, Llama 3.1 8B, Qwen 3 32B, DeepSeek R1 Distill 70B | Free tier |
| **OpenRouter** | Llama 3.3 70B, Qwen 3 Coder, DeepSeek V3.1, Mistral Small 3.2 | Free models available |

---

## Quick start (local development)

```bash
# 1. Clone or unzip
cd forjitai

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Opens at **http://localhost:5173**

---

## Deploy to production

### Option A — Vercel (recommended, 1 command)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel
```

Follow the prompts. Done. You'll get a URL like `https://forjitai-xxx.vercel.app`.

To deploy to production:
```bash
vercel --prod
```

### Option B — Netlify

```bash
# Build
npm run build

# Deploy with Netlify CLI
npx netlify deploy --dir=dist --prod
```

Or drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

### Option C — Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist
```

### Option D — GitHub Pages

```bash
# Build
npm run build

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create forjitai --public --source=. --push

# Enable Pages: Settings → Pages → Deploy from main branch
# Set build command: npm run build
# Set output directory: dist
```

### Option E — Any static host

```bash
npm run build
# Upload the `dist/` folder to any static file host
```

---

## Project structure

```
forjitai/
├── index.html          # HTML entry point
├── src/
│   ├── main.jsx        # React mount
│   ├── App.jsx         # Main application (all logic)
│   └── index.css       # Tailwind + custom styles
├── vite.config.js      # Vite + React + Tailwind
├── vercel.json         # Vercel deploy config
├── netlify.toml        # Netlify deploy config
├── package.json
└── .gitignore
```

## How it works

1. User enters a prompt describing the app they want
2. The prompt is sent (from the user's browser) to Groq or OpenRouter with a system prompt that enforces single-file HTML output
3. The response is parsed, cleaned of markdown fences, and rendered in a sandboxed iframe
4. User can iterate: type a change request → the current HTML + change request are sent back to the LLM → updated HTML replaces the preview
5. Smart suggestions (dark mode, accessibility, animations, etc.) work the same way — they're pre-written change requests
6. Export options package the HTML with README and deploy instructions

**Privacy**: API keys live in React state (browser memory). They're sent directly from the browser to the LLM provider. Nothing is stored server-side because there is no server.

---

## Custom domain

After deploying to Vercel/Netlify/Cloudflare:

1. Buy a domain (~$10/year from Namecheap, Cloudflare Registrar, etc.)
2. Add it in your host's dashboard (Settings → Domains)
3. Update DNS as instructed (usually a CNAME record)
4. SSL is automatic on all three platforms

---

## Environment

No environment variables needed. No `.env` file. Everything runs client-side.

---

## License

MIT — do whatever you want with it.
