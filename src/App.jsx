import React, { useState, useRef, useEffect } from "react";
import {
  Hammer, Sparkles, Code2, Eye, Copy, Download, Loader2, RotateCcw,
  History, X, ChevronRight, Zap, Check, Settings, KeyRound, ExternalLink,
  Cpu, AlertCircle, Rocket, Link as LinkIcon, Globe, Package, FileText,
  Wand2, Upload, FileUp, MessageSquarePlus, Lightbulb, GitBranch,
  Star, Bug, Smartphone, Monitor, Search, BarChart3, Heart, Send,
  ChefHat, Mail, Users, Lock, Phone, FileSearch, LogIn, LogOut, Shield,
  UtensilsCrossed, Dumbbell, NotebookPen, FilePlus, FileDown, User,
  Calendar, Layers, GraduationCap, BookOpen, PenLine, Mic, Share2,
  ArrowRight, BookMarked, Stethoscope, HardHat, Tv2, PencilRuler, ChevronDown,
} from "lucide-react";

/* ── Phase 1 modules ────────────────────────────────────────────────────── */
import { dbGet, dbSet, dbClear } from "./db";
import { callLLM as _callLLM } from "./api";
import "./errorLogger.js"; // Global error capture - auto-logs all JS errors
import {
  APP_NAME, APP_TAG, APP_URL, ADMIN_EMAIL,
  PROVIDERS, TABS, PLANNER_TYPES, DOC_TYPES, CONTENT_TYPES,
  APP_SYSTEM_PROMPT, MOBILE_SYSTEM_PROMPT, PLANNER_SYSTEM_PROMPT,
  DOCUMENT_SYSTEM_PROMPT_MARKDOWN, CONTENT_SYSTEM_PROMPT, REEL_SYSTEM_PROMPT,
  ITERATE_SYSTEM_PROMPT_HTML, ITERATE_SYSTEM_PROMPT_MD,
} from "./constants";

/* ── Phase 2 components ─────────────────────────────────────────────────── */
import { Modal, Drawer, TabBtn, LinkRow, Stat } from "./components/ui";
import ForjitLogo from "./components/ForjitLogo";
import SettingsPanel from "./components/SettingsPanel";
import AdminPanel from "./components/AdminPanel";
import { HistoryPanel, GalleryPanel } from "./components/HistoryPanel";
import {
  AppSubTypeSelector,
  PlannerSubTypeSelector,
  DocSubTypeSelector,
  ContentSubTypeSelector,
} from "./components/SubTypeSelector";
import AuthModal from "./components/AuthModal";
import SharePanel from "./components/SharePanel";
import ReelOutput from "./components/ReelOutput";

/* ── Phase 3: utilities ─────────────────────────────────────────────────── */
import {
  stripCodeFences, stripMarkdownFences, toBase64, slugify,
  estimateTokens, minifyHtml, renderMarkdown,
  loadJSZip, loadJsPDF, loadDocx, loadPptxGenJS,
} from "./utils";

/* ── Icon map for main tab bar ──────────────────────────────────────────── */
const ICON_MAP = {
  Code2, Calendar, FileText, Monitor, Smartphone,
  UtensilsCrossed, ChefHat, Dumbbell, NotebookPen, Mail, Layers, Wand2,
};

/* ---------- MAIN COMPONENT ---------- */
export default function ForjitAI() {
  /* ----- Auth ----- */
  const [user, setUser] = useState(null); // { id, email, name, isAdmin, createdAt }
  const [showAuth, setShowAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  /* ----- LLM Config ----- */
  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState(PROVIDERS.groq.models[0].id);
  const [apiKey, setApiKey] = useState("");
  const [rememberKeys, setRememberKeys] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showKey, setShowKey] = useState(false);

  /* ----- Main state ----- */
  const [activeTab, setActiveTab] = useState("app");
  const [appSubType, setAppSubType] = useState("web"); // web | mobile
  const [plannerType, setPlannerType] = useState("meal_week");
  const [docType, setDocType] = useState("resume_pdf");
  const [contentType, setContentType] = useState("lesson_plan");

  const generatorRef = useRef(null);

  /* ----- Last session (Continue where you left) ----- */
  const [lastSession, setLastSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("forjit_last") || "null"); }
    catch { return null; }
  });

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(""); // HTML or Markdown
  const [outputType, setOutputType] = useState("html"); // html | markdown
  const [view, setView] = useState("preview");
  const [error, setError] = useState("");
  const [currentId, setCurrentId] = useState(null);

  /* ----- History & iterations ----- */
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [iterations, setIterations] = useState([]);
  const [iterPrompt, setIterPrompt] = useState("");
  const [iterating, setIterating] = useState(false);

  /* ----- Upload (session only) ----- */
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedApps, setUploadedApps] = useState([]); // session-only
  const uploadInputRef = useRef(null);

  /* ----- Repository (all generated apps available for all users) ----- */
  const [showRepo, setShowRepo] = useState(false);
  const [repository, setRepository] = useState([]); // shared gallery

  /* ----- Error log ----- */
  const [errorLog, setErrorLog] = useState([]);
  const [showErrorLog, setShowErrorLog] = useState(false);

  /* ----- Feedback ----- */
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackSent, setFeedbackSent] = useState(false);

  /* ----- Admin panel ----- */
  const [showAdmin, setShowAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  /* ----- Visitor counter (live) ----- */
  const [visitorCount, setVisitorCount] = useState(null);
  const [activeVisitors, setActiveVisitors] = useState(null);

  /* ----- Deploy ----- */
  const [showShare, setShowShare] = useState(false);
  const [ghToken, setGhToken] = useState("");
  const [showGhToken, setShowGhToken] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);
  const [deployError, setDeployError] = useState("");
  const [zipping, setZipping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  /* ----- Reel Engine state ----- */
  const [reelData, setReelData] = useState(null);
  const [reelTone, setReelTone] = useState("emotional");
  const [reelCopied, setReelCopied] = useState("");

  /* ----- Data manager ----- */
  const [showDataManager, setShowDataManager] = useState(false);

  /* ----- PWA ----- */
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  /* ----- Refs ----- */
  const textareaRef = useRef(null);
  const iterRef = useRef(null);

  const configured = true; // proxy handles free access — key is optional for better quality
  const hasOwnKey  = apiKey.trim().length > 0;
  const busy = generating || iterating;
  const currentModel = PROVIDERS[provider].models.find(m => m.id === model);

  /* ----- Load data on mount ----- */
  useEffect(() => {
    (async () => {
      const [log, hist, fb, u, repo] = await Promise.all([
        dbGet("errorLog", "all"),
        dbGet("history", "all"),
        dbGet("feedback", "all"),
        dbGet("users", "all"),
        dbGet("history", "repo"),
      ]);
      if (Array.isArray(log)) setErrorLog(log);
      if (Array.isArray(hist)) setHistory(hist);
      if (Array.isArray(fb)) setFeedbackList(fb);
      if (Array.isArray(u)) setUsers(u);
      if (Array.isArray(repo)) setRepository(repo);

      // Restore logged-in user
      const loggedIn = await dbGet("users", "current");
      if (loggedIn) setUser(loggedIn);

      // Restore saved API keys and settings (user opted-in to "remember")
      const savedConfig = await dbGet("users", "llm_config");
      if (savedConfig) {
        if (savedConfig.provider && PROVIDERS[savedConfig.provider]) setProvider(savedConfig.provider);
        if (savedConfig.model) setModel(savedConfig.model);
        if (savedConfig.apiKey) setApiKey(savedConfig.apiKey);
        if (savedConfig.ghToken) setGhToken(savedConfig.ghToken);
        setRememberKeys(savedConfig.rememberKeys !== false);
      }

      // Now enable auto-save (prevents initial empty state overwriting loaded data)
      setDataLoaded(true);
    })();
  }, []);

  const [dataLoaded, setDataLoaded] = useState(false);

  /* Save/clear LLM config based on rememberKeys toggle */
  useEffect(() => {
    if (!dataLoaded) return;
    if (rememberKeys) {
      dbSet("users", "llm_config", { provider, model, apiKey, ghToken, rememberKeys });
    } else {
      dbSet("users", "llm_config", { provider, model, rememberKeys }); // clear keys but keep provider/model
    }
  }, [provider, model, apiKey, ghToken, rememberKeys, dataLoaded]);

  useEffect(() => { if (dataLoaded) dbSet("errorLog", "all", errorLog); }, [errorLog, dataLoaded]);
  useEffect(() => { if (dataLoaded) dbSet("history", "all", history); }, [history, dataLoaded]);
  useEffect(() => { if (dataLoaded) dbSet("feedback", "all", feedbackList); }, [feedbackList, dataLoaded]);
  useEffect(() => { if (dataLoaded) dbSet("users", "all", users); }, [users, dataLoaded]);
  useEffect(() => { if (dataLoaded) dbSet("history", "repo", repository); }, [repository, dataLoaded]);

  /* ----- PWA install prompt ----- */
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowInstallBtn(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ----- Live visitor counter (reliable with fallback) ----- */
  useEffect(() => {
    let cancelled = false;

    async function loadVisits() {
      // Always start with local fallback so numbers show immediately
      const cached = (await dbGet("users", "visitor_count")) || 0;
      const alreadyCountedThisSession = sessionStorage.getItem("forjitai_visited") === "1";
      const next = alreadyCountedThisSession ? cached : cached + 1;
      if (!alreadyCountedThisSession) {
        await dbSet("users", "visitor_count", next);
        sessionStorage.setItem("forjitai_visited", "1");
      }
      if (!cancelled) setVisitorCount(next);

      // Try remote counter API (counterapi.dev - free, no signup)
      try {
        const ns = "forjitai-in";
        const key = "visits";
        const url = alreadyCountedThisSession
          ? `https://api.counterapi.dev/v1/${ns}/${key}`
          : `https://api.counterapi.dev/v1/${ns}/${key}/up`;
        const res = await fetch(url, { mode: "cors" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.count && data.count > next) {
            setVisitorCount(data.count);
          }
        }
      } catch {
        // Silent fallback - local counter already shown
      }
    }

    loadVisits();

    // Active visitors: realistic simulation based on hour/day
    const computeActive = () => {
      const h = new Date().getHours();
      const day = new Date().getDay();
      const isWeekend = day === 0 || day === 6;
      // Peak: 10am-11pm weekdays, 11am-1am weekends
      let base = 3;
      if (isWeekend) {
        if (h >= 11 && h <= 1) base = 15;
        else if (h >= 18 || h <= 1) base = 12;
      } else {
        if (h >= 10 && h <= 23) base = 12;
        if (h >= 19 && h <= 22) base = 18;
      }
      return base + Math.floor(Math.random() * 6);
    };
    setActiveVisitors(computeActive());
    const iv = setInterval(() => !cancelled && setActiveVisitors(computeActive()), 25000);

    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  /* ----- Textarea auto-resize ----- */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
    }
  }, [prompt]);
  useEffect(() => {
    if (iterRef.current) {
      iterRef.current.style.height = "auto";
      iterRef.current.style.height = Math.min(iterRef.current.scrollHeight, 160) + "px";
    }
  }, [iterPrompt]);

  /* ----- AUTH (email-only, optional, instant) ----- */
  function isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  }

  async function signIn() {
    setAuthError("");
    const email = authEmail.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    // Admin is a specific email — change this to your email when you deploy
    const isAdmin = email === ADMIN_EMAIL; // ADMIN_EMAIL imported from constants.js

    // Find existing user or create new one
    const existing = users.find(u => u.email === email);
    const now = new Date().toISOString();
    const userData = existing ? {
      ...existing,
      name: authName.trim() || existing.name,
      lastLogin: now,
    } : {
      id: `u_${Date.now()}`,
      email,
      name: authName.trim() || email.split("@")[0],
      isAdmin,
      createdAt: now,
      lastLogin: now,
    };

    setUsers((prev) => {
      if (existing) return prev.map(u => u.email === email ? userData : u);
      return [...prev, userData];
    });
    await dbSet("users", "current", userData);
    setUser(userData);
    setShowAuth(false);
    setAuthEmail("");
    setAuthName("");
    setAuthError("");
  }

  async function logout() {
    await dbSet("users", "current", null);
    setUser(null);
  }

  /* ----- LLM call — delegates to src/api.js ----- */
  async function callLLM(messages, { onFallback } = {}) {
    return _callLLM({ provider, model, apiKey, messages, onFallback });
  }

  function logError(ctx, msg) {
    const entry = {
      ts: new Date().toISOString(),
      context: ctx,
      message: typeof msg === "string" ? msg : msg?.message || String(msg),
      model, provider,
      userId: user?.id || "anon",
    };
    setErrorLog((prev) => {
      const updated = [entry, ...prev].slice(0, 100);
      // Save immediately — don't rely on useEffect timing
      dbSet("errorLog", "all", updated);
      return updated;
    });
  }

  /* ----- Generate ----- */
  async function generate() {
    if (!prompt.trim() || busy) return;
    setGenerating(true);
    setError("");
    setOutput("");
    setReelData(null);
    setDeployResult(null);
    setIterations([]);

    try {
      let sysPrompt, expectedType;
      if (activeTab === "app") {
        sysPrompt = appSubType === "mobile" ? MOBILE_SYSTEM_PROMPT : APP_SYSTEM_PROMPT;
        expectedType = "html";
      } else if (activeTab === "content") {
        if (contentType === "social") {
          // Reel Engine — special JSON mode
          sysPrompt = REEL_SYSTEM_PROMPT;
          expectedType = "reel";
        } else {
          sysPrompt = CONTENT_SYSTEM_PROMPT;
          expectedType = "markdown";
          const ctype = CONTENT_TYPES[contentType];
          if (ctype) {
            sysPrompt = CONTENT_SYSTEM_PROMPT + `\n\n[CONTENT TYPE: ${ctype.label}]`;
          }
        }
      } else if (activeTab === "planner") {
        sysPrompt = PLANNER_SYSTEM_PROMPT;
        expectedType = "html";
        // Enhance prompt with specific sub-type
        const ptype = PLANNER_TYPES[plannerType];
        if (ptype) {
          const enhancement = `[PLANNER TYPE: ${ptype.label}] — ` +
            (plannerType === "recipe" ? "Include per step: time in minutes, flame/heat level (low/medium/high), visual cues. Show total time prominently." : "") +
            (plannerType.startsWith("meal_") ? "Include calories/meal, prep time, grocery list. Checkboxes to mark eaten. Track progress." : "") +
            (plannerType.startsWith("workout_") ? "Include sets, reps, rest times, form cues per exercise. Progress tracking. Timer for each exercise." : "") +
            (plannerType === "diary" ? "Date-based entries, mood selector, tags, search. Export as JSON." : "");
          sysPrompt = PLANNER_SYSTEM_PROMPT + "\n\n" + enhancement;
        }
      } else {
        sysPrompt = DOCUMENT_SYSTEM_PROMPT_MARKDOWN;
        expectedType = "markdown";
      }

      const text = await callLLM([
        { role: "system", content: sysPrompt },
        { role: "user", content: prompt.trim() },
      ], {
        onFallback: (from, to, code) => setError(`${from} hit ${code} limit — trying ${to}…`),
      });
      setError("");

      let cleaned = expectedType === "html" ? stripCodeFences(text) : stripMarkdownFences(text);

      if (expectedType === "reel") {
        // Robust JSON extraction — handle markdown fences, extra text, partial wrapping
        try {
          let raw = text;

          // 1. Strip ```json ... ``` or ``` ... ``` fences
          raw = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

          // 2. Try to find the first { ... } block (handles text before/after JSON)
          const firstBrace = raw.indexOf("{");
          const lastBrace = raw.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            raw = raw.slice(firstBrace, lastBrace + 1);
          }

          raw = raw.trim();

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            // 3. Last resort: fix common JSON issues (trailing commas, smart quotes)
            const fixed = raw
              .replace(/,\s*([}\]])/g, "$1")       // trailing commas
              .replace(/[\u201C\u201D]/g, '"')       // smart double quotes
              .replace(/[\u2018\u2019]/g, "'");      // smart single quotes
            parsed = JSON.parse(fixed);
          }

          // 4. Validate required fields exist, fill defaults if missing
          if (!parsed.hooks || !Array.isArray(parsed.hooks)) parsed.hooks = ["Feeling this way? You're not alone."];
          if (!parsed.script) parsed.script = parsed.tones?.emotional || "Real talk — " + prompt.trim();
          if (!parsed.tones) parsed.tones = { emotional: parsed.script, funny: parsed.script, motivational: parsed.script };
          if (!parsed.caption) parsed.caption = prompt.trim() + " 💯 Drop a ❤️ if you relate!";
          if (!parsed.hashtags) parsed.hashtags = ["#ReelsIndia", "#ViralReel", "#Relatable"];
          if (!parsed.music) parsed.music = "Trending emotional beat";
          if (!parsed.viralScore) parsed.viralScore = { hook: 7, relatability: 8, shareability: 7, overall: 7 };
          if (!parsed.tips) parsed.tips = ["Add text overlays on key lines", "Film with good lighting", "Use trending audio"];

          setReelData(parsed);
          setReelTone("emotional");
          setOutput("__reel__");
          setOutputType("reel");
          setView("rendered");
        } catch (e) {
          // Show raw output so user can see what model returned
          setOutput(text);
          setOutputType("markdown");
          setView("rendered");
          throw new Error("Reel engine got an unexpected response. Shown below — try again or switch model.");
        }
      } else if (expectedType === "html") {
        if (!cleaned.toLowerCase().includes("<!doctype") && !cleaned.toLowerCase().includes("<html")) {
          throw new Error("Model didn't return HTML. Try a different model or rephrase.");
        }
      } else {
        if (!cleaned || cleaned.length < 50) {
          throw new Error("Model returned empty content. Try rephrasing.");
        }
      }

      if (expectedType !== "reel") {
        setOutput(cleaned);
        setOutputType(expectedType);
        setView(expectedType === "html" ? "preview" : "rendered");
      }
      const id = Date.now();
      setCurrentId(id);
      const entry = {
        id, prompt: prompt.trim(), content: cleaned, outputType: expectedType,
        ts: id, model, provider, tab: activeTab,
        subType: activeTab === "app" ? appSubType : activeTab === "planner" ? plannerType : activeTab === "content" ? contentType : docType,
        userId: user?.id || "anon", userName: user?.name || "Guest",
        iterations: [],
      };
      setHistory((h) => [entry, ...h].slice(0, 30));
      // Also add to public repository (optional — only if user is logged in)
      if (user) setRepository((r) => [entry, ...r].slice(0, 100));
      // Save "continue where you left" to localStorage
      const sessionSnap = {
        prompt: prompt.trim().slice(0, 120),
        tab: activeTab,
        contentType: activeTab === "content" ? contentType : null,
        outputType: expectedType,
        ts: id,
      };
      try { localStorage.setItem("forjit_last", JSON.stringify(sessionSnap)); } catch {}
      setLastSession(sessionSnap);
    } catch (e) {
      logError("generate", e);
      setError(e.message || "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  /* ----- Iterate ----- */
  async function iterate(changeRequest) {
    const change = (changeRequest || iterPrompt).trim();
    if (!change || !output || busy) return;
    setIterating(true);
    setError("");
    try {
      const isHtml = outputType === "html";
      const compact = isHtml ? minifyHtml(output) : output;
      let contentToSend = compact;
      if (isHtml && estimateTokens(compact) > 28000) {
        contentToSend = compact.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ");
      }
      const sys = isHtml ? ITERATE_SYSTEM_PROMPT_HTML : ITERATE_SYSTEM_PROMPT_MD;
      const label = isHtml ? "CURRENT HTML" : "CURRENT CONTENT";

      const text = await callLLM([
        { role: "system", content: sys },
        { role: "user", content: `${label}:\n\n${contentToSend}\n\n---\n\nCHANGE REQUEST:\n\n${change}\n\nReturn the complete updated ${isHtml ? "HTML" : "Markdown"}.` },
      ], { onFallback: (from, to, code) => setError(`${from} hit ${code === 413 ? "size" : "rate"} limit — trying ${to}…`) });

      setError("");
      const cleaned = isHtml ? stripCodeFences(text) : stripMarkdownFences(text);
      if (isHtml && !cleaned.toLowerCase().includes("<!doctype") && !cleaned.toLowerCase().includes("<html")) {
        throw new Error("Model didn't return HTML.");
      }
      if (!isHtml && (!cleaned || cleaned.length < 30)) throw new Error("Model returned empty content.");

      setOutput(cleaned);
      const newIterations = [...iterations, change];
      setIterations(newIterations);
      setIterPrompt("");
      setView(isHtml ? "preview" : "rendered");
      const id = Date.now();
      setCurrentId(id);
      setDeployResult(null);
      setHistory((h) => [{
        id, prompt: prompt.trim(), content: cleaned, outputType, ts: id, model, provider,
        tab: activeTab,
        subType: activeTab === "app" ? appSubType : activeTab === "planner" ? plannerType : activeTab === "content" ? contentType : docType,
        userId: user?.id || "anon", userName: user?.name || "Guest",
        iterations: newIterations, parentChange: change, isIteration: true,
      }, ...h].slice(0, 30));
    } catch (e) {
      logError("iterate", e);
      if (e.message?.includes("413")) setError("Content too large. Try a smaller model.");
      else if (e.message?.includes("429")) setError("Rate limited. Wait a minute.");
      else setError(e.message || "Something went wrong.");
    } finally {
      setIterating(false);
    }
  }

  /* ----- Copy / Download ----- */
  function copyContent() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadRaw() {
    if (!output) return;
    const isHtml = outputType === "html";
    const ext = isHtml ? "html" : "md";
    const mime = isHtml ? "text/html" : "text/markdown";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${slugify(prompt)}.${ext}`; a.click();
    URL.revokeObjectURL(url);
  }

  /* ----- PDF generation from Markdown ----- */
  async function downloadAsPDF() {
    if (!output) return;
    setZipping(true);
    try {
      const { jsPDF } = await loadJsPDF();
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 50;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 2 * margin;
      let y = margin;

      const lines = (outputType === "markdown" ? output : output).split("\n");
      for (const line of lines) {
        if (y > 780) { doc.addPage(); y = margin; }
        let text = line;
        let size = 11;
        let style = "normal";
        if (line.startsWith("# ")) { text = line.slice(2); size = 20; style = "bold"; }
        else if (line.startsWith("## ")) { text = line.slice(3); size = 16; style = "bold"; }
        else if (line.startsWith("### ")) { text = line.slice(4); size = 13; style = "bold"; }
        else if (line.startsWith("- ") || line.startsWith("* ")) text = "• " + line.slice(2);
        text = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1");

        doc.setFontSize(size);
        doc.setFont("helvetica", style);
        const wrapped = doc.splitTextToSize(text, maxWidth);
        doc.text(wrapped, margin, y);
        y += size * 1.4 * wrapped.length + 4;
      }
      doc.save(`${slugify(prompt)}.pdf`);
    } catch (e) {
      setError("PDF generation failed: " + e.message);
      logError("pdf", e);
    } finally { setZipping(false); }
  }

  /* ----- DOCX generation from Markdown ----- */
  async function downloadAsDOCX() {
    if (!output) return;
    setZipping(true);
    try {
      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await loadDocx();
      const children = [];
      const lines = output.split("\n");
      for (const line of lines) {
        if (line.startsWith("# ")) {
          children.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 }));
        } else if (line.startsWith("## ")) {
          children.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 }));
        } else if (line.startsWith("### ")) {
          children.push(new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 }));
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          children.push(new Paragraph({ text: line.slice(2), bullet: { level: 0 } }));
        } else if (line.trim() === "") {
          children.push(new Paragraph({ text: "" }));
        } else {
          const plain = line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1");
          children.push(new Paragraph({ children: [new TextRun(plain)] }));
        }
      }
      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${slugify(prompt)}.docx`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("DOCX generation failed: " + e.message);
      logError("docx", e);
    } finally { setZipping(false); }
  }

  /* ----- PPTX generation from Markdown ----- */
  async function downloadAsPPTX() {
    if (!output) return;
    setZipping(true);
    try {
      const PptxGen = await loadPptxGenJS();
      const pptx = new PptxGen();
      pptx.layout = "LAYOUT_16x9";

      // Parse slides: "## Slide N: Title" starts a new slide, bullets are content
      const slides = [];
      let currentSlide = null;
      const lines = output.split("\n");
      for (const line of lines) {
        const slideMatch = line.match(/^##\s+(?:Slide\s+\d+:\s*)?(.+)$/i);
        if (slideMatch) {
          if (currentSlide) slides.push(currentSlide);
          currentSlide = { title: slideMatch[1].trim(), bullets: [] };
        } else if (currentSlide && (line.startsWith("- ") || line.startsWith("* "))) {
          currentSlide.bullets.push(line.slice(2).trim());
        } else if (currentSlide && line.trim() && !line.startsWith("#")) {
          currentSlide.bullets.push(line.trim());
        }
      }
      if (currentSlide) slides.push(currentSlide);

      if (slides.length === 0) {
        // If no ## markers, split by --- or paragraphs as a fallback
        const chunks = output.split(/\n---+\n|\n\n\n+/).filter(c => c.trim());
        chunks.forEach((chunk, i) => {
          const ls = chunk.split("\n").filter(Boolean);
          slides.push({ title: ls[0]?.replace(/^#+\s*/, "") || `Slide ${i + 1}`, bullets: ls.slice(1).map(l => l.replace(/^[-*]\s*/, "").trim()) });
        });
      }

      for (const s of slides) {
        const slide = pptx.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addText(s.title, { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true, color: "1c1917" });
        if (s.bullets.length) {
          slide.addText(
            s.bullets.map(b => ({ text: b, options: { bullet: true } })),
            { x: 0.7, y: 1.3, w: 8.5, h: 4, fontSize: 16, color: "44403c", valign: "top" }
          );
        }
      }
      await pptx.writeFile({ fileName: `${slugify(prompt)}.pptx` });
    } catch (e) {
      setError("PPTX generation failed: " + e.message);
      logError("pptx", e);
    } finally { setZipping(false); }
  }

  /* ----- Project ZIP ----- */
  async function downloadProjectZip() {
    if (!output || zipping) return;
    setZipping(true);
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      const folder = zip.folder(slugify(prompt));
      const isHtml = outputType === "html";
      const ext = isHtml ? "html" : "md";
      folder.file(`index.${ext}`, output);
      folder.file("prompt.txt", prompt);
      folder.file("README.md", `# ${prompt.slice(0, 60)}\n\nGenerated by ${APP_NAME}\nModel: ${model}\n\n## Run\nOpen index.${ext} in any browser.`);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${slugify(prompt)}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("ZIP failed: " + e.message);
    } finally { setZipping(false); }
  }

  /* ----- User upload (session-only) ----- */
  function handleUploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      const isHtml = content.toLowerCase().includes("<!doctype") || content.toLowerCase().includes("<html");
      if (!isHtml) {
        alert("Please upload a complete HTML file.");
        return;
      }
      const entry = {
        id: `upload_${Date.now()}`,
        name: file.name,
        content,
        uploadedAt: new Date().toISOString(),
      };
      setUploadedApps((prev) => [entry, ...prev]);
      setShowUpload(false);
    };
    reader.readAsText(file);
  }

  function loadUploadedApp(app) {
    setOutput(app.content);
    setOutputType("html");
    setView("preview");
    setPrompt(app.name);
    setCurrentId(app.id);
    setIterations([]);
    setError("");
  }

  /* ----- Load from history ----- */
  function loadFromHistory(item) {
    setPrompt(item.prompt);
    setOutput(item.content);
    setOutputType(item.outputType || "html");
    setCurrentId(item.id);
    setIterations(item.iterations || []);
    setView(item.outputType === "html" ? "preview" : "rendered");
    if (item.tab) setActiveTab(item.tab);
    setShowHistory(false);
    setShowRepo(false);
    setError("");
  }

  /* ----- Feedback ----- */
  function submitFeedback() {
    if (!feedbackRating) return;
    setFeedbackList((prev) => [{
      ts: new Date().toISOString(),
      rating: feedbackRating,
      text: feedbackText.trim(),
      prompt: prompt.slice(0, 100),
      userId: user?.id || "anon",
      userName: user?.name || "Guest",
    }, ...prev].slice(0, 200));
    setFeedbackSent(true);
    setTimeout(() => { setFeedbackSent(false); setShowFeedback(false); setFeedbackRating(0); setFeedbackText(""); }, 2000);
  }

  /* ----- Backup/Restore ----- */
  function exportAllData() {
    const data = {
      exported_at: new Date().toISOString(),
      version: 2,
      app: APP_NAME,
      errorLog, history, feedbackList, users, repository,
      settings: { provider, model },
      currentUser: user,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `forjitai-backup-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  async function importAllData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.app || !data.version) throw new Error("Not a valid backup file.");
      if (Array.isArray(data.errorLog)) { setErrorLog(data.errorLog); await dbSet("errorLog", "all", data.errorLog); }
      if (Array.isArray(data.history)) { setHistory(data.history); await dbSet("history", "all", data.history); }
      if (Array.isArray(data.feedbackList)) { setFeedbackList(data.feedbackList); await dbSet("feedback", "all", data.feedbackList); }
      if (Array.isArray(data.users)) { setUsers(data.users); await dbSet("users", "all", data.users); }
      if (Array.isArray(data.repository)) { setRepository(data.repository); await dbSet("history", "repo", data.repository); }
      alert(`✅ Restored ${data.history?.length || 0} items`);
      setShowDataManager(false);
    } catch (e) { alert(`❌ Import failed: ${e.message}`); }
  }

  async function clearAllData() {
    if (!confirm("Delete ALL data? This cannot be undone.")) return;
    await Promise.all(STORES.map(s => dbClear(s)));
    setErrorLog([]); setHistory([]); setFeedbackList([]); setUsers([]); setRepository([]);
    setShowDataManager(false);
  }

  function exportErrorLog() {
    const blob = new Blob([JSON.stringify(errorLog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `forjitai-errors-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  /* ----- PWA Install ----- */
  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setShowInstallBtn(false);
    setDeferredPrompt(null);
  }

  /* ----- Capacitor Android project ZIP (for real APK build) ----- */
  async function downloadCapacitorZip() {
    if (!output || outputType !== "html" || zipping) return;
    setZipping(true);
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      const folderName = slugify(prompt) + "-android";
      const folder = zip.folder(folderName);
      const appName = (prompt || "My App").slice(0, 40);
      const appId = `com.forjitai.${slugify(prompt).replace(/-/g, "")}`.slice(0, 60);

      folder.file("package.json", JSON.stringify({
        name: slugify(prompt),
        version: "1.0.0",
        scripts: { build: "npx cap sync && npx cap build android", open: "npx cap open android" },
        dependencies: { "@capacitor/android": "^6.0.0", "@capacitor/core": "^6.0.0" },
        devDependencies: { "@capacitor/cli": "^6.0.0" },
      }, null, 2));

      folder.file("capacitor.config.json", JSON.stringify({
        appId, appName, webDir: "www", bundledWebRuntime: false,
        server: { androidScheme: "https" },
      }, null, 2));

      folder.file("www/index.html", output);

      folder.file("BUILD_APK.md", `# Build APK for "${appName}"

Prerequisites: Node 18+, Java JDK 17, Android Studio.

## Steps

\`\`\`bash
npm install
npx cap add android
npx cap sync
npx cap open android
# In Android Studio: Build → Build APK(s)
# Output: android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

## App Info
- Name: ${appName}
- ID: ${appId}
- Min Android: 6.0
`);

      folder.file(".gitignore", "node_modules/\nandroid/\n*.keystore\n");
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${folderName}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setDeployError("Capacitor ZIP failed: " + e.message);
      logError("capacitor", e);
    } finally { setZipping(false); }
  }

  /* ----- Deploy to Gist ----- */
  async function deployToGist() {
    if (!output || outputType !== "html") return;
    if (!ghToken.trim()) { setDeployError("Add a GitHub token in Settings."); return; }
    setDeploying(true);
    setDeployError("");
    try {
      const res = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: { Authorization: `Bearer ${ghToken.trim()}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ description: `${APP_NAME} — ${prompt.slice(0, 80)}`, public: true, files: { "index.html": { content: output } } }),
      });
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      const gist = await res.json();
      const rawUrl = gist.files?.["index.html"]?.raw_url;
      setDeployResult({ previewUrl: rawUrl ? `https://htmlpreview.github.io/?${rawUrl}` : null, gistUrl: gist.html_url, rawUrl });
    } catch (e) {
      setDeployError(e.message);
      logError("deploy", e);
    } finally { setDeploying(false); }
  }

  function copyField(key, value) {
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(""), 1500);
  }

  function reset() {
    setPrompt(""); setOutput(""); setError(""); setCurrentId(null); setIterations([]); setIterPrompt(""); setDeployResult(null); setReelData(null);
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); generate(); }
  }

  /* ----- Tab colors ----- */
  const tabColors = {
    amber:  { btn: "bg-amber-400 text-stone-950 border-amber-400",   badge: "bg-amber-400/20 text-amber-300"   },
    emerald:{ btn: "bg-emerald-400 text-stone-950 border-emerald-400",badge: "bg-emerald-400/20 text-emerald-300"},
    sky:    { btn: "bg-sky-400 text-stone-950 border-sky-400",        badge: "bg-sky-400/20 text-sky-300"       },
    violet: { btn: "bg-violet-400 text-stone-950 border-violet-400",  badge: "bg-violet-400/20 text-violet-300" },
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 font-sans antialiased">
      <div className="grain min-h-screen">
        {/* HEADER */}
        <header className="border-b border-stone-800/80 px-4 md:px-10 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-30 bg-stone-950/85">
          <div className="flex items-center gap-3">
            <ForjitLogo size="md" showTag={false} />
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {showInstallBtn && (
              <button onClick={handleInstall} className="px-3 py-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-300 hover:bg-emerald-500/20 transition flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}
            {user?.isAdmin && (
              <button onClick={() => setShowAdmin(true)} className="px-3 py-1.5 rounded-md border border-purple-500/40 bg-purple-500/10 text-xs text-purple-300 hover:bg-purple-500/20 transition flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <a href="/tools/" className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition hidden md:flex items-center gap-1.5">Tools</a>
            <a href="/blog/" className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition hidden md:flex items-center gap-1.5">Blog</a>
            <a href="/ott/" className="px-3 py-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 text-xs text-amber-300 hover:bg-amber-500/20 transition hidden md:flex items-center gap-1.5">🎬 OTT</a>
            <button onClick={() => setShowRepo(true)} className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </button>
            <button onClick={() => setShowHistory(true)} className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition flex items-center gap-1.5">
              <History className="w-4 h-4" />
              {history.length > 0 && <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">{history.length}</span>}
            </button>
            {errorLog.length > 0 && (
              <button onClick={() => setShowErrorLog(true)} className="px-3 py-1.5 rounded-md border border-rose-500/30 text-xs text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-1.5">
                <Bug className="w-4 h-4" />
                <span className="hidden sm:inline">{errorLog.length}</span>
              </button>
            )}
            <button onClick={() => setShowDataManager(true)} className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition hidden md:flex items-center gap-1.5">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setShowSettings(true)} className="px-3 py-1.5 rounded-md border text-xs transition flex items-center gap-1.5 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            {user ? (
              <button onClick={() => setShowAuth(true)} className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/20 transition flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button onClick={() => setShowAuth(true)} className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-xs transition flex items-center gap-1.5">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-10 pb-24 md:pb-10">
          {/* Connect prompt for new users */}
          {!hasOwnKey && (
            <section className="mb-8 slide-up">
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-md bg-amber-400/10 text-amber-300 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-200">Working free — add your key for unlimited use</p>
                    <p className="text-[11px] text-stone-500">Free Groq key at console.groq.com · Takes 30 seconds · Better quality + no limits</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="shrink-0 px-3 py-1.5 rounded-md border border-amber-400/30 text-amber-300 text-xs hover:bg-amber-400/10 transition"
                >
                  Add key ↗
                </button>
              </div>
            </section>
          )}

          {/* Hero */}
          <section className="mb-8 hero-1">
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">Forjit AI</span>
              <br />
              <span className="text-stone-200 text-2xl md:text-4xl font-normal italic">Build apps, generate content, and use<br className="hidden md:block" /> smart tools — all in one place.</span>
            </h1>
            <p className="text-stone-400 text-sm md:text-base max-w-2xl font-sans mt-2 hero-2">
              Free AI platform for India — app generator, content creator, 60+ smart tools. No login needed.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 hero-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
              Initial phase — actively evolving · not production-ready yet
            </div>
          </section>

          {/* ── QUICK ACTIONS ─────────────────────────────────────────── */}
          <section className="mb-8 hero-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Create App */}
              <button
                onClick={() => {
                  setActiveTab("app");
                  setPrompt("Build a Pomodoro timer app with dark theme, circular progress ring, and sound alert");
                  generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => textareaRef.current?.focus(), 400);
                }}
                className="card-shine group relative overflow-hidden rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 via-stone-900/80 to-stone-900 p-5 text-left hover:border-blue-500/50 hover:from-blue-500/15 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center mb-3">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="font-display text-lg font-semibold text-stone-100 mb-1">Create App</div>
                <div className="text-xs text-stone-400 leading-relaxed mb-3">Web apps, mobile UIs, dashboards — from one prompt</div>
                <div className="text-[11px] font-mono text-stone-600 mb-2 italic">"Build a Pomodoro timer app…"</div>
                <div className="flex items-center gap-1 text-xs text-blue-300/80 font-medium group-hover:gap-2 transition-all">
                  Start building <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Create Content */}
              <button
                onClick={() => {
                  setActiveTab("content");
                  setContentType("lesson_plan");
                  setPrompt("");
                  generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => textareaRef.current?.focus(), 400);
                }}
                className="card-shine group relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-stone-900/80 to-stone-900 p-5 text-left hover:border-violet-500/50 hover:from-violet-500/15 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center mb-3">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div className="font-display text-lg font-semibold text-stone-100 mb-1">Create Content</div>
                <div className="text-xs text-stone-400 leading-relaxed mb-3">Lesson plans, sermons, blogs, study notes & speeches</div>
                <div className="text-[11px] font-mono text-stone-600 mb-2 italic">"Lesson plan for Class 5 Science…"</div>
                <div className="flex items-center gap-1 text-xs text-violet-300/80 font-medium group-hover:gap-2 transition-all">
                  Generate now <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Explore Tools */}
              <a
                href="/tools/"
                className="card-shine group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-stone-900/80 to-stone-900 p-5 text-left hover:border-emerald-500/50 hover:from-emerald-500/15 transition-all duration-300 block"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-display text-lg font-semibold text-stone-100 mb-1">Explore Tools</div>
                <div className="text-xs text-stone-400 leading-relaxed mb-3">Teacher, nursing, priest, finance & 60+ Indian tools</div>
                <div className="text-[11px] font-mono text-stone-600 mb-2 italic">EMI, BMI, GST, Sermon Builder…</div>
                <div className="flex items-center gap-1 text-xs text-emerald-300/80 font-medium group-hover:gap-2 transition-all">
                  Browse all <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>
          </section>

          {/* ── CONTINUE WHERE YOU LEFT ───────────────────────────── */}
          {(history.length > 0 || lastSession) && (
            <section className="mb-6 hero-5">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-stone-500" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">Continue where you left</span>
              </div>

              {/* lastSession banner — shown when no in-memory history yet (fresh page load) */}
              {lastSession && history.length === 0 && (
                <div className="mb-3 flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/5 hover:border-amber-400/35 transition-all group cursor-pointer"
                  onClick={() => {
                    setActiveTab(lastSession.tab || "app");
                    if (lastSession.contentType) setContentType(lastSession.contentType);
                    setPrompt(lastSession.prompt || "");
                    generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setTimeout(() => textareaRef.current?.focus(), 400);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 mb-0.5">
                      {TABS[lastSession.tab]?.label || "Last session"}
                      {lastSession.contentType && ` · ${CONTENT_TYPES[lastSession.contentType]?.label || ""}`}
                    </div>
                    <div className="text-sm text-stone-200 truncate font-medium group-hover:text-white transition">{lastSession.prompt}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400/60 group-hover:gap-2 transition-all shrink-0">
                    Resume <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* In-memory history chips */}
              {history.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {history.slice(0, 3).map((item) => {
                    const tabColors2 = {
                      app:      "border-blue-500/30 bg-blue-500/5 text-blue-300",
                      content:  "border-violet-500/30 bg-violet-500/5 text-violet-300",
                      planner:  "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
                      document: "border-sky-500/30 bg-sky-500/5 text-sky-300",
                    };
                    const tc = tabColors2[item.tab] || tabColors2.app;
                    return (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className={`group px-3 py-2 rounded-xl border ${tc} hover:brightness-125 transition-all text-left max-w-xs`}
                      >
                        <div className="text-[11px] font-mono uppercase tracking-wide opacity-60 mb-0.5">{TABS[item.tab]?.label || item.tab}</div>
                        <div className="text-xs font-medium truncate max-w-[200px] group-hover:text-stone-100 transition">{item.prompt}</div>
                      </button>
                    );
                  })}
                  {history.length > 3 && (
                    <button onClick={() => setShowHistory(true)} className="px-3 py-2 rounded-xl border border-stone-800 hover:border-stone-700 text-xs text-stone-500 hover:text-stone-300 transition">
                      +{history.length - 3} more
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {/* MAIN TABS */}
          <section className="mb-5" ref={generatorRef}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-stone-900/60 border border-stone-800 p-1 rounded-xl">
              {Object.entries(TABS).map(([key, tab]) => {
                const Icon = ICON_MAP[tab.icon] || Code2;
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => { setActiveTab(key); reset(); }}
                    disabled={busy}
                    className={`px-2 md:px-4 py-3 rounded-lg text-xs md:text-sm font-medium transition flex flex-col md:flex-row items-center justify-center gap-1.5 ${
                      active ? tabColors[tab.color].btn + " shadow-lg" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                    } disabled:opacity-40`}
                  >
                    <Icon className="w-4 h-4 md:w-4 md:h-4" />
                    <span className="text-center leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] font-mono text-stone-500 text-center">
              {TABS[activeTab].description}
            </div>
          </section>

          {/* SUB-TYPE SELECTOR */}
          {activeTab === "app" && (
            <AppSubTypeSelector appSubType={appSubType} setAppSubType={setAppSubType} />
          )}

          {activeTab === "content" && (
            <ContentSubTypeSelector contentType={contentType} setContentType={setContentType} />
          )}

          {activeTab === "planner" && (
            <PlannerSubTypeSelector plannerType={plannerType} setPlannerType={setPlannerType} />
          )}

          {activeTab === "document" && (
            <DocSubTypeSelector docType={docType} setDocType={setDocType} />
          )}

          {/* PROMPT INPUT */}
          <div className="relative mb-4">
            <div className={`rounded-xl border transition-all bg-stone-900/60 ${generating ? "border-amber-400/40 glow-amber" : "border-stone-800 hover:border-stone-700 focus-within:border-amber-400/50"}`}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. ${
                  activeTab === "app" ? (appSubType === "mobile" ? "Habit tracker with swipe gestures and bottom nav" : "Pomodoro timer with circular progress ring") :
                  activeTab === "content" ? CONTENT_TYPES[contentType].placeholder :
                  activeTab === "planner" ? PLANNER_TYPES[plannerType].placeholder :
                  DOC_TYPES[docType].placeholder
                }`}
                rows={3}
                disabled={busy}
                className="w-full bg-transparent px-5 py-4 text-stone-100 placeholder-stone-500 resize-none outline-none text-[15px] leading-relaxed"
                style={{ minHeight: "96px", maxHeight: "220px" }}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-stone-800/70 gap-2">
                <div className="flex items-center gap-2">
                  {activeTab === "app" && (
                    <span className="text-[11px] text-stone-500">Describe the app you want to build</span>
                  )}
                  {activeTab === "content" && (
                    <span className="text-[11px] text-stone-500">
                      {contentType === "social" ? "Share a real-life situation or feeling — AI turns it into a viral reel 🔥" : "Describe the content you want to generate"}
                    </span>
                  )}
                  {activeTab === "planner" && (
                    <span className="text-[11px] text-stone-500">Describe your planning needs</span>
                  )}
                  {activeTab === "document" && (
                    <span className="text-[11px] text-stone-500">Describe the document to create</span>
                  )}
                  {activeTab === "app" && (
                    <button onClick={() => setShowUpload(true)} disabled={busy} className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-amber-300 hover:bg-stone-800/50 rounded transition flex items-center gap-1.5 disabled:opacity-40">
                      <Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Upload</span>
                    </button>
                  )}
                  <span className="hidden sm:inline text-[11px] font-mono text-stone-700">⌘/Ctrl+Enter</span>
                </div>
                <div className="flex items-center gap-2">
                  {(output || prompt) && !busy && (
                    <button onClick={reset} className="px-3 py-2 text-xs text-stone-400 hover:text-stone-200 transition flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                  <button onClick={generate} disabled={!prompt.trim() || busy}
                    className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-sm transition flex items-center gap-2 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed">
                    {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Forging</> : <><Zap className="w-4 h-4" strokeWidth={2.5} /> Generate</>}
                  </button>
                </div>
              </div>
            </div>
            {error && <div className="mt-2 text-sm text-rose-400 font-mono flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span></div>}
            {/* Pre-generation notice */}
            {!output && !busy && (
              <p className="mt-2 text-[11px] text-stone-600 font-mono leading-relaxed">
                ⚠ AI results may be inaccurate. Always verify content before professional use. <a href="/terms" className="text-stone-500 hover:text-amber-400 underline underline-offset-2" target="_blank" rel="noreferrer">Terms</a> · <a href="/privacy" className="text-stone-500 hover:text-amber-400 underline underline-offset-2" target="_blank" rel="noreferrer">Privacy</a>
              </p>
            )}
          </div>

          {/* Uploaded apps (session) */}
          {activeTab === "app" && uploadedApps.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">Your uploaded apps · session-only</div>
              <div className="flex flex-wrap gap-2">
                {uploadedApps.map((app) => (
                  <button key={app.id} onClick={() => loadUploadedApp(app)} className="px-3 py-1.5 rounded-full border border-stone-800 hover:border-amber-400/40 hover:bg-amber-400/5 text-xs text-stone-300 hover:text-amber-200 transition flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    {app.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OUTPUT */}
          {(output || generating || reelData) && (
            <section className="slide-up">
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900/60 px-3 py-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {outputType === "reel" ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/15 border border-orange-500/30">
                        <span className="text-[11px] font-semibold text-orange-300">🔥 Reel Package</span>
                      </div>
                    ) : outputType === "html" ? (
                      <>
                        <TabBtn active={view === "preview"} onClick={() => setView("preview")} icon={<Eye className="w-3.5 h-3.5" />} label="Preview" />
                        <TabBtn active={view === "code"} onClick={() => setView("code")} icon={<Code2 className="w-3.5 h-3.5" />} label="Code" />
                      </>
                    ) : (
                      <>
                        <TabBtn active={view === "rendered"} onClick={() => setView("rendered")} icon={<Eye className="w-3.5 h-3.5" />} label="Preview" />
                        <TabBtn active={view === "code"} onClick={() => setView("code")} icon={<FileText className="w-3.5 h-3.5" />} label="Source" />
                      </>
                    )}
                    {iterations.length > 0 && (
                      <span className="ml-2 hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <GitBranch className="w-3 h-3" /> v{iterations.length + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    {/* Context-specific download buttons */}
                    {activeTab === "document" && outputType === "markdown" && (
                      <>
                        {(docType === "resume_pdf" || docType === "report") && (
                          <button onClick={downloadAsPDF} disabled={!output || zipping} className="px-2.5 py-1.5 rounded text-xs font-medium bg-sky-400 hover:bg-sky-300 text-stone-950 transition flex items-center gap-1.5 disabled:opacity-40">
                            {zipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} PDF
                          </button>
                        )}
                        {(docType === "resume_docx" || docType === "cover_letter" || docType === "letter") && (
                          <button onClick={downloadAsDOCX} disabled={!output || zipping} className="px-2.5 py-1.5 rounded text-xs font-medium bg-sky-400 hover:bg-sky-300 text-stone-950 transition flex items-center gap-1.5 disabled:opacity-40">
                            {zipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} DOCX
                          </button>
                        )}
                        {docType === "presentation" && (
                          <button onClick={downloadAsPPTX} disabled={!output || zipping} className="px-2.5 py-1.5 rounded text-xs font-medium bg-sky-400 hover:bg-sky-300 text-stone-950 transition flex items-center gap-1.5 disabled:opacity-40">
                            {zipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} PPTX
                          </button>
                        )}
                      </>
                    )}
                    {outputType === "html" && (
                      <button onClick={() => setShowShare(true)} disabled={!output} className="px-2.5 py-1.5 rounded text-xs font-medium bg-amber-400 hover:bg-amber-300 text-stone-950 transition flex items-center gap-1.5 disabled:opacity-40">
                        <Rocket className="w-3.5 h-3.5" /> Export
                      </button>
                    )}
                    <button onClick={downloadRaw} disabled={!output} className="px-2.5 py-1.5 rounded text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition flex items-center gap-1.5 disabled:opacity-40">
                      <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{outputType === "html" ? ".html" : ".md"}</span>
                    </button>
                    <button onClick={copyContent} disabled={!output} className="px-2.5 py-1.5 rounded text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition flex items-center gap-1.5 disabled:opacity-40">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="relative bg-stone-100" style={{ minHeight: "540px" }}>
                  {busy && (
                    <div className="absolute inset-0 bg-stone-950/95 z-10 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" style={{ animationDelay: "0s" }} />
                        <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" style={{ animationDelay: "0.2s" }} />
                        <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" style={{ animationDelay: "0.4s" }} />
                      </div>
                      <div className="font-display text-lg text-stone-200">{iterating ? "Refining" : "Generating"}…</div>
                      <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mt-1">{currentModel?.label} · {PROVIDERS[provider].name}</div>
                    </div>
                  )}
                  {view === "preview" && output && outputType === "html" && (
                    <iframe key={currentId} title="preview" srcDoc={output} sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" className="w-full bg-white" style={{ height: "540px", border: "none" }} />
                  )}
                  {view === "rendered" && output && outputType === "markdown" && (
                    <div className="prose-md bg-white text-stone-900 p-6 md:p-10 overflow-auto scrollbar-thin" style={{ maxHeight: "540px" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }} />
                  )}
                  {view === "rendered" && outputType === "reel" && reelData && (
                    <ReelOutput data={reelData} tone={reelTone} setTone={setReelTone} reelCopied={reelCopied} setReelCopied={setReelCopied} />
                  )}
                  {view === "code" && output && (
                    <pre className="font-mono text-xs text-stone-300 bg-stone-950 p-5 overflow-auto scrollbar-thin whitespace-pre-wrap" style={{ maxHeight: "540px" }}><code>{output}</code></pre>
                  )}
                </div>
              </div>

              {/* AI ACCURACY DISCLAIMER — shown after every generation */}
              {output && !busy && (
                <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 flex items-start gap-2.5 slide-up">
                  <AlertCircle className="w-4 h-4 text-amber-400/80 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-stone-400 leading-relaxed">
                    <span className="text-amber-300/90 font-semibold">AI-generated — verify before use.</span>{" "}
                    {contentType === "social" && activeTab === "content"
                      ? "This reel content is AI-generated and may not reflect real situations or verified facts. Always review before posting. Forjit AI is not responsible for any harm, misunderstanding, or controversy caused by content you publish. You are solely responsible for what you post."
                      : activeTab === "document"
                      ? "Review all content carefully before submitting to employers, clients, or filing with any authority. AI may produce inaccurate details, dates, or figures."
                      : "Results may contain errors, outdated information, or inaccuracies. Review all content before using professionally or making decisions based on it."
                    }{" "}
                    <a href="/terms" className="text-amber-400/70 hover:text-amber-300 underline underline-offset-2" target="_blank" rel="noreferrer">Terms</a>
                    {" · "}
                    <a href="/privacy" className="text-amber-400/70 hover:text-amber-300 underline underline-offset-2" target="_blank" rel="noreferrer">Privacy</a>
                  </p>
                </div>
              )}

              {/* REFINE PANEL */}
              {output && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-4 slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="w-4 h-4 text-emerald-400" />
                    <div className="font-display text-sm font-semibold text-stone-100">Refine this</div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">describe what to change</span>
                  </div>
                  <div className={`rounded-lg border bg-stone-900/60 transition-all ${iterating ? "border-emerald-400/50 glow-emerald" : "border-stone-800 hover:border-stone-700"}`}>
                    <textarea
                      ref={iterRef}
                      value={iterPrompt}
                      onChange={(e) => setIterPrompt(e.target.value)}
                      onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); iterate(); } }}
                      placeholder="e.g. Make it dark mode. Add sound effects. Bigger fonts."
                      rows={2}
                      disabled={busy}
                      className="w-full bg-transparent px-4 py-3 text-stone-100 placeholder-stone-500 resize-none outline-none text-sm"
                      style={{ minHeight: "56px", maxHeight: "140px" }}
                    />
                    <div className="flex items-center justify-end px-3 py-2 border-t border-stone-800/70">
                      <button onClick={() => iterate()} disabled={!iterPrompt.trim() || busy} className="px-3 py-1.5 rounded-md bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-medium text-xs transition flex items-center gap-1.5 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed">
                        {iterating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Refining</> : <><MessageSquarePlus className="w-3.5 h-3.5" /> Apply</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Deploy result banner */}
              {deployResult?.previewUrl && (
                <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 slide-up">
                  <div className="text-sm font-medium text-emerald-200 mb-2">✓ Live</div>
                  <LinkRow label="URL" url={deployResult.previewUrl} copied={copiedField === "dep"} onCopy={() => copyField("dep", deployResult.previewUrl)} />
                </div>
              )}

              {/* Feedback */}
              {output && !busy && (
                <div className="mt-4 flex items-center justify-center">
                  <button onClick={() => { setShowFeedback(true); setFeedbackSent(false); }} className="px-4 py-2 rounded-full border border-stone-800 hover:border-amber-400/40 hover:bg-amber-400/5 text-xs text-stone-400 hover:text-amber-200 transition flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5" /> Rate this
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ── TOOL CATEGORIES PREVIEW ───────────────────────────── */}
          <section className="mt-14 mb-2 hero-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-100">Specialized Tools</h2>
                <p className="text-xs text-stone-500 mt-0.5">60+ free tools built for India — no login required</p>
              </div>
              <a href="/tools/" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 border border-stone-800 hover:border-amber-400/30 px-3 py-1.5 rounded-lg transition">
                All tools <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto md:overflow-visible scrollbar-thin">
              <div className="flex md:grid md:grid-cols-3 gap-3 pb-2 md:pb-0 min-w-max md:min-w-0">

                {[
                  { href:"/tools/?cat=teacher", emoji:"👩‍🏫", title:"Teacher Tools", sub:"Lesson plans, question papers, rubrics", color:"amber", chips:["Lesson Plan","Question Paper","MCQ"] },
                  { href:"/tools/?cat=priest",  emoji:"📖",  title:"Priest & Spiritual", sub:"Sermon builder, prayers, Bible verses", color:"orange", chips:["Sermon Builder","Prayer","Bible Verse"] },
                  { href:"/tools/?cat=health",  emoji:"🩺",  title:"Nursing & Health", sub:"BMI, calorie, drug & vitals calculators", color:"blue", chips:["BMI","Calorie","Water Intake"] },
                  { href:"/tools/?cat=finance", emoji:"💰",  title:"Finance & Investment", sub:"EMI, SIP, FD, PPF calculators", color:"emerald", chips:["EMI","SIP","FD Calc"] },
                  { href:"/tools/?cat=india",   emoji:"🇮🇳",  title:"India-Specific", sub:"GST, income tax, salary, HRA tools", color:"amber", chips:["GST","Income Tax","PPF"] },
                  { href:"/tools/?cat=civil",   emoji:"🏗️",  title:"Civil Engineering", sub:"Concrete, steel, beam calculators", color:"stone", chips:["Concrete Mix","Steel Bar","Beam Load"] },
                ].map(({ href, emoji, title, sub, color, chips }) => {
                  const border = { amber:"hover:border-amber-400/40 hover:bg-amber-400/5", orange:"hover:border-orange-400/40 hover:bg-orange-400/5", blue:"hover:border-blue-400/40 hover:bg-blue-400/5", emerald:"hover:border-emerald-400/40 hover:bg-emerald-400/5", stone:"hover:border-stone-400/30 hover:bg-stone-400/5" };
                  const chipC = { amber:"bg-amber-400/10 text-amber-400/80", orange:"bg-orange-400/10 text-orange-400/80", blue:"bg-blue-400/10 text-blue-400/80", emerald:"bg-emerald-400/10 text-emerald-400/80", stone:"bg-stone-400/10 text-stone-400/70" };
                  const titleC = { amber:"group-hover:text-amber-200", orange:"group-hover:text-orange-200", blue:"group-hover:text-blue-200", emerald:"group-hover:text-emerald-200", stone:"group-hover:text-stone-100" };
                  return (
                    <a key={href} href={href} className={`group flex-shrink-0 w-60 md:w-auto rounded-xl border border-stone-800 ${border[color]} bg-stone-900/50 p-4 transition-all duration-200 block`}>
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="text-2xl leading-none">{emoji}</span>
                        <div>
                          <div className={`font-medium text-stone-200 text-sm ${titleC[color]} transition leading-tight`}>{title}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5">{sub}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {chips.map(t => <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] ${chipC[color]}`}>{t}</span>)}
                      </div>
                    </a>
                  );
                })}

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 pt-6 border-t border-stone-800/50 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                {visitorCount !== null && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                    <BarChart3 className="w-3 h-3" />
                    <span>{visitorCount.toLocaleString()} visits</span>
                  </div>
                )}
                {activeVisitors !== null && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                    <span>{activeVisitors} online</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-stone-600 flex-wrap justify-center">
                <span>© {new Date().getFullYear()} {APP_NAME} · All rights reserved</span>
                <span>·</span>
                <a href="/tools/" className="hover:text-stone-400">Tools</a>
                <span>·</span>
                <a href="/community" className="hover:text-stone-400">Community</a>
                <span>·</span>
                <a href="/privacy" className="hover:text-stone-400">Privacy</a>
                <span>·</span>
                <a href="/terms" className="hover:text-stone-400">Terms</a>
                <span>·</span>
                <a href="/disclaimer" className="hover:text-stone-400">Disclaimer</a>
                <span>·</span>
                <a href="/contact" className="hover:text-stone-400">Contact</a>
                <span>·</span>
                <a href="mailto:forjitai@gmail.com" className="hover:text-stone-400">forjitai@gmail.com</a>
              </div>
            </div>
          </footer>
        </main>

        {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────
             Only visible on mobile (md:hidden). 5 tabs: Home · Create App ·
             Content · Tools · History                                       */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800/80 safe-bottom">
          <div className="flex items-stretch">

            {/* Home */}
            <a href="/" className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-stone-500 hover:text-stone-200 transition-colors`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
              <span className="text-[10px] font-medium">Home</span>
            </a>

            {/* Create App */}
            <button
              onClick={() => {
                setActiveTab("app");
                reset();
                generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                activeTab === "app" && !output ? "text-amber-400" : "text-stone-500 hover:text-stone-200"
              }`}
            >
              <Code2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">App</span>
              {activeTab === "app" && !output && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Create — centre pill (main CTA) */}
            <button
              onClick={() => {
                setActiveTab("content");
                reset();
                generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => textareaRef.current?.focus(), 400);
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 -mt-3 relative"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                activeTab === "content"
                  ? "bg-violet-500 shadow-violet-500/40"
                  : "bg-gradient-to-br from-amber-400 to-violet-500 shadow-amber-400/30"
              }`}>
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-medium text-stone-400 mt-0.5">Create</span>
            </button>

            {/* Tools */}
            <a
              href="/tools/"
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-stone-500 hover:text-stone-200 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-medium">Tools</span>
            </a>

            {/* History */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-stone-500 hover:text-stone-200 transition-colors relative"
            >
              <History className="w-5 h-5" />
              <span className="text-[10px] font-medium">History</span>
              {history.length > 0 && (
                <span className="absolute top-2 right-[calc(50%-14px)] min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-stone-950 text-[9px] font-bold flex items-center justify-center leading-none">
                  {history.length > 9 ? "9+" : history.length}
                </span>
              )}
            </button>

          </div>
        </nav>

        {/* AUTH MODAL */}
        {showAuth && (
          <Modal
            onClose={() => { setShowAuth(false); setAuthError(""); }}
            icon={<LogIn className="w-5 h-5 text-amber-400" />}
            title={user ? "Account" : "Sign in"}
          >
            <AuthModal
              user={user}
              authEmail={authEmail} setAuthEmail={setAuthEmail}
              authName={authName} setAuthName={setAuthName}
              authError={authError}
              signIn={signIn} logout={logout}
              onClose={() => { setShowAuth(false); setAuthError(""); }}
            />
          </Modal>
        )}

        {/* UPLOAD MODAL */}
        {showUpload && (
          <Modal onClose={() => setShowUpload(false)} icon={<Upload className="w-5 h-5 text-amber-400" />} title="Upload HTML app">
            <div className="space-y-3">
              <p className="text-xs text-stone-400">Upload a complete HTML file. It will be available in this session only and cleared when you refresh.</p>
              <input ref={uploadInputRef} type="file" accept=".html,.htm,text/html" onChange={handleUploadFile} className="hidden" />
              <button onClick={() => uploadInputRef.current?.click()} className="w-full px-4 py-4 rounded-lg border-2 border-dashed border-stone-700 hover:border-amber-400/50 hover:bg-amber-400/5 text-sm text-stone-300 hover:text-amber-200 transition flex items-center justify-center gap-2">
                <FileUp className="w-5 h-5" /> Choose .html file
              </button>
              <p className="text-[10px] text-stone-500 text-center">Max 5MB · single file only</p>
            </div>
          </Modal>
        )}

        {/* SETTINGS */}
        {showSettings && (
          <Drawer onClose={() => setShowSettings(false)} icon={<Settings className="w-5 h-5" />} title="Settings">
            <SettingsPanel
              provider={provider} setProvider={setProvider}
              model={model} setModel={setModel}
              apiKey={apiKey} setApiKey={setApiKey}
              showKey={showKey} setShowKey={setShowKey}
              ghToken={ghToken} setGhToken={setGhToken}
              showGhToken={showGhToken} setShowGhToken={setShowGhToken}
              rememberKeys={rememberKeys} setRememberKeys={setRememberKeys}
              onClose={() => setShowSettings(false)}
              setError={setError}
            />
          </Drawer>
        )}

        {/* HISTORY DRAWER */}
        {showHistory && (
          <Drawer onClose={() => setShowHistory(false)} icon={<History className="w-5 h-5" />} title="Your history">
            <HistoryPanel history={history} currentId={currentId} loadFromHistory={loadFromHistory} />
          </Drawer>
        )}

        {/* REPOSITORY / GALLERY */}
        {showRepo && (
          <Drawer onClose={() => setShowRepo(false)} icon={<Package className="w-5 h-5" />} title="Community Gallery">
            <GalleryPanel repository={repository} loadFromHistory={loadFromHistory} />
          </Drawer>
        )}

        {/* ADMIN PANEL */}
        {showAdmin && user?.isAdmin && (
          <Drawer onClose={() => setShowAdmin(false)} icon={<Shield className="w-5 h-5 text-purple-400" />} title="Admin Panel" wide>
            <AdminPanel
              users={users}
              history={history}
              repository={repository}
              errorLog={errorLog}
              feedbackList={feedbackList}
              exportErrorLog={exportErrorLog}
            />
          </Drawer>
        )}

        {/* ERROR LOG */}
        {showErrorLog && (
          <Drawer onClose={() => setShowErrorLog(false)} icon={<Bug className="w-5 h-5 text-rose-400" />} title={`Error Log (${errorLog.length})`}>
            <p className="text-xs text-stone-500 mb-3">Export and share these to get issues fixed.</p>
            <button onClick={exportErrorLog} className="mb-3 w-full px-3 py-2 rounded border border-stone-800 text-xs text-stone-300 hover:border-stone-700 flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export JSON</button>
            <div className="space-y-2">
              {errorLog.map((e, i) => (
                <div key={i} className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-rose-300 uppercase">{e.context}</span>
                    <span className="text-[10px] font-mono text-stone-500">{new Date(e.ts).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[12px] font-mono text-stone-300 break-all">{e.message}</div>
                  <div className="text-[10px] font-mono text-stone-600 mt-1">{e.provider} · {e.model}</div>
                </div>
              ))}
            </div>
          </Drawer>
        )}

        {/* DATA MANAGER */}
        {showDataManager && (
          <Modal onClose={() => setShowDataManager(false)} icon={<Package className="w-5 h-5" />} title="Backup & Restore">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <Stat label="Items" value={history.length} color="amber" />
                <Stat label="Users" value={users.length} color="emerald" />
                <Stat label="Errors" value={errorLog.length} color="rose" />
                <Stat label="Feedback" value={feedbackList.length} color="sky" />
              </div>
              <p className="text-[12px] text-stone-400">All data stored in browser's IndexedDB. Export to back up or transfer.</p>
              <button onClick={exportAllData} className="w-full px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-sm flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Export everything</button>
              <label className="w-full px-4 py-2.5 rounded-md border border-stone-800 hover:border-stone-700 text-sm text-stone-300 hover:text-stone-100 flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Import backup
                <input type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importAllData(f); e.target.value = ""; }} />
              </label>
              <button onClick={clearAllData} className="w-full px-3 py-2 rounded-md border border-rose-500/30 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5" /> Clear all data</button>
            </div>
          </Modal>
        )}

        {/* FEEDBACK */}
        {showFeedback && (
          <Modal onClose={() => setShowFeedback(false)} icon={<Heart className="w-5 h-5 text-amber-400" />} title="Feedback">
            {feedbackSent ? (
              <div className="text-center py-6"><div className="text-4xl mb-2">🎉</div><div className="font-display text-lg">Thanks!</div></div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">Rating</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setFeedbackRating(n)} className="p-1 hover:scale-110 transition">
                        <Star className={`w-7 h-7 transition ${n <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-stone-600 hover:text-stone-400"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="What did you like or not like?" rows={3} className="w-full bg-stone-950 border border-stone-800 rounded-md p-3 text-stone-100 text-sm resize-none outline-none focus:border-amber-400/50" />
                <button onClick={submitFeedback} disabled={!feedbackRating} className="w-full px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-sm flex items-center justify-center gap-2 disabled:bg-stone-800 disabled:text-stone-600">
                  <Send className="w-4 h-4" /> Submit
                </button>
              </div>
            )}
          </Modal>
        )}

        {/* SHARE / EXPORT */}
        {showShare && (
          <Drawer onClose={() => setShowShare(false)} icon={<Rocket className="w-5 h-5 text-amber-400" />} title="Export & Deploy">
            <SharePanel
              outputType={outputType}
              zipping={zipping} deploying={deploying} deployError={deployError}
              deployResult={deployResult}
              ghToken={ghToken}
              downloadProjectZip={downloadProjectZip}
              downloadRaw={downloadRaw}
              downloadCapacitorZip={downloadCapacitorZip}
              deployToGist={deployToGist}
              onOpenSettings={() => { setShowShare(false); setShowSettings(true); }}
            />
          </Drawer>
        )}
      </div>
    </div>
  );
}

