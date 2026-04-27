#!/usr/bin/env python3
"""
Injects guide sections (800+ words content + FAQ + Related Tools)
into tool pages that are missing them.
"""

import os, re

TOOLS_DIR = "public/tools"

# Shared CSS injected once per page (after </style> won't duplicate if already there)
GUIDE_CSS = """<style>
.guide{max-width:740px;margin:32px auto 0;padding:0 16px 52px}
.guide h2{font-size:18px;font-weight:700;margin-bottom:12px;color:#e7e5e4;margin-top:0}
.guide p{font-size:14px;color:#a8a29e;line-height:1.8;margin-bottom:14px}
.guide ul,.guide ol{font-size:14px;color:#a8a29e;padding-left:20px;margin-bottom:14px}
.guide ul li,.guide ol li{margin-bottom:7px;line-height:1.65}
.guide strong{color:#e7e5e4}
.guide a{color:#fbbf24;text-decoration:none}
.guide a:hover{text-decoration:underline}
.guide-card{background:#1c1917;border:1px solid #292524;border-radius:10px;padding:22px;margin-bottom:16px}
.faq-q{font-size:14px;font-weight:700;color:#e7e5e4;margin-bottom:7px}
.faq-a{font-size:13px;color:#a8a29e;line-height:1.75}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:12px}
.related-card{background:#0c0a09;border:1px solid #292524;border-radius:8px;padding:12px;text-decoration:none;color:#a8a29e;font-size:13px;transition:border-color .2s;display:block}
.related-card:hover{border-color:#fbbf24;color:#e7e5e4}
.related-card strong{display:block;color:#e7e5e4;margin-bottom:3px;font-size:13px}
</style>"""

# Content dictionary: each entry = (guide_html, related_tools list)
# related_tools = [(name, href, desc), ...]
GUIDES = {

"sip-calculator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Is a SIP Calculator?</h2>
    <p>A SIP (Systematic Investment Plan) calculator helps you estimate the future value of your mutual fund investments when you invest a fixed amount every month. Instead of trying to time the market, SIPs let you invest small amounts regularly — averaging your purchase price over time.</p>
    <p>How the SIP formula works: Future Value = P × {[(1 + r)^n - 1] / r} × (1 + r), where P = monthly investment amount, r = monthly rate of return (annual rate ÷ 12 ÷ 100), n = number of months.</p>
    <p>For example, a ₹5,000/month SIP at 12% annual returns for 10 years gives a corpus of approximately ₹11.6 lakh on an investment of ₹6 lakh — a gain of ₹5.6 lakh purely from compounding.</p>
  </div>
  <div class="guide-card">
    <h2>SIP vs Lump Sum — Which Is Better?</h2>
    <p>For most salaried individuals in India, SIP is better than lump sum investing for these reasons:</p>
    <ul>
      <li><strong>Rupee Cost Averaging:</strong> You buy more units when markets fall and fewer when they rise — automatically lowering your average cost</li>
      <li><strong>Discipline:</strong> Auto-debit from your bank account removes the temptation to skip investments</li>
      <li><strong>No timing risk:</strong> You don't need to predict market highs and lows</li>
      <li><strong>Accessible:</strong> Start with as little as ₹500/month on most platforms (Groww, Zerodha Coin, Paytm Money)</li>
    </ul>
    <p>Lump sum investing is better when you have a large windfall (bonus, inheritance) and markets are at a historic low — but this requires market timing skill most investors don't have.</p>
  </div>
  <div class="guide-card">
    <h2>Expected SIP Returns in India (Realistic)</h2>
    <ul>
      <li><strong>Large Cap Mutual Funds:</strong> 10–13% annual returns (historical 10-year average)</li>
      <li><strong>Mid Cap Funds:</strong> 12–16% (higher risk, higher reward)</li>
      <li><strong>Small Cap Funds:</strong> 14–18% (highest risk, volatile short-term)</li>
      <li><strong>Index Funds (Nifty 50):</strong> 11–13% (low cost, consistent)</li>
      <li><strong>Debt Funds:</strong> 6–8% (low risk, suitable for goals under 3 years)</li>
    </ul>
    <p>Use 10–12% as a conservative estimate for equity SIPs in this calculator. Do not use 15%+ as a base assumption — it leads to overconfidence.</p>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How much should I invest in SIP per month?</div>
      <div class="faq-a">A common rule of thumb is to invest 20% of your monthly take-home salary in SIPs. For a ₹50,000 take-home salary, that's ₹10,000/month. Use this calculator to see what corpus that builds over your target timeframe at your expected return rate.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">Is SIP safe for investment in India?</div>
      <div class="faq-a">SIPs in mutual funds are regulated by SEBI (Securities and Exchange Board of India). They are not risk-free — market-linked funds can lose value in the short term. However, SIPs in large-cap or index funds have historically delivered positive returns over any 7+ year period in India. ELSS SIPs also qualify for Section 80C deduction up to ₹1.5 lakh/year.</div>
    </div>
    <div>
      <div class="faq-q">Can I stop a SIP anytime?</div>
      <div class="faq-a">Yes. Most mutual fund SIPs in India have no lock-in (except ELSS which has 3 years). You can pause, reduce, or stop your SIP anytime through the fund house's app or website. Your existing units remain invested.</div>
    </div>
  </div>
""", [
  ("EMI Calculator", "/tools/emi-calculator.html", "Loan EMI with amortization"),
  ("FD Calculator", "/tools/fd-calculator.html", "Fixed deposit maturity value"),
  ("PPF Calculator", "/tools/ppf-calculator.html", "Public Provident Fund returns"),
  ("Compound Interest", "/tools/compound-interest-calculator.html", "Compound interest calculator"),
  ("Retirement Calculator", "/tools/retirement-calculator.html", "Plan your retirement corpus"),
]),

"calorie-calculator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Is TDEE and Why Does It Matter?</h2>
    <p>TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including your basal metabolic rate (BMR) plus calories burned through activity. It is the most important number for managing your weight — not just "eat less and move more."</p>
    <p>If you eat fewer calories than your TDEE, you lose weight. If you eat more, you gain weight. The calculator above estimates your TDEE based on your age, gender, weight, height, and activity level using the Mifflin-St Jeor equation — the most accurate formula for most people.</p>
  </div>
  <div class="guide-card">
    <h2>Calorie Targets for Common Goals</h2>
    <ul>
      <li><strong>Fat loss (moderate, 0.5 kg/week):</strong> TDEE minus 500 calories/day</li>
      <li><strong>Fat loss (aggressive, 1 kg/week):</strong> TDEE minus 1000 calories/day (not recommended without medical supervision)</li>
      <li><strong>Maintenance (maintain current weight):</strong> Eat at TDEE</li>
      <li><strong>Muscle gain (lean bulk):</strong> TDEE plus 250–300 calories/day</li>
    </ul>
    <p><strong>Important for Indian diets:</strong> Traditional Indian meals are often high in carbohydrates (rice, roti, dal, potato) and can exceed calorie targets quickly. A typical restaurant thali can contain 800–1200 calories — nearly half a day's intake for an average adult.</p>
  </div>
  <div class="guide-card">
    <h2>Average Calorie Content of Common Indian Foods</h2>
    <ul>
      <li>1 medium roti (30g): ~90 calories</li>
      <li>1 cup cooked rice (150g): ~200 calories</li>
      <li>1 cup dal (250ml): ~150–180 calories</li>
      <li>Butter chicken (1 serving): ~300–400 calories</li>
      <li>Samosa (1 piece): ~150–200 calories</li>
      <li>Dosa (plain, 1 large): ~170 calories</li>
      <li>Idli (2 pieces): ~70 calories</li>
      <li>Masala chai with milk and sugar (1 cup): ~60–80 calories</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How many calories should an average Indian adult eat per day?</div>
      <div class="faq-a">The average Indian adult needs 1,800–2,200 calories/day (women) and 2,000–2,500 calories/day (men), depending on activity level. The Indian Council of Medical Research (ICMR) recommends 1,900 kcal/day for sedentary women and 2,320 kcal/day for sedentary men. Use the calculator above for a personalised estimate based on your body stats.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">Is counting calories effective for weight loss?</div>
      <div class="faq-a">Yes, calorie counting is one of the most evidence-based methods for weight management. However, food quality matters too — 1500 calories of whole foods (dal, vegetables, egg, fruit) will leave you more satisfied and nourished than 1500 calories of processed food. Use calorie tracking as a tool, not an obsession.</div>
    </div>
    <div>
      <div class="faq-q">What is BMR vs TDEE?</div>
      <div class="faq-a">BMR (Basal Metabolic Rate) is the calories your body burns at complete rest — just to keep your organs functioning. TDEE is BMR multiplied by an activity factor. For weight management, use TDEE as your baseline, not BMR.</div>
    </div>
  </div>
""", [
  ("BMI Calculator", "/tools/bmi-calculator.html", "Body Mass Index checker"),
  ("Ideal Weight", "/tools/ideal-weight.html", "Find your healthy weight range"),
  ("Water Intake", "/tools/water-intake.html", "Daily hydration calculator"),
  ("Indian Cooking Planner", "/tools/indian-cooking-planner.html", "AI meal planner for India"),
]),

"discount-calculator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>How to Calculate Discount Percentage</h2>
    <p>A discount calculator helps you quickly find the final price after a percentage reduction, or work backwards to find what percentage off a sale price represents. There are three common calculations:</p>
    <ul>
      <li><strong>Find discounted price:</strong> Final Price = Original Price × (1 - Discount%/100). Example: ₹2,000 at 30% off = ₹2,000 × 0.70 = ₹1,400</li>
      <li><strong>Find discount amount:</strong> Saving = Original Price × Discount%/100. Example: 30% off ₹2,000 = ₹600 saved</li>
      <li><strong>Find discount percentage:</strong> Discount% = ((Original - Final) ÷ Original) × 100. Example: ₹2,000 reduced to ₹1,400 = 30% off</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Smart Shopping Tips for India</h2>
    <p>Online shopping in India during sale events (Amazon Great Indian Festival, Flipkart Big Billion Days, Myntra End of Reason Sale) can offer genuine discounts — but also inflated "original prices." Here's how to shop smarter:</p>
    <ul>
      <li><strong>Check price history:</strong> Use browser extensions to see if the "original price" was inflated before the sale</li>
      <li><strong>Combine discounts:</strong> Bank card offers (10–20% extra) + coupon codes + exchange offers stack with the base discount</li>
      <li><strong>GST-inclusive pricing:</strong> E-commerce prices in India include GST. Use our <a href="/tools/gst-calculator.html">GST Calculator</a> to see the pre-tax price</li>
      <li><strong>Compare across platforms:</strong> The same product can have different "MRP" on Amazon vs Flipkart vs brand website</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How do I calculate 20% off a price?</div>
      <div class="faq-a">Multiply the original price by 0.80 (that's 1 minus 0.20). Example: 20% off ₹1,500 = ₹1,500 × 0.80 = ₹1,200. Saving = ₹300. Or use the discount calculator above — enter ₹1,500 and 20%.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">How do I calculate the original price before discount?</div>
      <div class="faq-a">Original Price = Final Price ÷ (1 - Discount%/100). Example: If you paid ₹1,200 after a 20% discount, original price = ₹1,200 ÷ 0.80 = ₹1,500.</div>
    </div>
    <div>
      <div class="faq-q">What other calculators does Forjit AI have for shopping?</div>
      <div class="faq-a">Forjit AI has a <a href="/tools/gst-calculator.html">GST Calculator</a> (add/remove GST from prices), <a href="/tools/percentage-calculator.html">Percentage Calculator</a>, and <a href="/tools/tip-calculator.html">Tip Calculator</a> for restaurant bills.</div>
    </div>
  </div>
""", [
  ("GST Calculator", "/tools/gst-calculator.html", "Add or remove GST"),
  ("Percentage Calculator", "/tools/percentage-calculator.html", "Any percentage calculation"),
  ("Tip Calculator", "/tools/tip-calculator.html", "Restaurant bill splitter"),
  ("EMI Calculator", "/tools/emi-calculator.html", "Loan EMI calculator"),
]),

"compound-interest-calculator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>The Power of Compound Interest in India</h2>
    <p>Compound interest is often called "the eighth wonder of the world." Unlike simple interest (calculated only on the principal), compound interest earns returns on your previous returns — exponentially growing your wealth over time.</p>
    <p><strong>Formula:</strong> A = P × (1 + r/n)^(nt), where P = principal, r = annual interest rate, n = compounding frequency per year, t = time in years.</p>
    <p>A ₹1 lakh investment at 12% annual compounding for 20 years grows to ₹9.65 lakh — nearly 10x the original amount. The same amount at simple interest would only reach ₹3.4 lakh. That's the power of compounding.</p>
  </div>
  <div class="guide-card">
    <h2>Compounding Frequency Matters</h2>
    <ul>
      <li><strong>Annual compounding:</strong> Interest added once per year (PPF, some FDs)</li>
      <li><strong>Quarterly compounding:</strong> Interest added 4 times/year (most bank FDs in India)</li>
      <li><strong>Monthly compounding:</strong> Interest added 12 times/year (RDs, savings accounts)</li>
      <li><strong>Daily compounding:</strong> Interest added 365 times/year (some savings accounts)</li>
    </ul>
    <p>More frequent compounding = slightly higher effective yield. A 7% rate compounded quarterly gives an effective annual yield of 7.19%. Use the calculator above to compare compounding frequencies.</p>
  </div>
  <div class="guide-card">
    <h2>Compound Interest in Indian Investments</h2>
    <ul>
      <li><strong>PPF (Public Provident Fund):</strong> 7.1% compounded annually. Government-backed, tax-free maturity. 15-year lock-in.</li>
      <li><strong>Bank Fixed Deposits:</strong> 6.5–8% compounded quarterly. Senior citizen rates are 0.25–0.50% higher.</li>
      <li><strong>Recurring Deposits:</strong> Similar to FD rates, compounded quarterly.</li>
      <li><strong>NSC (National Savings Certificate):</strong> 7.7% compounded annually. 5-year lock-in, qualifies for 80C deduction.</li>
      <li><strong>Mutual Funds (Equity):</strong> Market-linked, historically 10–14% CAGR over 10+ years.</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How is compound interest different from simple interest?</div>
      <div class="faq-a">Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously earned interest. Over long periods (10+ years), the difference becomes enormous — compound interest grows exponentially while simple interest grows linearly.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">Which Indian investment gives the best compound interest?</div>
      <div class="faq-a">For guaranteed compound interest, PPF at 7.1% (tax-free) and NSC at 7.7% are strong options. For higher potential returns, equity mutual funds compounding at 10–14% CAGR over 10+ years outperform all fixed-income instruments — but carry market risk.</div>
    </div>
    <div>
      <div class="faq-q">What is the Rule of 72?</div>
      <div class="faq-a">The Rule of 72 is a quick formula to estimate how long it takes to double your money. Divide 72 by the annual interest rate. At 12% returns, your money doubles in 72÷12 = 6 years. At 7.1% (PPF), it doubles in ~10 years.</div>
    </div>
  </div>
""", [
  ("SIP Calculator", "/tools/sip-calculator.html", "Monthly SIP returns"),
  ("FD Calculator", "/tools/fd-calculator.html", "Fixed deposit calculator"),
  ("PPF Calculator", "/tools/ppf-calculator.html", "PPF maturity calculator"),
  ("EMI Calculator", "/tools/emi-calculator.html", "Loan EMI + interest"),
  ("Inflation Calculator", "/tools/inflation-calculator.html", "Real value over time"),
]),

"unit-converter.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>Why You Need a Unit Converter in India</h2>
    <p>India officially uses the metric system (SI units), but in daily life you'll frequently encounter a mix of metric, imperial, and traditional Indian measurements. Property is measured in square feet or bigha, gold in grams or tola, fuel efficiency in kmpl, and recipes in cups or ml. This converter handles all these situations.</p>
    <ul>
      <li><strong>Property:</strong> 1 square yard = 9 square feet. 1 acre = 43,560 sq ft. 1 bigha varies by state (650–2,000 sq yards depending on region)</li>
      <li><strong>Weight/Gold:</strong> 1 tola = 11.66 grams (traditional gold unit). 1 kg = 2.205 pounds</li>
      <li><strong>Temperature:</strong> Indian weather is in Celsius (°C). Oven temperatures in recipes from US sites are in Fahrenheit (°F). °C = (°F - 32) × 5/9</li>
      <li><strong>Fuel:</strong> Indian fuel efficiency is in km per litre (kmpl). US is in miles per gallon (mpg). 1 kmpl ≈ 2.35 mpg</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Commonly Confused Unit Conversions</h2>
    <ul>
      <li><strong>1 inch = 2.54 cm</strong> (important for screen sizes, clothing)</li>
      <li><strong>1 foot = 30.48 cm</strong> (height, room dimensions)</li>
      <li><strong>1 kg = 2.205 pounds</strong> (weight, international shipping)</li>
      <li><strong>1 litre = 1,000 ml = 33.8 fl oz</strong> (beverages, cooking)</li>
      <li><strong>1 mile = 1.609 km</strong> (fitness trackers, international maps)</li>
      <li><strong>0°C = 32°F = 273.15K</strong> (temperature reference point)</li>
      <li><strong>100°C = 212°F</strong> (boiling point of water)</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How many feet in a metre?</div>
      <div class="faq-a">1 metre = 3.281 feet. Conversely, 1 foot = 0.3048 metres. For rough mental math, remember that 3 feet ≈ 1 metre (actually 0.914m, so 3 feet is slightly less than a metre).</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">How to convert Celsius to Fahrenheit?</div>
      <div class="faq-a">Formula: °F = (°C × 9/5) + 32. Reverse: °C = (°F - 32) × 5/9. Quick reference: 0°C = 32°F, 20°C = 68°F, 37°C = 98.6°F (body temperature), 100°C = 212°F.</div>
    </div>
    <div>
      <div class="faq-q">How many grams in a tola?</div>
      <div class="faq-a">1 tola = 11.6638 grams. This is the traditional Indian unit for measuring gold. When buying gold jewellery in India, prices are often quoted per gram or per tola depending on the jeweller.</div>
    </div>
  </div>
""", [
  ("Speed Distance Time", "/tools/speed-distance-time.html", "Speed, distance, time solver"),
  ("Percentage Calculator", "/tools/percentage-calculator.html", "Any percentage calculation"),
  ("Scientific Calculator", "/tools/scientific-calculator.html", "Advanced math calculator"),
  ("Date Calculator", "/tools/date-calculator.html", "Days between dates"),
]),

"qr-generator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Can You Put in a QR Code?</h2>
    <p>A QR (Quick Response) code can encode any text — which makes it incredibly versatile. When your phone camera scans a QR code, it reads the encoded text and takes action depending on its format.</p>
    <ul>
      <li><strong>Website URL:</strong> Opens a webpage directly. Most common use — menus, business cards, posters</li>
      <li><strong>Plain text:</strong> Displays a message when scanned — useful for product information, instructions, notes</li>
      <li><strong>UPI payment:</strong> Encodes a UPI link (upi://pay?pa=...) that opens payment apps like GPay, PhonePe, Paytm directly</li>
      <li><strong>Wi-Fi credentials:</strong> Encodes SSID and password so guests can connect without typing the password (WIFI:T:WPA;S:networkname;P:password;;)</li>
      <li><strong>Contact card (vCard):</strong> Saves a contact to the phone book when scanned</li>
      <li><strong>Email or SMS:</strong> Opens a pre-filled email or text message</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>QR Codes in India — Common Use Cases</h2>
    <ul>
      <li><strong>UPI payments:</strong> Every shop, street vendor, and restaurant in India now accepts UPI QR code payments — a revolution in digital payments</li>
      <li><strong>Restaurant menus:</strong> Post-COVID, most restaurants switched to QR-based digital menus</li>
      <li><strong>Business cards:</strong> Add a QR code to your business card linking to your LinkedIn profile or portfolio</li>
      <li><strong>WhatsApp link:</strong> Create a QR code for your WhatsApp chat link so customers can message you with one scan</li>
      <li><strong>Event check-in:</strong> Event tickets often use QR codes for entry verification</li>
      <li><strong>Government services:</strong> Aadhaar card, vaccination certificates, PAN verification — all use QR codes</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">Is this QR code generator free?</div>
      <div class="faq-a">Yes, completely free. Generate unlimited QR codes, download as PNG, and use them anywhere — for personal or commercial use. No watermarks, no account required.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">Do QR codes expire?</div>
      <div class="faq-a">QR codes generated with this tool encode the data directly — they never expire. The QR code works as long as the destination (URL, text) is still valid. If you encoded a website URL, the QR code stops working only if that URL is deleted or changed.</div>
    </div>
    <div>
      <div class="faq-q">How do I create a UPI QR code?</div>
      <div class="faq-a">Enter your UPI payment link in the format: upi://pay?pa=yourname@upi&pn=YourName — and generate the QR code. When someone scans it, their UPI app will open with your payment details pre-filled. Alternatively, your bank's app or UPI app generates a merchant QR code directly.</div>
    </div>
  </div>
""", [
  ("WhatsApp Link Generator", "/tools/whatsapp-link.html", "Create WhatsApp click links"),
  ("Password Generator", "/tools/password-generator.html", "Generate secure passwords"),
  ("Word Counter", "/tools/word-counter.html", "Count words and characters"),
  ("Base64 Encoder", "/tools/base64-encoder.html", "Encode/decode Base64"),
]),

"word-counter.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>Why Count Words? Common Use Cases</h2>
    <p>Word count matters more than you might think. Different platforms, jobs, and submission types have strict or recommended word count ranges:</p>
    <ul>
      <li><strong>Academic assignments:</strong> University essays typically require 500–2,000 words. Exceeding or falling short can affect grades</li>
      <li><strong>Blog articles:</strong> SEO-optimised blog posts should be 800–1,500 words. Long-form posts (2,000–4,000 words) tend to rank better for competitive keywords</li>
      <li><strong>Social media:</strong> Twitter/X: 280 characters. LinkedIn posts: 700 characters for preview. Instagram captions: 2,200 character limit</li>
      <li><strong>UPSC answers:</strong> UPSC General Studies papers have strict word limits (150, 250 words) per answer — precise counting is critical</li>
      <li><strong>Job applications:</strong> Cover letters should be 250–400 words. Longer is not better</li>
      <li><strong>Novel writing:</strong> A typical novel is 80,000–100,000 words. Short story: 1,000–7,500 words</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Reading Time Estimates</h2>
    <p>The average adult reads approximately 200–250 words per minute. Here are common reading time estimates:</p>
    <ul>
      <li>500 words → ~2 minutes</li>
      <li>1,000 words → ~4–5 minutes</li>
      <li>1,500 words → ~6–7 minutes</li>
      <li>3,000 words → ~12–15 minutes</li>
      <li>10,000 words → ~40–50 minutes</li>
    </ul>
    <p>This calculator uses 225 words/minute as the average. Your actual reading speed may vary — complex technical content takes longer, casual reading goes faster.</p>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">How many words is one page?</div>
      <div class="faq-a">A single-spaced A4 page with standard margins and 12pt font contains approximately 500–600 words. Double-spaced is about 250–300 words per page. For reference, a 1,000-word article fills roughly 2 single-spaced pages.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">What is the word limit for UPSC answers?</div>
      <div class="faq-a">UPSC Mains GS papers typically have 150-word and 250-word answer limits for different questions. UPSC Essay paper answers are 1,000–1,200 words. Use this word counter to stay within limits during practice.</div>
    </div>
    <div>
      <div class="faq-q">Does this word counter count in Hindi or other Indian languages?</div>
      <div class="faq-a">This counter counts words separated by spaces, which works for Romanised Indian text. For Devanagari (Hindi, Marathi, Sanskrit) or other Indian scripts, the character count is accurate, but word counting depends on correct space separation in the text.</div>
    </div>
  </div>
""", [
  ("Case Converter", "/tools/case-converter.html", "UPPER, lower, camelCase"),
  ("Lorem Ipsum", "/tools/lorem-ipsum.html", "Placeholder text generator"),
  ("JSON Formatter", "/tools/json-formatter.html", "Format and validate JSON"),
  ("Base64 Encoder", "/tools/base64-encoder.html", "Encode/decode text"),
]),

"inflation-calculator.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>Understanding Inflation in India</h2>
    <p>Inflation means your money loses purchasing power over time. ₹1,00,000 today will not buy the same amount of goods in 10 years. India's consumer price inflation (CPI) has historically averaged 5–7% annually, though it has fluctuated significantly — reaching 7%+ in 2022–23.</p>
    <p>RBI's inflation target is 4% (with a tolerance band of 2–6%). When inflation exceeds this, RBI raises repo rates — which directly increases home loan, car loan, and personal loan EMIs.</p>
  </div>
  <div class="guide-card">
    <h2>How Inflation Affects Your Savings</h2>
    <ul>
      <li><strong>Savings account (3.5% interest) vs 6% inflation:</strong> You're losing 2.5% real value every year</li>
      <li><strong>FD at 7% vs 6% inflation:</strong> Real return is only 1% after inflation</li>
      <li><strong>Equity mutual funds (12% returns) vs 6% inflation:</strong> Real return is ~6% — wealth actually grows</li>
      <li><strong>Real estate in India:</strong> Historically appreciates at 7–10% in metros — roughly in line with or ahead of inflation</li>
    </ul>
    <p>This is why financial experts consistently say: keeping your money in a savings account long-term is actually losing money in real terms. Investments that beat inflation are essential for wealth preservation.</p>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">What is India's current inflation rate in 2026?</div>
      <div class="faq-a">India's CPI inflation has been tracking in the 4–5% range in early 2026. RBI's target is 4% with a ±2% tolerance band. Food inflation has been the primary driver of higher CPI readings. Always check the latest RBI data for current figures.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">How does inflation affect home loan EMI?</div>
      <div class="faq-a">High inflation causes RBI to raise the repo rate, which increases the MCLR (Marginal Cost of Lending Rate) at banks. This directly increases floating-rate home loan EMIs. A 0.5% rate hike on a ₹50 lakh, 20-year home loan increases the EMI by approximately ₹1,600/month.</div>
    </div>
    <div>
      <div class="faq-q">What investments beat inflation in India?</div>
      <div class="faq-a">Investments that historically beat India's inflation (6–7%) include: equity mutual funds (10–14% CAGR), real estate in growing cities, gold (long-term average ~8% CAGR in INR), and REITs. Fixed-income instruments like FDs and PPF provide limited real returns but offer stability.</div>
    </div>
  </div>
""", [
  ("Compound Interest", "/tools/compound-interest-calculator.html", "See how money grows"),
  ("SIP Calculator", "/tools/sip-calculator.html", "Monthly SIP returns"),
  ("EMI Calculator", "/tools/emi-calculator.html", "Loan EMI + interest cost"),
  ("FD Calculator", "/tools/fd-calculator.html", "Fixed deposit returns"),
]),

"whatsapp-link.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Is a WhatsApp Link Generator?</h2>
    <p>A WhatsApp click-to-chat link lets anyone message you on WhatsApp without saving your number first. When someone clicks the link, WhatsApp opens directly with your number (and optionally a pre-filled message) — no contact saving needed.</p>
    <p>The format of a WhatsApp link is: <code style="background:#0c0a09;padding:2px 6px;border-radius:4px;font-size:12px">https://wa.me/91XXXXXXXXXX?text=Hello</code></p>
    <p>Always include the country code. India's country code is +91. Enter your number without the + and without spaces.</p>
  </div>
  <div class="guide-card">
    <h2>Where to Use Your WhatsApp Link</h2>
    <ul>
      <li><strong>Business website:</strong> Add a "Chat on WhatsApp" button that opens a conversation with your business</li>
      <li><strong>Instagram bio:</strong> Paste the link in your bio so followers can contact you directly</li>
      <li><strong>Email signature:</strong> Include a WhatsApp link alongside your phone number</li>
      <li><strong>Google Business Profile:</strong> Add as a website link so local customers can reach you instantly</li>
      <li><strong>QR code:</strong> Generate a QR code from this link using our <a href="/tools/qr-generator.html">QR Code Generator</a> — print it at your store or counter</li>
      <li><strong>SMS campaigns:</strong> Include in bulk SMS so recipients can click to chat</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">Does the person need to save my number to use a WhatsApp link?</div>
      <div class="faq-a">No. That's the whole point — a WhatsApp click-to-chat link opens a conversation with your number without requiring the other person to save your number in their contacts first. Perfect for businesses and freelancers.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">Can I add a pre-filled message to the link?</div>
      <div class="faq-a">Yes. Add your message in the text field above and it will be URL-encoded into the link. When someone clicks it, WhatsApp opens with your message already typed in the input box — they just need to press send.</div>
    </div>
    <div>
      <div class="faq-q">Does this work for WhatsApp Business accounts?</div>
      <div class="faq-a">Yes, WhatsApp click-to-chat links work identically for personal and Business WhatsApp accounts. Just enter your WhatsApp Business number.</div>
    </div>
  </div>
""", [
  ("QR Code Generator", "/tools/qr-generator.html", "Make QR codes for any link"),
  ("Password Generator", "/tools/password-generator.html", "Secure password creator"),
  ("Word Counter", "/tools/word-counter.html", "Count characters for messages"),
]),

"json-formatter.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Is JSON and Why Format It?</h2>
    <p>JSON (JavaScript Object Notation) is the universal language of APIs — almost every web service, mobile app, and database communicates using JSON. When you receive raw API responses, they're often a single unformatted line of text that's nearly impossible to read.</p>
    <p>A JSON formatter (also called JSON prettifier or JSON beautifier) adds proper indentation and line breaks to make the structure readable. It also validates the JSON — flagging syntax errors like missing commas, unclosed brackets, or unquoted keys.</p>
  </div>
  <div class="guide-card">
    <h2>Common JSON Errors and How to Fix Them</h2>
    <ul>
      <li><strong>Missing comma:</strong> Every key-value pair in an object must be separated by a comma, except the last one. <code style="background:#0c0a09;padding:1px 5px;border-radius:3px;font-size:12px">{"a":1 "b":2}</code> → fix: add comma after 1</li>
      <li><strong>Trailing comma:</strong> JSON does not allow trailing commas. <code style="background:#0c0a09;padding:1px 5px;border-radius:3px;font-size:12px">{"a":1,}</code> is invalid — remove the last comma</li>
      <li><strong>Unquoted keys:</strong> JSON keys must always be in double quotes. <code style="background:#0c0a09;padding:1px 5px;border-radius:3px;font-size:12px">{name: "value"}</code> → fix: <code style="background:#0c0a09;padding:1px 5px;border-radius:3px;font-size:12px">{"name": "value"}</code></li>
      <li><strong>Single quotes:</strong> JSON requires double quotes, not single quotes</li>
      <li><strong>Undefined or NaN values:</strong> These are JavaScript values, not valid JSON. Replace with null or a number</li>
    </ul>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">Is my data safe when I use this JSON formatter?</div>
      <div class="faq-a">Yes. The JSON formatter processes your data entirely in your browser — nothing is sent to any server. Your JSON data never leaves your device. This makes it safe for formatting sensitive API responses or internal data structures.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">What is the difference between JSON and XML?</div>
      <div class="faq-a">Both JSON and XML are data interchange formats. JSON is lighter, easier to read, and natively supported by JavaScript — making it dominant for modern APIs. XML is more verbose but supports attributes, namespaces, and schemas — still used in SOAP APIs, RSS feeds, and enterprise systems.</div>
    </div>
    <div>
      <div class="faq-q">How do I minify JSON (remove formatting)?</div>
      <div class="faq-a">Use the "Minify" button in this tool to strip all whitespace and produce compact JSON. Minified JSON is smaller in file size — useful for production API responses where bandwidth efficiency matters.</div>
    </div>
  </div>
""", [
  ("Base64 Encoder", "/tools/base64-encoder.html", "Encode/decode Base64"),
  ("Number Converter", "/tools/number-converter.html", "Binary, hex, octal converter"),
  ("Password Generator", "/tools/password-generator.html", "Secure password creator"),
  ("QR Generator", "/tools/qr-generator.html", "Generate QR codes"),
]),

"lorem-ipsum.html": ("""
<div class="guide">
  <div class="guide-card">
    <h2>What Is Lorem Ipsum?</h2>
    <p>Lorem Ipsum is the standard placeholder text used in design, typesetting, and web development. It looks like Latin but is actually scrambled sections from a 45 BC work by Cicero — chosen specifically because it has a natural distribution of letters and words that mimics real readable text without distracting the viewer with actual content.</p>
    <p>When you're designing a webpage, app, or document before the real content is ready, Lorem Ipsum lets you see exactly how the layout looks with realistic text blocks — without needing to write actual copy first.</p>
  </div>
  <div class="guide-card">
    <h2>When to Use Lorem Ipsum</h2>
    <ul>
      <li><strong>UI/UX design:</strong> Fill text areas in Figma, Adobe XD, or Sketch mockups to see realistic proportions</li>
      <li><strong>Web development:</strong> Placeholder text while building page layouts before real content arrives</li>
      <li><strong>Print design:</strong> Brochures, magazines, and book layouts use Lorem Ipsum during the design phase</li>
      <li><strong>Email templates:</strong> Fill email body sections when creating reusable templates</li>
      <li><strong>CSS testing:</strong> Test how your typography, font sizes, and line heights look with realistic text volume</li>
    </ul>
    <p><strong>Important:</strong> Never publish Lorem Ipsum as real content on a live website. It signals to visitors (and Google) that the page is incomplete.</p>
  </div>
  <div class="guide-card">
    <h2>Frequently Asked Questions</h2>
    <div style="margin-bottom:16px">
      <div class="faq-q">What does "Lorem Ipsum" mean?</div>
      <div class="faq-a">Lorem Ipsum comes from Cicero's "de Finibus Bonorum et Malorum" (On the Ends of Good and Evil), written in 45 BC. The standard Lorem Ipsum passage begins with "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." which roughly translates to "Pain itself is the love of pain..." — but it's intentionally garbled to avoid being read as real text.</div>
    </div>
    <div style="margin-bottom:16px">
      <div class="faq-q">How many words of Lorem Ipsum do I need?</div>
      <div class="faq-a">For a typical paragraph: 75–100 words. For a full article layout: 300–500 words. For a multi-section page: 500–1,000 words. Use the paragraph and word count options in this generator to get exactly what you need.</div>
    </div>
    <div>
      <div class="faq-q">Is there an alternative to Lorem Ipsum for Indian language designs?</div>
      <div class="faq-a">For Devanagari or other Indian script designs, standard Lorem Ipsum won't work as it uses Latin characters. Consider using actual sample text from Hindi Wikipedia or other public domain content in the appropriate script for your language design work.</div>
    </div>
  </div>
""", [
  ("Word Counter", "/tools/word-counter.html", "Count words in any text"),
  ("Case Converter", "/tools/case-converter.html", "Text case conversion"),
  ("JSON Formatter", "/tools/json-formatter.html", "Format and validate JSON"),
]),

}

def make_related_html(related):
    if not related:
        return ""
    items = "".join(
        f'<a class="related-card" href="{href}"><strong>{name}</strong>{desc}</a>'
        for name, href, desc in related
    )
    return f"""
  <div class="guide-card">
    <h2>🔗 Related Tools</h2>
    <div class="related-grid">{items}</div>
  </div>
</div>"""

def inject_guide(filename, guide_html, related):
    filepath = os.path.join(TOOLS_DIR, filename)
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filename}")
        return
    content = open(filepath).read()
    if "guide-card" in content:
        print(f"SKIP (already has guide): {filename}")
        return
    related_html = make_related_html(related)
    full_guide = GUIDE_CSS + guide_html + related_html + "\n<script"
    content = content.replace("\n<script src=\"tool-common.js\">", full_guide + ' src="tool-common.js">', 1)
    open(filepath, "w").write(content)
    print(f"OK: {filename} ({len(content)} chars)")

for fname, (guide, related) in GUIDES.items():
    inject_guide(fname, guide, related)

print("\nDone.")
