#!/usr/bin/env node
/* Update all Class/Level AND Board selects in teacher-tools.js */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/teacher-tools.js");

const FULL_LEVELS = [
  "Class 1","Class 2","Class 3","Class 4","Class 5",
  "Class 6","Class 7","Class 8","Class 9","Class 10",
  "Class 11","Class 12",
  "Diploma / Certificate","ITI / Vocational",
  "UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)",
  "B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE",
  "B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch",
  "B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)",
  "PG Year 1","PG Year 2",
  "M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME",
  "M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design",
  "M.Sc Nursing","MHMCT",
  "M.Phil","PhD / Doctorate","Post-Doctoral",
  "UPSC / Competitive Exams","Professional Training",
];

const ALL_BOARDS = [
  "CBSE","ICSE / ISC","NIOS (Open School)",
  "Maharashtra (SSC/HSC)","Tamil Nadu (TNBSE)","Karnataka (KSEEB)",
  "Andhra Pradesh (BSEAP)","Telangana (BSETS)","Kerala (SCERT)",
  "Uttar Pradesh (UPMSP)","Rajasthan (RBSE)","Gujarat (GSEB)",
  "West Bengal (WBBSE/WBCHSE)","Madhya Pradesh (MPBSE)",
  "Punjab (PSEB)","Haryana (HBSE)","Bihar (BSEB)",
  "Odisha (BSE)","Jharkhand (JAC)","Chhattisgarh (CGBSE)",
  "Assam (SEBA/AHSEC)","Himachal Pradesh (HPBOSE)",
  "Uttarakhand (UBSE)","Jammu & Kashmir (JKBOSE)",
  "Delhi (DBSE)","Goa (GBSHSE)","Manipur (BSEM)",
  "Tripura (TBSE)","Meghalaya (MBOSE)","Mizoram (MBSE)",
  "Nagaland (NBSE)","Sikkim (SBSE)","Arunachal Pradesh (DBSE-AP)",
  "IB (International Baccalaureate)",
  "Cambridge (IGCSE / A Level)",
  "Edexcel / Pearson",
  "Central University","State University","Deemed University",
  "Autonomous College","Affiliated College",
  "AICTE Affiliated","UGC Recognized",
  "NMC / Medical Council","Bar Council (Law)",
  "NCHMCT (Hotel Mgmt)","NCVT / SCVT (ITI)",
];

let content = readFileSync(FILE, "utf8");
const orig = content;

const lv = FULL_LEVELS.map(l => `"${l}"`).join(",");
const bv = ALL_BOARDS.map(b => `"${b}"`).join(",");

content = content.replace(/(\{ id: "class"[^}]*options: \[)[^\]]+(\])/g, `$1${lv}$2`);
content = content.replace(/(\{ id: "class"[^"]*"कक्षा[^}]*options: \[)[^\]]+(\])/g, `$1${lv}$2`);
content = content.replace(/(\{ id: "board"[^}]*options: \[)[^\]]+(\])/g, `$1${bv}$2`);

writeFileSync(FILE, content);
console.log(`✅ Levels: ${FULL_LEVELS.length} | Boards: ${ALL_BOARDS.length} | Changed: ${content !== orig}`);
