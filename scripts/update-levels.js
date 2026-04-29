#!/usr/bin/env node
/* ─── Update all Class/Level selects to full education ladder ─────────────
 *  Replaces all narrow "Class X-Y" select options with the full
 *  education ladder from Class 1 to PhD.
 * ──────────────────────────────────────────────────────────────────────── */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/teacher-tools.js");

// Full education ladder
const FULL_LEVELS = [
  // School
  "Class 1","Class 2","Class 3","Class 4","Class 5",
  "Class 6","Class 7","Class 8","Class 9","Class 10",
  "Class 11","Class 12",
  // Diploma / Certificate
  "Diploma / Certificate",
  "ITI / Vocational",
  // UG
  "UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)",
  "UG Year 4 (Final)",
  // Specific UG
  "B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE",
  "B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch",
  "B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)",
  // PG
  "PG Year 1","PG Year 2",
  "M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME",
  "M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design",
  "M.Sc Nursing","MHMCT",
  // Research
  "M.Phil","PhD / Doctorate","Post-Doctoral",
  // Other
  "UPSC / Competitive Exams","Professional Training",
];

const opts = FULL_LEVELS.map(l => `"${l}"`).join(",");

let content = readFileSync(FILE, "utf8");
const original = content;

// Pattern: any options array that contains "Class" values on a class/level field
// Replace the options array for any input with id "class" or "level" or label "Class" / "Level"
content = content.replace(
  /(\{ id: "class"[^}]*options: \[)[^\]]+(\])/g,
  `$1${opts}$2`
);
content = content.replace(
  /(\{ id: "level"[^}]*options: \[)[^\]]+(\])/g,
  (match) => {
    // Only replace generic level fields, not specific ones like "viva" levels
    if (match.includes("Board Practical") || match.includes("UG Lab") || 
        match.includes("LLB Year") || match.includes("MBBS Year") ||
        match.includes("Diploma Year") || match.includes("B.Sc Hotel") ||
        match.includes("Certificate (NCHMCT)") || match.includes("NCHMCT")) {
      return match; // keep specific professional ones unchanged
    }
    return match.replace(/(\{ id: "level"[^}]*options: \[)[^\]]+(\])/, `$1${opts}$2`);
  }
);

// Also update Hindi class labels
content = content.replace(
  /(\{ id: "class"[^"]*"कक्षा[^}]*options: \[)[^\]]+(\])/g,
  `$1${opts}$2`
);

const changed = content !== original;
writeFileSync(FILE, content, "utf8");

if (changed) {
  console.log("✅ All class/level selects updated to full education ladder");
  console.log(`   Levels: ${FULL_LEVELS.length} options (Class 1 → PhD)`);
} else {
  console.log("⚠️  No changes made — pattern may not have matched");
}
