/* ─── Forjit AI · Feature Request Store ─────────────────────────────────────
 *  Stores tool requests in localStorage
 *  Users can upvote, add requests, mark as "building"
 * ─────────────────────────────────────────────────────────────────────────*/

const REQ_KEY    = 'forjit_tool_requests';
const VOTE_KEY   = 'forjit_my_votes';
const CUSTOM_KEY = 'forjit_custom_tools';

/* ── Seed requests (preloaded popular requests) ─────────────────────────── */
const SEED_REQUESTS = [
  { id:'r1', title:'SWP Calculator', desc:'Systematic Withdrawal Plan calculator for mutual funds', cat:'finance',  votes:24, status:'planned',  ts:'2025-03-01' },
  { id:'r2', title:'NPS Calculator', desc:'National Pension System returns and tax benefit calculator', cat:'india', votes:31, status:'planned',  ts:'2025-03-05' },
  { id:'r3', title:'CIBIL Score Guide', desc:'Understand and improve your CIBIL credit score', cat:'finance',       votes:18, status:'open',     ts:'2025-03-10' },
  { id:'r4', title:'Invoice Generator', desc:'GST-compliant invoice PDF generator for freelancers', cat:'india',    votes:42, status:'building', ts:'2025-03-15' },
  { id:'r5', title:'Pregnancy Calculator', desc:'Due date, week-by-week pregnancy tracker', cat:'health',           votes:27, status:'open',     ts:'2025-03-20' },
  { id:'r6', title:'Recipe Cost Calculator', desc:'Calculate cost per serving for Indian recipes', cat:'cooking',   votes:15, status:'open',     ts:'2025-04-01' },
  { id:'r7', title:'Cricket Score Tracker', desc:'Track IPL and local cricket match scores', cat:'utility',         votes:33, status:'open',     ts:'2025-04-05' },
  { id:'r8', title:'Marriage Budget Planner', desc:'Plan Indian wedding budget with vendor tracking', cat:'utility', votes:29, status:'open',     ts:'2025-04-10' },
];

/* ── Init ───────────────────────────────────────────────────────────────── */
function initRequests() {
  const existing = localStorage.getItem(REQ_KEY);
  if (!existing) {
    localStorage.setItem(REQ_KEY, JSON.stringify(SEED_REQUESTS));
  }
}

/* ── CRUD ───────────────────────────────────────────────────────────────── */
export function getRequests() {
  initRequests();
  try {
    const all = JSON.parse(localStorage.getItem(REQ_KEY) || '[]');
    return all.sort((a, b) => b.votes - a.votes);
  } catch { return SEED_REQUESTS; }
}

export function addRequest({ title, desc, cat = 'utility' }) {
  if (!title?.trim()) return null;
  const reqs = getRequests();
  const newReq = {
    id:     'r' + Date.now(),
    title:  title.trim().substring(0, 80),
    desc:   desc?.trim().substring(0, 200) || '',
    cat,
    votes:  1,
    status: 'open',
    ts:     new Date().toISOString().slice(0, 10),
    mine:   true,
  };
  reqs.push(newReq);
  localStorage.setItem(REQ_KEY, JSON.stringify(reqs));

  // Also auto-vote for own request
  const votes = JSON.parse(localStorage.getItem(VOTE_KEY) || '[]');
  votes.push(newReq.id);
  localStorage.setItem(VOTE_KEY, JSON.stringify(votes));

  return newReq;
}

export function voteRequest(id) {
  const votes = JSON.parse(localStorage.getItem(VOTE_KEY) || '[]');
  if (votes.includes(id)) return false; // already voted

  const reqs = getRequests();
  const req  = reqs.find(r => r.id === id);
  if (!req) return false;
  req.votes++;
  localStorage.setItem(REQ_KEY, JSON.stringify(reqs));

  votes.push(id);
  localStorage.setItem(VOTE_KEY, JSON.stringify(votes));
  return true;
}

export function hasVoted(id) {
  const votes = JSON.parse(localStorage.getItem(VOTE_KEY) || '[]');
  return votes.includes(id);
}

export function getMyRequests() {
  return getRequests().filter(r => r.mine);
}

/* ── Custom tools (user-built) ──────────────────────────────────────────── */
export function getCustomTools() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]'); }
  catch { return []; }
}

export function saveCustomTool({ name, desc, html, prompt }) {
  const tools = getCustomTools();
  const tool  = {
    id:      'ct' + Date.now(),
    name:    name.trim().substring(0, 60),
    desc:    desc?.trim().substring(0, 200) || '',
    html,
    prompt,
    created: new Date().toISOString(),
  };
  tools.unshift(tool);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(tools.slice(0, 20)));
  return tool;
}

export function deleteCustomTool(id) {
  const tools = getCustomTools().filter(t => t.id !== id);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(tools));
}

export function exportRequests() {
  const data = {
    exported: new Date().toISOString(),
    site:     'forjitai.in',
    requests: getRequests(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `forjitai-requests-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
