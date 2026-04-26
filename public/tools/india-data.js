/* ─── Forjit AI · India Data ─────────────────────────────────────────────────
 *
 *  Single source of truth for all India-specific constants used by tools.
 *  This is a plain JS file (not an ES module) so tools can load it via:
 *
 *    <script src="india-data.js"></script>
 *
 *  Then access: INDIA.taxSlabs.new, INDIA.fuel.petrol.delhi, etc.
 *
 *  UPDATE CHECKLIST (check after each Union Budget / quarterly review):
 *    □ taxSlabs.new / taxSlabs.old   — Union Budget (Feb)
 *    □ ppfRate                        — RBI quarterly review
 *    □ fuel                           — Monthly (check iocl.com)
 *    □ bankFD                         — Quarterly
 *    □ gstSlabs                       — GST Council meetings
 *
 *  Last updated: April 2026 (FY 2025-26 Budget)
 * ──────────────────────────────────────────────────────────────────────────*/

const INDIA = {

  /* ── Fiscal year ──────────────────────────────────────────────────────── */
  fy: "2025-26",
  ayDisplay: "AY 2026-27",
  lastUpdated: "April 2026",

  /* ── Income Tax — New Regime (default from FY 2024-25) ─────────────── */
  taxSlabs: {
    new: {
      label: "New Regime (FY 2025-26)",
      standardDeduction: 75000,
      rebateLimit: 700000,       // no tax if taxable ≤ this
      slabs: [
        { upTo: 300000,  rate: 0    },
        { upTo: 700000,  rate: 0.05 },
        { upTo: 1000000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity,rate: 0.30 },
      ],
    },
    old: {
      label: "Old Regime",
      standardDeduction: 50000,
      rebateLimit: 500000,
      slabs: {
        below60: [
          { upTo: 250000,  rate: 0    },
          { upTo: 500000,  rate: 0.05 },
          { upTo: 1000000, rate: 0.20 },
          { upTo: Infinity,rate: 0.30 },
        ],
        senior: [    // 60–80 years
          { upTo: 300000,  rate: 0    },
          { upTo: 500000,  rate: 0.05 },
          { upTo: 1000000, rate: 0.20 },
          { upTo: Infinity,rate: 0.30 },
        ],
        superSenior: [  // 80+ years
          { upTo: 500000,  rate: 0    },
          { upTo: 1000000, rate: 0.20 },
          { upTo: Infinity,rate: 0.30 },
        ],
      },
    },
    cess: 0.04,       // 4% health & education cess
  },

  /* ── GST slabs ──────────────────────────────────────────────────────── */
  gstSlabs: [0, 5, 12, 18, 28],
  gstItems: {
    0:  "Fresh vegetables, milk, eggs, books",
    5:  "Packaged food, medicines, transport",
    12: "Business class air, frozen meat",
    18: "Restaurants, electronics, services",
    28: "Luxury cars, tobacco, aerated drinks",
  },

  /* ── PPF ────────────────────────────────────────────────────────────── */
  ppf: {
    rate: 7.1,           // % p.a. — Q1 FY 2025-26
    minYearly: 500,
    maxYearly: 150000,
    lockIn: 15,          // years
    note: "Q1 FY 2025-26 rate. Subject to quarterly revision.",
  },

  /* ── EPF ────────────────────────────────────────────────────────────── */
  epf: {
    employeeRate: 0.12,  // 12% of basic
    employerRate: 0.12,  // 12% of basic (split: 8.33% EPS + 3.67% EPF)
    interestRate: 8.25,  // % p.a. FY 2023-24
  },

  /* ── Fuel prices (Delhi — indicative, changes monthly) ─────────────── */
  fuel: {
    petrol: {
      delhi:     94.72,
      mumbai:   103.44,
      bengaluru: 102.86,
      chennai:   100.85,
      hyderabad: 107.41,
      kolkata:   104.95,
    },
    diesel: {
      delhi:     87.62,
      mumbai:    89.97,
      bengaluru: 88.94,
      chennai:   92.44,
      hyderabad: 95.65,
      kolkata:   91.76,
    },
    cng: {
      delhi:    75,
      mumbai:   79,
      bengaluru:79,
      chennai:  82,
      hyderabad:88,
      kolkata:  75,
    },
    electricity: 8,  // ₹/unit average
    note: "Approximate rates as of April 2026. Check iocl.com for current prices.",
  },

  /* ── Bank FD rates (indicative, changes quarterly) ──────────────────── */
  bankFD: [
    { bank: "SBI",             general: [6.50, 7.10], senior: [7.00, 7.60] },
    { bank: "HDFC Bank",       general: [7.00, 7.40], senior: [7.50, 7.90] },
    { bank: "ICICI Bank",      general: [6.70, 7.25], senior: [7.20, 7.75] },
    { bank: "Axis Bank",       general: [6.70, 7.20], senior: [7.20, 7.75] },
    { bank: "Kotak Mahindra",  general: [6.20, 7.25], senior: [6.70, 7.75] },
    { bank: "Post Office",     general: [6.90, 7.50], senior: [6.90, 7.50] },
    { bank: "Small Finance",   general: [8.00, 9.50], senior: [8.50, 9.75] },
  ],

  /* ── Gratuity ───────────────────────────────────────────────────────── */
  gratuity: {
    maxExempt: 2000000,      // ₹20L tax-free limit
    coveredFormula: 15 / 26, // basic × years × 15/26
    notCoveredFormula: 15 / 30,
  },

  /* ── HRA ────────────────────────────────────────────────────────────── */
  hra: {
    metroPct: 0.50,     // 50% of basic for metro cities
    nonMetroPct: 0.40,  // 40% of basic for non-metro
    metros: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  },

  /* ── Inflation reference ────────────────────────────────────────────── */
  inflation: {
    currentCPI: 5.1,         // approximate April 2026
    historicalAvg: 6.0,      // 10-year average
    rbTarget: 4.0,           // RBI target
  },

  /* ── Professional Tax (varies by state) ─────────────────────────────── */
  professionalTax: {
    maxAnnual: 2400,
    note: "Max ₹2,400/year. Varies by state. Some states exempt.",
  },
};

/* Make available globally for tool HTML files */
if (typeof window !== "undefined") window.INDIA = INDIA;
if (typeof module !== "undefined") module.exports = INDIA;
