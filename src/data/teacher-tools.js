/* ─── Forjit AI · Teacher Tools Config ──────────────────────────────────────
 *
 *  Single source of truth for all 261 teacher tools.
 *  Add a new tool here → run: npm run gen-teacher-tools → HTML auto-created.
 *
 *  Fields:
 *    id            Unique slug (also becomes URL: /tools/teacher/{id}.html)
 *    name          Display name
 *    desc          Short description for tool card + meta description
 *    icon          Emoji icon
 *    category      Category slug (used for hub pages + URL grouping)
 *    subCategory   Sub-category (physics, chemistry, etc.)
 *    audience      "teacher" | "lecturer"
 *    model         "fast" (8B) | "smart" (70B)
 *    maxTokens     Hard output cap
 *    inputs        Array of input field configs
 *    promptTemplate  Lean prompt string with {{key}} placeholders
 *    seoTitle      Full <title> tag
 *    seoDesc       Meta description (max 160 chars)
 *    seoKeywords   Array of target keywords
 *    faqs          5 FAQ items for schema + content
 *    priority      Sitemap priority
 *
 * ──────────────────────────────────────────────────────────────────────────*/

export const TEACHER_CATEGORIES = {
  "cross-subject": { label: "All Teachers",          emoji: "🏫", color: "amber"  },
  "science":       { label: "Science",               emoji: "🔬", color: "blue"   },
  "maths":         { label: "Mathematics",           emoji: "📐", color: "purple" },
  "language":      { label: "Languages",             emoji: "📝", color: "green"  },
  "social-science":{ label: "Social Science",        emoji: "🌍", color: "teal"   },
  "computer":      { label: "Computer Science",      emoji: "💻", color: "indigo" },
  "commerce":      { label: "Commerce",              emoji: "📊", color: "emerald"},
  "arts":          { label: "Arts & Humanities",     emoji: "🏛️", color: "rose"   },
  "professional":  { label: "Professional Courses",  emoji: "🎓", color: "orange" },
  "higher-ed":     { label: "Higher Education",      emoji: "🎓", color: "rose"   },
};

export const TEACHER_TOOLS = [

  /* ════════════════════════════════════════════════════════════════
     CROSS-SUBJECT (All Teachers) — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "lesson-plan-generator",
    name: "Lesson Plan Generator",
    desc: "Generate a complete, structured lesson plan for any subject and class in seconds.",
    icon: "📋",
    category: "cross-subject",
    audience: "teacher",
    model: "smart",
    maxTokens: 700,
    inputs: [
      { id: "subject",  label: "Subject",  type: "text",   placeholder: "e.g. Physics, Hindi, History", required: true },
      { id: "topic",    label: "Topic",    type: "text",   placeholder: "e.g. Newton's Laws of Motion",  required: true },
      { id: "class",    label: "Class",    type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "board",    label: "Board",    type: "select", options: ["CBSE","ICSE / ISC","NIOS (Open School)","Maharashtra (SSC/HSC)","Tamil Nadu (TNBSE)","Karnataka (KSEEB)","Andhra Pradesh (BSEAP)","Telangana (BSETS)","Kerala (SCERT)","Uttar Pradesh (UPMSP)","Rajasthan (RBSE)","Gujarat (GSEB)","West Bengal (WBBSE/WBCHSE)","Madhya Pradesh (MPBSE)","Punjab (PSEB)","Haryana (HBSE)","Bihar (BSEB)","Odisha (BSE)","Jharkhand (JAC)","Chhattisgarh (CGBSE)","Assam (SEBA/AHSEC)","Himachal Pradesh (HPBOSE)","Uttarakhand (UBSE)","Jammu & Kashmir (JKBOSE)","Delhi (DBSE)","Goa (GBSHSE)","Manipur (BSEM)","Tripura (TBSE)","Meghalaya (MBOSE)","Mizoram (MBSE)","Nagaland (NBSE)","Sikkim (SBSE)","Arunachal Pradesh (DBSE-AP)","IB (International Baccalaureate)","Cambridge (IGCSE / A Level)","Edexcel / Pearson","Central University","State University","Deemed University","Autonomous College","Affiliated College","AICTE Affiliated","UGC Recognized","NMC / Medical Council","Bar Council (Law)","NCHMCT (Hotel Mgmt)","NCVT / SCVT (ITI)"] },
      { id: "duration", label: "Duration", type: "select", options: ["30 minutes","45 minutes","60 minutes","90 minutes"] },
    ],
    promptTemplate: `Create a detailed lesson plan.
Subject: {{subject}} | Topic: {{topic}} | Class: {{class}} | Board: {{board}} | Duration: {{duration}}
Include these sections with clear headings:
1. Learning Objectives (3 bullet points)
2. Materials & Resources needed
3. Introduction / Hook (5 mins)
4. Main Teaching Activity (step-by-step)
5. Student Activity / Practice
6. Assessment / Check for Understanding
7. Closure / Summary
8. Homework Assignment
Indian classroom context. Practical and specific.`,
    seoTitle: "Free Lesson Plan Generator for Teachers India | Forjit AI",
    seoDesc: "Generate complete CBSE/ICSE lesson plans for any subject in seconds. Free AI lesson plan maker for Indian teachers. No login required.",
    seoKeywords: ["lesson plan generator India","free lesson plan maker teacher","CBSE lesson plan","lesson plan kaise banaye","AI lesson plan"],
    faqs: [
      { q: "Is this lesson plan generator free?", a: "Yes, completely free. Add your Groq API key (free at console.groq.com) for unlimited use." },
      { q: "Which boards are supported?", a: "CBSE, ICSE, State Board, and IB. Select your board for a contextually appropriate lesson plan." },
      { q: "Can I edit the generated lesson plan?", a: "Yes. Copy the output and edit it in any word processor like Google Docs or MS Word." },
      { q: "Does it work for all subjects?", a: "Yes. Works for Physics, Chemistry, Math, Hindi, English, History, Geography, Computer Science, and more." },
      { q: "How long does it take to generate?", a: "Usually 10-20 seconds depending on the topic complexity." },
    ],
    priority: 0.95,
  },

  {
    id: "mcq-maker",
    name: "MCQ Question Paper Maker",
    desc: "Auto-generate multiple choice questions with answers for any subject and topic.",
    icon: "✅",
    category: "cross-subject",
    audience: "teacher",
    model: "smart",
    maxTokens: 600,
    inputs: [
      { id: "subject",    label: "Subject",           type: "text",   placeholder: "e.g. Science, Maths, English", required: true },
      { id: "topic",      label: "Topic",             type: "text",   placeholder: "e.g. Photosynthesis",           required: true },
      { id: "class",      label: "Class",             type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count",      label: "Number of MCQs",   type: "select", options: ["5","10","15","20","25"] },
      { id: "difficulty", label: "Difficulty",        type: "select", options: ["Easy","Medium","Hard","Mixed"] },
    ],
    promptTemplate: `Generate {{count}} multiple choice questions.
Subject: {{subject}} | Topic: {{topic}} | Class: {{class}} | Difficulty: {{difficulty}}
Format each as:
Q[N]. [Question]
A) [option]  B) [option]  C) [option]  D) [option]
Answer: [correct option letter]

Make questions varied — recall, application, and analysis types. CBSE curriculum context.`,
    seoTitle: "Free MCQ Maker for Teachers | Auto-Generate Quiz Questions | Forjit AI",
    seoDesc: "Generate MCQ question papers for any subject instantly. Free quiz maker for CBSE/ICSE teachers. Create 5-25 MCQs with answers in seconds.",
    seoKeywords: ["MCQ generator for teachers","quiz maker free India","MCQ question paper maker","online MCQ creator CBSE","multiple choice questions generator"],
    faqs: [
      { q: "Can I generate MCQs for any subject?", a: "Yes. Works for all school subjects including Science, Maths, English, Hindi, Social Science, and more." },
      { q: "Are answer keys included?", a: "Yes. Each MCQ comes with the correct answer highlighted." },
      { q: "Can I use these for exams?", a: "Yes. Review and edit as needed before use in exams or practice tests." },
      { q: "What difficulty levels are available?", a: "Easy, Medium, Hard, and Mixed (a combination of all levels)." },
      { q: "Is there a limit on number of MCQs?", a: "You can generate up to 25 MCQs per session. Run multiple times for more." },
    ],
    priority: 0.95,
  },

  {
    id: "assignment-generator",
    name: "Assignment Question Generator",
    desc: "Generate short, long, and application-based assignment questions for any topic.",
    icon: "📄",
    category: "cross-subject",
    audience: "teacher",
    model: "smart",
    maxTokens: 600,
    inputs: [
      { id: "subject",  label: "Subject",         type: "text",   placeholder: "e.g. Geography, Chemistry", required: true },
      { id: "topic",    label: "Topic",            type: "text",   placeholder: "e.g. Water Resources",      required: true },
      { id: "class",    label: "Class",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "types",    label: "Question Types",  type: "select", options: ["Short Answer (2 marks)","Long Answer (5 marks)","Mixed (1+2+5 marks)","Case-Based","Application-Based"] },
      { id: "count",    label: "Total Questions", type: "select", options: ["5","8","10","12","15"] },
    ],
    promptTemplate: `Create an assignment question paper.
Subject: {{subject}} | Topic: {{topic}} | Class: {{class}} | Type: {{types}} | Count: {{count}} questions
Include a mix of:
- Knowledge recall questions
- Understanding/explanation questions
- Application/analysis questions
Number each question. Add marks in brackets. CBSE format. No answers — this is for students.`,
    seoTitle: "Free Assignment Question Generator for Teachers | Forjit AI",
    seoDesc: "Auto-generate assignment questions for any subject and class. Free tool for Indian teachers. Short, long, and case-based questions ready in seconds.",
    seoKeywords: ["assignment question generator","homework question maker teacher","assignment maker CBSE","question paper generator free India"],
    faqs: [
      { q: "What types of questions can it generate?", a: "Short answer, long answer, case-based, and application-based questions, with marks allocation." },
      { q: "Is it aligned to CBSE curriculum?", a: "Yes, questions are generated in CBSE pattern and format." },
      { q: "Can I customise the generated questions?", a: "Yes. Copy the output and edit in any word processor." },
      { q: "Does it generate answer keys too?", a: "Assignment mode generates questions only. Use MCQ Maker for questions with answers." },
      { q: "Can I use it for all classes?", a: "Yes, from Class 6 to Class 12." },
    ],
    priority: 0.9,
  },

  {
    id: "progress-report-comments",
    name: "Progress Report Comment Generator",
    desc: "Generate personalised, positive student progress report comments for any performance level.",
    icon: "💬",
    category: "cross-subject",
    audience: "teacher",
    model: "fast",
    maxTokens: 400,
    inputs: [
      { id: "studentName", label: "Student Name",       type: "text",   placeholder: "e.g. Riya / Arjun", required: true },
      { id: "subject",     label: "Subject",            type: "text",   placeholder: "e.g. Mathematics",  required: true },
      { id: "performance", label: "Performance Level",  type: "select", options: ["Excellent","Good","Average","Needs Improvement","Struggling"] },
      { id: "strength",    label: "Key Strength",       type: "text",   placeholder: "e.g. problem solving, creativity" },
      { id: "area",        label: "Area to Improve",    type: "text",   placeholder: "e.g. time management, revision" },
    ],
    promptTemplate: `Write 3 different progress report comments for a student.
Student: {{studentName}} | Subject: {{subject}} | Performance: {{performance}}
Strength: {{strength}} | Area to improve: {{area}}
Each comment: 2-3 sentences. Positive tone. Professional. Specific. Indian school context.
Label them: Comment 1, Comment 2, Comment 3. Teacher can pick the best one.`,
    seoTitle: "Free Progress Report Comment Generator for Teachers | Forjit AI",
    seoDesc: "Generate personalised student progress report comments instantly. Free tool for Indian school teachers. 3 comment options per student.",
    seoKeywords: ["progress report comments generator","student report card comments India","teacher report writing tool","progress report maker free"],
    faqs: [
      { q: "Can I generate comments for weak students too?", a: "Yes. Select 'Needs Improvement' or 'Struggling' and get constructive, positive comments." },
      { q: "How many comment options do I get?", a: "3 different comment options per student so you can choose the most appropriate one." },
      { q: "Is it suitable for all subjects?", a: "Yes. Enter any subject name and get relevant, subject-specific comments." },
      { q: "Can I edit the comments?", a: "Yes. Copy and personalise as needed before adding to the report card." },
      { q: "Are the comments formal and professional?", a: "Yes. All comments are written in professional English suitable for official report cards." },
    ],
    priority: 0.9,
  },

  {
    id: "parent-letter-generator",
    name: "Parent Communication Letter Generator",
    desc: "Generate professional letters to parents for meetings, behaviour, performance, or general updates.",
    icon: "✉️",
    category: "cross-subject",
    audience: "teacher",
    model: "fast",
    maxTokens: 450,
    inputs: [
      { id: "purpose",      label: "Letter Purpose",   type: "select", options: ["Parent-Teacher Meeting Invite","Student Performance Update","Behaviour Concern","Fee Reminder","Event Announcement","General Update","Student Achievement"] },
      { id: "studentName",  label: "Student Name",     type: "text",   placeholder: "e.g. Rahul Sharma" },
      { id: "class",        label: "Class",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "details",      label: "Key Details",      type: "textarea", placeholder: "Any specific points to include…", rows: 2, required: false },
    ],
    promptTemplate: `Write a formal parent communication letter from a school teacher.
Purpose: {{purpose}} | Student: {{studentName}} | Class: {{class}}
Extra details: {{details}}
Format: Date line, "Dear Parent/Guardian,", body (2-3 paragraphs), closing, signature line "Class Teacher".
Tone: professional, respectful, warm. Indian school context. English language.`,
    seoTitle: "Free Parent Letter Generator for Teachers | Forjit AI",
    seoDesc: "Generate professional parent communication letters instantly. PTM invites, behaviour letters, performance updates. Free tool for Indian teachers.",
    seoKeywords: ["parent letter generator teacher","PTM letter format","parent communication letter India","teacher letter to parents free"],
    faqs: [
      { q: "What types of letters can I generate?", a: "PTM invites, performance updates, behaviour letters, fee reminders, event announcements, and achievement letters." },
      { q: "Is the language professional?", a: "Yes. Letters are written in formal, professional English suitable for school use." },
      { q: "Can I customise the letter?", a: "Yes. Add specific details in the 'Key Details' field and edit the output as needed." },
      { q: "Can I generate Hindi letters?", a: "Currently English only. Hindi letter support coming soon." },
      { q: "Is there a cost?", a: "Completely free. Add your Groq key for unlimited use." },
    ],
    priority: 0.88,
  },

  {
    id: "blooms-taxonomy-questions",
    name: "Bloom's Taxonomy Question Generator",
    desc: "Generate questions at all 6 levels of Bloom's Taxonomy for any topic.",
    icon: "🧠",
    category: "cross-subject",
    audience: "teacher",
    model: "smart",
    maxTokens: 600,
    inputs: [
      { id: "subject", label: "Subject", type: "text",   placeholder: "e.g. Biology, History", required: true },
      { id: "topic",   label: "Topic",   type: "text",   placeholder: "e.g. Cell Division",    required: true },
      { id: "class",   label: "Class",   type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "levels",  label: "Levels",  type: "select", options: ["All 6 Levels","Remember + Understand","Apply + Analyse","Evaluate + Create"] },
    ],
    promptTemplate: `Generate Bloom's Taxonomy questions for a lesson.
Subject: {{subject}} | Topic: {{topic}} | Class: {{class}} | Levels: {{levels}}
For each level, write 2 questions:
1. REMEMBER (recall facts)
2. UNDERSTAND (explain concepts)
3. APPLY (use in new situations)
4. ANALYSE (break down, compare)
5. EVALUATE (judge, argue)
6. CREATE (design, invent)
Label each level clearly. Questions should be thought-provoking and age-appropriate.`,
    seoTitle: "Bloom's Taxonomy Question Generator Free | Forjit AI",
    seoDesc: "Generate questions at all 6 Bloom's Taxonomy levels for any subject. Free tool for Indian teachers. Remember, Understand, Apply, Analyse, Evaluate, Create.",
    seoKeywords: ["blooms taxonomy question generator","higher order thinking questions teacher","HOTs questions generator India","bloom taxonomy questions free"],
    faqs: [
      { q: "What is Bloom's Taxonomy?", a: "Bloom's Taxonomy is a framework with 6 levels of cognitive skills: Remember, Understand, Apply, Analyse, Evaluate, and Create." },
      { q: "Why use Bloom's Taxonomy questions?", a: "They ensure students develop higher-order thinking skills beyond simple memorisation." },
      { q: "Is this useful for B.Ed teachers?", a: "Yes. Bloom's Taxonomy questions are essential for B.Ed lesson plans and microteaching." },
      { q: "Can I select specific levels only?", a: "Yes. Choose 'All 6 Levels' or specific level combinations." },
      { q: "Does it work for all subjects?", a: "Yes. Works for any school subject from Science to Arts." },
    ],
    priority: 0.88,
  },

  {
    id: "rubric-maker",
    name: "Grading Rubric Maker",
    desc: "Create detailed grading rubrics for assignments, projects, and presentations.",
    icon: "📊",
    category: "cross-subject",
    audience: "teacher",
    model: "smart",
    maxTokens: 550,
    inputs: [
      { id: "task",     label: "Task/Assignment",  type: "text",   placeholder: "e.g. Science Project, Essay, Presentation", required: true },
      { id: "subject",  label: "Subject",          type: "text",   placeholder: "e.g. Chemistry",  required: true },
      { id: "class",    label: "Class",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "maxMarks", label: "Total Marks",      type: "select", options: ["10","20","25","50","100"] },
      { id: "criteria", label: "Key Criteria",     type: "text",   placeholder: "e.g. content, presentation, creativity (or leave blank)", required: false },
    ],
    promptTemplate: `Create a grading rubric for teachers.
Task: {{task}} | Subject: {{subject}} | Class: {{class}} | Total Marks: {{maxMarks}}
Criteria hint: {{criteria}}
Create a rubric table with:
- 4-5 evaluation criteria
- 4 performance levels: Excellent / Good / Satisfactory / Needs Improvement
- Marks for each cell
- Clear descriptors for what each level looks like
Format clearly with criteria, levels, marks, and descriptions. Indian school context.`,
    seoTitle: "Free Grading Rubric Maker for Teachers | Forjit AI",
    seoDesc: "Create detailed grading rubrics for any assignment or project. Free rubric generator for Indian school teachers. Clear criteria and marks breakdown.",
    seoKeywords: ["rubric maker teacher free","grading rubric generator India","assignment rubric creator","marking rubric free online"],
    faqs: [
      { q: "What is a grading rubric?", a: "A rubric is a scoring guide with criteria and performance levels to evaluate student work consistently." },
      { q: "Can I create rubrics for projects?", a: "Yes. Works for science projects, essays, presentations, lab reports, art work, and more." },
      { q: "Can I set custom criteria?", a: "Yes. Enter your own criteria in the 'Key Criteria' field or leave blank for AI to suggest." },
      { q: "Is the total marks flexible?", a: "Yes. Choose from 10, 20, 25, 50, or 100 marks." },
      { q: "Can I print the rubric?", a: "Yes. Copy the output and paste into Word or Google Docs for printing." },
    ],
    priority: 0.85,
  },

  /* ════════════════════════════════════════════════════════════════
     SCIENCE TOOLS — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "physics-lesson-plan",
    name: "Physics Lesson Plan Generator",
    desc: "Generate detailed physics lesson plans with experiments and activities for CBSE/ICSE.",
    icon: "⚛️",
    category: "science",
    subCategory: "physics",
    audience: "teacher",
    model: "smart",
    maxTokens: 700,
    inputs: [
      { id: "topic",    label: "Physics Topic", type: "text",   placeholder: "e.g. Newton's Laws, Ohm's Law, Optics", required: true },
      { id: "class",    label: "Class",         type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "board",    label: "Board",         type: "select", options: ["CBSE","ICSE / ISC","NIOS (Open School)","Maharashtra (SSC/HSC)","Tamil Nadu (TNBSE)","Karnataka (KSEEB)","Andhra Pradesh (BSEAP)","Telangana (BSETS)","Kerala (SCERT)","Uttar Pradesh (UPMSP)","Rajasthan (RBSE)","Gujarat (GSEB)","West Bengal (WBBSE/WBCHSE)","Madhya Pradesh (MPBSE)","Punjab (PSEB)","Haryana (HBSE)","Bihar (BSEB)","Odisha (BSE)","Jharkhand (JAC)","Chhattisgarh (CGBSE)","Assam (SEBA/AHSEC)","Himachal Pradesh (HPBOSE)","Uttarakhand (UBSE)","Jammu & Kashmir (JKBOSE)","Delhi (DBSE)","Goa (GBSHSE)","Manipur (BSEM)","Tripura (TBSE)","Meghalaya (MBOSE)","Mizoram (MBSE)","Nagaland (NBSE)","Sikkim (SBSE)","Arunachal Pradesh (DBSE-AP)","IB (International Baccalaureate)","Cambridge (IGCSE / A Level)","Edexcel / Pearson","Central University","State University","Deemed University","Autonomous College","Affiliated College","AICTE Affiliated","UGC Recognized","NMC / Medical Council","Bar Council (Law)","NCHMCT (Hotel Mgmt)","NCVT / SCVT (ITI)"] },
      { id: "duration", label: "Duration",      type: "select", options: ["30 minutes","45 minutes","60 minutes"] },
      { id: "hasLab",   label: "Lab Available?",type: "select", options: ["Yes — include practical activity","No — theory only"] },
    ],
    promptTemplate: `Create a detailed physics lesson plan.
Topic: {{topic}} | Class: {{class}} | Board: {{board}} | Duration: {{duration}} | Lab: {{hasLab}}
Sections:
1. Learning Objectives (3 specific outcomes)
2. Prior Knowledge Required
3. Materials / Apparatus
4. Introduction with a real-life example or demo
5. Concept Explanation (step-by-step)
6. Key Formulae (if any)
7. Practical Activity or Numerical Problems
8. Common Misconceptions to address
9. Assessment Questions (3 questions)
10. Homework
Indian physics curriculum. Precise and practical.`,
    seoTitle: "Free Physics Lesson Plan Generator for Teachers | CBSE ICSE | Forjit AI",
    seoDesc: "Generate complete physics lesson plans for Class 8-12. CBSE and ICSE aligned. Includes experiments, formulae, and assessment questions. Free tool.",
    seoKeywords: ["physics lesson plan generator","CBSE physics lesson plan Class 10","physics teacher lesson planner free","physics lesson plan India"],
    faqs: [
      { q: "Does it include practical activities?", a: "Yes. If you select 'Lab Available', it includes a practical activity or experiment." },
      { q: "Which classes are supported?", a: "Class 8 through Class 12 for Physics." },
      { q: "Are formulae included?", a: "Yes. Relevant formulae are listed in a dedicated section." },
      { q: "Is it CBSE aligned?", a: "Yes. Select CBSE board for curriculum-aligned lesson plans." },
      { q: "Can it handle numerical problems?", a: "Yes. It includes practice numericals appropriate for the topic and class." },
    ],
    priority: 0.88,
  },

  {
    id: "science-mcq-maker",
    name: "Science MCQ Maker (Class 6–10)",
    desc: "Generate science MCQs with answers for Physics, Chemistry, and Biology topics.",
    icon: "🔬",
    category: "science",
    audience: "teacher",
    model: "smart",
    maxTokens: 600,
    inputs: [
      { id: "scienceType", label: "Science Type",     type: "select", options: ["Physics","Chemistry","Biology","General Science (Mixed)"] },
      { id: "topic",       label: "Topic",            type: "text",   placeholder: "e.g. Acids and Bases, Photosynthesis", required: true },
      { id: "class",       label: "Class",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count",       label: "Number of MCQs",  type: "select", options: ["5","10","15","20"] },
    ],
    promptTemplate: `Generate {{count}} science MCQs with answers.
Science: {{scienceType}} | Topic: {{topic}} | Class: {{class}}
Format:
Q[N]. [Question]
A) B) C) D) options on same line
Answer: [letter]
Explanation: [1 line why this is correct]

Include diagram-based questions where relevant. CBSE science curriculum.`,
    seoTitle: "Free Science MCQ Maker for Class 6-10 | Forjit AI",
    seoDesc: "Generate Physics, Chemistry, Biology MCQs with answers for Class 6-10. Free science quiz maker for Indian teachers. CBSE aligned.",
    seoKeywords: ["science MCQ generator class 10","science quiz maker teacher India","physics chemistry biology MCQ free","CBSE science MCQ creator"],
    faqs: [
      { q: "Does it cover Physics, Chemistry, and Biology?", a: "Yes. Select your science type and get subject-specific MCQs." },
      { q: "Are explanations included?", a: "Yes. Each answer comes with a one-line explanation." },
      { q: "Is it CBSE aligned?", a: "Yes. Questions follow CBSE Class 6-10 science syllabus." },
      { q: "Can I generate diagram-based questions?", a: "Yes. The tool includes diagram-based questions where appropriate." },
      { q: "Is there a mark scheme?", a: "MCQs are 1 mark each by default." },
    ],
    priority: 0.85,
  },

  /* ════════════════════════════════════════════════════════════════
     LANGUAGE TOOLS — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "english-essay-outline",
    name: "English Essay Outline Builder",
    desc: "Generate a structured essay outline with introduction, body points, and conclusion.",
    icon: "✍️",
    category: "language",
    subCategory: "english",
    audience: "teacher",
    model: "fast",
    maxTokens: 450,
    inputs: [
      { id: "essayTopic", label: "Essay Topic",  type: "text",   placeholder: "e.g. Importance of Trees, My Favourite Season", required: true },
      { id: "class",      label: "Class",        type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount",  label: "Word Count",   type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words","500+ words"] },
      { id: "type",       label: "Essay Type",   type: "select", options: ["Descriptive","Narrative","Argumentative","Expository","Formal"] },
    ],
    promptTemplate: `Create an English essay outline for students to write from.
Topic: {{essayTopic}} | Class: {{class}} | Length: {{wordCount}} | Type: {{type}}
Provide:
1. TITLE
2. INTRODUCTION (2-3 sentences to start with + hook idea)
3. BODY PARAGRAPH 1 — Main point + supporting ideas (3 bullet points)
4. BODY PARAGRAPH 2 — Main point + supporting ideas (3 bullet points)
5. BODY PARAGRAPH 3 — Main point + supporting ideas (if length allows)
6. CONCLUSION — How to wrap up
7. 5 VOCABULARY WORDS to use
Indian English curriculum context. Age-appropriate language.`,
    seoTitle: "Free English Essay Outline Builder for Teachers | Forjit AI",
    seoDesc: "Generate English essay outlines for any topic and class. Free tool for Indian English teachers. Introduction, body, conclusion ready in seconds.",
    seoKeywords: ["english essay outline generator teacher","essay outline maker India free","CBSE essay writing helper","english essay structure generator"],
    faqs: [
      { q: "Does it write the full essay?", a: "It creates a detailed outline with key points. Students write the full essay from this guide." },
      { q: "What essay types are supported?", a: "Descriptive, narrative, argumentative, expository, and formal essay types." },
      { q: "Is vocabulary included?", a: "Yes. 5 topic-relevant vocabulary words are suggested for each essay." },
      { q: "Is it useful for all classes?", a: "Yes. Works from Class 4 to Class 12 with age-appropriate content." },
      { q: "Can teachers use it for exam prep?", a: "Yes. Great for teaching students how to structure essays before exams." },
    ],
    priority: 0.85,
  },

  {
    id: "hindi-essay-writer",
    name: "Hindi Essay Writer (हिंदी निबंध)",
    desc: "हिंदी में किसी भी विषय पर निबंध बनाएं — CBSE और State Board के लिए।",
    icon: "🇮🇳",
    category: "language",
    subCategory: "hindi",
    audience: "teacher",
    model: "smart",
    maxTokens: 600,
    inputs: [
      { id: "topic",     label: "निबंध का विषय (Topic)", type: "text",   placeholder: "e.g. मेरा प्रिय त्योहार, पर्यावरण संरक्षण", required: true },
      { id: "class",     label: "कक्षा (Class)",          type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "शब्द सीमा (Words)",      type: "select", options: ["100-150 शब्द","200-250 शब्द","300-350 शब्द","400-500 शब्द"] },
    ],
    promptTemplate: `एक उत्कृष्ट हिंदी निबंध लिखें।
विषय: {{topic}} | कक्षा: {{class}} | शब्द सीमा: {{wordCount}}
संरचना:
1. प्रस्तावना (Introduction)
2. मुख्य विषय (2-3 paragraphs with subheadings)
3. उपसंहार (Conclusion)
सरल, शुद्ध हिंदी में। CBSE पाठ्यक्रम के अनुसार। उम्र के अनुकूल भाषा।`,
    seoTitle: "Free Hindi Essay Writer for Teachers | हिंदी निबंध | Forjit AI",
    seoDesc: "हिंदी में किसी भी विषय पर निबंध बनाएं। CBSE और State Board के लिए free Hindi essay generator for teachers.",
    seoKeywords: ["hindi essay writer free","hindi nibandh generator","हिंदी निबंध लेखक AI","CBSE hindi essay maker","hindi essay tool India"],
    faqs: [
      { q: "क्या यह पूरा निबंध लिखता है?", a: "हाँ। यह पूरा हिंदी निबंध प्रस्तावना से उपसंहार तक लिखता है।" },
      { q: "क्या यह CBSE के लिए उपयुक्त है?", a: "हाँ। CBSE और State Board दोनों के पाठ्यक्रम के अनुसार।" },
      { q: "किस कक्षा के लिए उपयोगी है?", a: "Class 4 से Class 12 तक सभी कक्षाओं के लिए।" },
      { q: "क्या भाषा शुद्ध हिंदी में होगी?", a: "हाँ। सरल और शुद्ध हिंदी में निबंध लिखा जाता है।" },
      { q: "क्या इसे edit किया जा सकता है?", a: "हाँ। Copy करके किसी भी editor में edit करें।" },
    ],
    priority: 0.88,
  },

  {
    id: "hindi-patra-lekhan",
    name: "Hindi Patra Lekhan Generator (पत्र लेखन)",
    desc: "Formal and informal Hindi letter generator for Class 6-12 students and teachers.",
    icon: "📮",
    category: "language",
    subCategory: "hindi",
    audience: "teacher",
    model: "fast",
    maxTokens: 450,
    inputs: [
      { id: "patraType",  label: "पत्र का प्रकार (Type)",    type: "select", options: ["औपचारिक पत्र (Formal)","अनौपचारिक पत्र (Informal)","प्रार्थना पत्र (Application)","सम्पादक को पत्र (Editor)"] },
      { id: "topic",      label: "विषय / कारण (Purpose)",   type: "text",   placeholder: "e.g. अवकाश के लिए, शिकायत के लिए, बधाई के लिए", required: true },
      { id: "class",      label: "कक्षा (Class)",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `एक {{patraType}} हिंदी पत्र लिखें।
उद्देश्य: {{topic}} | कक्षा: {{class}}
सही प्रारूप में लिखें:
- प्रेषक का पता / दिनांक
- सम्बोधन
- मुख्य सन्देश (2-3 paragraph)
- समापन
- हस्ताक्षर
शुद्ध हिंदी। CBSE प्रारूप। परीक्षा के लिए उपयुक्त।`,
    seoTitle: "Hindi Patra Lekhan Generator Free | पत्र लेखन | Forjit AI",
    seoDesc: "Hindi formal and informal letter generator for Class 6-12. Free patra lekhan tool for teachers and students. CBSE format. औपचारिक और अनौपचारिक पत्र।",
    seoKeywords: ["hindi patra lekhan generator","हिंदी पत्र लेखन AI","formal letter hindi free","CBSE hindi letter maker","patra lekhan tool"],
    faqs: [
      { q: "किस प्रकार के पत्र बना सकते हैं?", a: "औपचारिक, अनौपचारिक, प्रार्थना पत्र, और सम्पादक को पत्र — सभी CBSE format में।" },
      { q: "क्या format सही होगा?", a: "हाँ। CBSE परीक्षा प्रारूप में पूरे format के साथ पत्र मिलेगा।" },
      { q: "क्या यह exam के लिए उपयोगी है?", a: "हाँ। Board exam के patra lekhan section के लिए बिल्कुल उपयुक्त।" },
      { q: "क्या teacher इसे classroom में use कर सकते हैं?", a: "हाँ। Teacher sample letter दिखाने के लिए और students practice के लिए।" },
      { q: "क्या भाषा सरल होगी?", a: "हाँ। उम्र और कक्षा के अनुसार सरल और शुद्ध हिंदी।" },
    ],
    priority: 0.88,
  },

  /* ════════════════════════════════════════════════════════════════
     MATHEMATICS — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "maths-word-problem-generator",
    name: "Maths Word Problem Generator",
    desc: "Generate original maths word problems with solutions for any topic and class.",
    icon: "🔢",
    category: "maths",
    audience: "teacher",
    model: "smart",
    maxTokens: 550,
    inputs: [
      { id: "topic",      label: "Maths Topic",       type: "text",   placeholder: "e.g. Percentages, Simple Interest, Triangles", required: true },
      { id: "class",      label: "Class",             type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count",      label: "Number of Problems",type: "select", options: ["3","5","8","10"] },
      { id: "difficulty", label: "Difficulty",        type: "select", options: ["Easy","Medium","Hard","Mixed"] },
      { id: "context",    label: "Real-life Context", type: "select", options: ["Shopping / Money","Cricket / Sports","Travel / Distance","Cooking / Recipes","General Mixed"] },
    ],
    promptTemplate: `Generate {{count}} original maths word problems with solutions.
Topic: {{topic}} | Class: {{class}} | Difficulty: {{difficulty}} | Context: {{context}}
For each problem:
Problem [N]: [Engaging story-based problem using Indian names/context]
Solution: Show step-by-step working
Answer: [Final answer with unit]

Use Indian names (Raju, Priya, Deepak etc.) and Indian context (rupees, kilometres). Age-appropriate.`,
    seoTitle: "Free Maths Word Problem Generator for Teachers | Forjit AI",
    seoDesc: "Generate original maths word problems with step-by-step solutions. Free tool for Indian maths teachers. Indian context with real-life scenarios.",
    seoKeywords: ["maths word problem generator India","math story problem maker teacher","word problems with solutions free","maths question generator class 10"],
    faqs: [
      { q: "Are solutions included?", a: "Yes. Every problem includes a step-by-step solution with the final answer." },
      { q: "Is the context Indian?", a: "Yes. Uses Indian names, rupees, and relatable Indian scenarios." },
      { q: "Can I get problems for specific topics?", a: "Yes. Enter any maths topic like percentages, fractions, geometry, algebra, etc." },
      { q: "What difficulty levels are available?", a: "Easy, Medium, Hard, and Mixed difficulty levels." },
      { q: "Can I use these for exams?", a: "Yes. Review the problems and use them in worksheets, tests, or homework." },
    ],
    priority: 0.85,
  },

  /* ════════════════════════════════════════════════════════════════
     SOCIAL SCIENCE — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "history-timeline-generator",
    name: "History Timeline Generator",
    desc: "Generate clear, structured timelines of historical events for any period or topic.",
    icon: "📜",
    category: "social-science",
    subCategory: "history",
    audience: "teacher",
    model: "fast",
    maxTokens: 500,
    inputs: [
      { id: "period",  label: "Historical Period / Topic", type: "text",   placeholder: "e.g. Indian Independence Movement, Mughal Empire", required: true },
      { id: "class",   label: "Class",                    type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "detail",  label: "Detail Level",             type: "select", options: ["Brief (key events only)","Standard (events + significance)","Detailed (events + causes + impact)"] },
    ],
    promptTemplate: `Create a structured history timeline.
Period/Topic: {{period}} | Class: {{class}} | Detail: {{detail}}
Format:
TIMELINE: [Title]
[Year/Period] — [Event] — [Significance / Brief note]
...continue chronologically...
KEY TAKEAWAYS: 3 bullet points about this period
End with: 3 exam-likely questions from this timeline
CBSE/NCERT curriculum context.`,
    seoTitle: "Free History Timeline Generator for Teachers | Forjit AI",
    seoDesc: "Generate structured history timelines for any period or topic. Free tool for Indian history teachers. CBSE/NCERT aligned. Class 6-12.",
    seoKeywords: ["history timeline generator India","CBSE history timeline maker","history notes generator teacher","Indian history timeline free"],
    faqs: [
      { q: "Does it cover Indian history?", a: "Yes. Works excellently for Indian independence, Mughal era, ancient India, and modern history." },
      { q: "Is it NCERT aligned?", a: "Yes. Timelines follow NCERT and CBSE curriculum context." },
      { q: "Are exam questions included?", a: "Yes. 3 exam-likely questions are included with each timeline." },
      { q: "Can I use it for world history?", a: "Yes. Works for any historical period — Indian or world history." },
      { q: "Which classes is it suitable for?", a: "Class 6 through Class 12." },
    ],
    priority: 0.82,
  },

  /* ════════════════════════════════════════════════════════════════
     HIGHER EDUCATION — Phase 1
  ════════════════════════════════════════════════════════════════ */

  {
    id: "research-abstract-writer",
    name: "Research Paper Abstract Writer",
    desc: "Write a structured, academic abstract for research papers in any discipline.",
    icon: "🎓",
    category: "higher-ed",
    audience: "lecturer",
    model: "smart",
    maxTokens: 450,
    inputs: [
      { id: "title",      label: "Paper Title",      type: "text",     placeholder: "e.g. Impact of Social Media on Student Learning", required: true },
      { id: "discipline", label: "Discipline",       type: "text",     placeholder: "e.g. Education, Computer Science, Economics",     required: true },
      { id: "objective",  label: "Main Objective",   type: "textarea", placeholder: "What is the paper trying to find out or prove?",  rows: 2, required: true },
      { id: "findings",   label: "Key Findings",     type: "textarea", placeholder: "What were the main results or conclusions?",      rows: 2, required: true },
      { id: "method",     label: "Methodology",      type: "text",     placeholder: "e.g. Survey, Case Study, Experimental",          required: false },
    ],
    promptTemplate: `Write a structured academic research paper abstract.
Title: {{title}} | Discipline: {{discipline}} | Method: {{method}}
Objective: {{objective}}
Findings: {{findings}}
Write a 150-200 word abstract with these sections (no headings, flowing paragraph):
- Background/Context (1-2 sentences)
- Objective/Purpose (1 sentence)
- Methodology (1-2 sentences)
- Key Findings (2-3 sentences)
- Conclusion/Implications (1-2 sentences)
Academic English. Passive voice where appropriate. Past tense for methodology/findings.`,
    seoTitle: "Free Research Paper Abstract Writer | Forjit AI",
    seoDesc: "Write a structured academic abstract for your research paper in seconds. Free AI abstract generator for Indian college lecturers and researchers.",
    seoKeywords: ["research abstract writer free India","academic abstract generator","research paper abstract maker","abstract writing tool India"],
    faqs: [
      { q: "How long is the generated abstract?", a: "150-200 words, following standard academic abstract conventions." },
      { q: "Is it suitable for journal submissions?", a: "It provides a strong draft. Review and adjust before submission to specific journals." },
      { q: "Does it follow academic writing style?", a: "Yes. Uses passive voice, past tense, and formal academic English." },
      { q: "Can it handle any research discipline?", a: "Yes. Works for education, science, social science, engineering, commerce, and more." },
      { q: "Do I need to provide all fields?", a: "Title, objective, and findings are required. Methodology is optional but improves quality." },
    ],
    priority: 0.85,
  },

  {
    id: "lecture-notes-maker",
    name: "Lecture Notes Maker",
    desc: "Convert any topic into well-structured lecture notes with key points and examples.",
    icon: "📓",
    category: "higher-ed",
    audience: "lecturer",
    model: "smart",
    maxTokens: 650,
    inputs: [
      { id: "subject", label: "Subject",       type: "text",   placeholder: "e.g. Microeconomics, Organic Chemistry", required: true },
      { id: "topic",   label: "Topic",         type: "text",   placeholder: "e.g. Law of Demand, Aldol Condensation",  required: true },
      { id: "level",   label: "Level",         type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "depth",   label: "Depth",         type: "select", options: ["Overview (key points)","Standard (explanations + examples)","Detailed (full lecture notes)"] },
    ],
    promptTemplate: `Create structured lecture notes for college students.
Subject: {{subject}} | Topic: {{topic}} | Level: {{level}} | Depth: {{depth}}
Structure:
1. INTRODUCTION — What is this topic and why it matters
2. KEY CONCEPTS (each with brief explanation)
3. IMPORTANT DEFINITIONS (formatted as term: definition)
4. EXAMPLES / CASE STUDIES (2-3 relevant examples)
5. DIAGRAMS / CHARTS TO DRAW (describe what teacher should draw on board)
6. FORMULAE (if applicable)
7. SUMMARY — 5 key takeaways
8. PRACTICE QUESTIONS (3 questions)
Academic level appropriate. Indian university context.`,
    seoTitle: "Free Lecture Notes Maker for College Lecturers | Forjit AI",
    seoDesc: "Convert any topic into structured lecture notes instantly. Free tool for Indian college lecturers. Key concepts, examples, definitions, and practice questions.",
    seoKeywords: ["lecture notes maker free India","college lecture notes generator","topic to lecture notes AI","lecture preparation tool India"],
    faqs: [
      { q: "Is this suitable for college lecturers?", a: "Yes. Designed specifically for undergraduate and postgraduate level teaching." },
      { q: "Does it include examples?", a: "Yes. 2-3 relevant examples or case studies are included." },
      { q: "Are practice questions included?", a: "Yes. 3 practice questions are included at the end of each lecture notes set." },
      { q: "Can I use these notes for any subject?", a: "Yes. Works for all college subjects across arts, science, and commerce." },
      { q: "How long are the generated notes?", a: "Depends on depth selected — from brief overview to full detailed lecture notes." },
    ],
    priority: 0.85,
  },

  {
    id: "viva-question-generator",
    name: "Viva / Oral Exam Question Generator",
    desc: "Generate viva voce questions with expected answers for practicals and oral exams.",
    icon: "🎤",
    category: "higher-ed",
    audience: "lecturer",
    model: "smart",
    maxTokens: 550,
    inputs: [
      { id: "subject",     label: "Subject / Practical",  type: "text",   placeholder: "e.g. Physics Lab, Chemistry Practical, Computer Science", required: true },
      { id: "topic",       label: "Specific Experiment / Topic", type: "text",   placeholder: "e.g. Ohm's Law experiment, Binary trees", required: true },
      { id: "level",       label: "Level",                type: "select", options: ["Class 12 Board Practical","UG Lab Viva","PG Lab Viva","Professional Course"] },
      { id: "count",       label: "Number of Questions",  type: "select", options: ["5","8","10","15","20"] },
    ],
    promptTemplate: `Generate viva voce questions with expected answers.
Subject: {{subject}} | Topic/Experiment: {{topic}} | Level: {{level}} | Count: {{count}}
For each:
Q[N]. [Viva question — can be concept, procedure, observation, or application based]
Expected Answer: [Clear, concise correct answer examiners look for]

Include:
- Conceptual questions (theory behind the experiment)
- Procedural questions (steps, precautions)
- Observation-based questions (what should student see/measure)
- Application questions (real-life relevance)`,
    seoTitle: "Free Viva Question Generator for Teachers | Forjit AI",
    seoDesc: "Generate viva voce questions with expected answers for any practical or experiment. Free tool for Indian science and engineering teachers.",
    seoKeywords: ["viva question generator free India","viva voce questions with answers","practical viva questions maker","oral exam question generator"],
    faqs: [
      { q: "Are expected answers included?", a: "Yes. Each viva question includes the expected answer that examiners look for." },
      { q: "Does it work for all science practicals?", a: "Yes. Works for Physics, Chemistry, Biology, Computer Science, and Engineering practicals." },
      { q: "Is it useful for Class 12 board practicals?", a: "Yes. Select 'Class 12 Board Practical' for relevant questions." },
      { q: "Can engineering lecturers use this?", a: "Yes. Works for UG and PG level lab viva across all disciplines." },
      { q: "How many questions can I generate?", a: "5 to 20 questions per session." },
    ],
    priority: 0.82,
  },

  /* ════════════════════════════════════════════════════════════════════════
     CHEMISTRY
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "chemistry-equation-balancer",
    name: "Chemical Equation Balancer & Explainer",
    desc: "Balance chemical equations and explain the reaction with step-by-step working.",
    icon: "⚗️", category: "science", subCategory: "chemistry",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "equation", label: "Chemical Equation", type: "text", placeholder: "e.g. H2 + O2 → H2O", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Balance this chemical equation and explain it clearly.
Equation: {{equation}} | Class: {{class}}
Provide:
1. BALANCED EQUATION (with correct coefficients)
2. STEP-BY-STEP BALANCING (show atom count before and after)
3. TYPE OF REACTION (combination/decomposition/displacement etc.)
4. WHAT HAPPENS (plain English explanation)
5. REAL-LIFE EXAMPLE of this reaction
CBSE chemistry curriculum.`,
    seoTitle: "Free Chemical Equation Balancer for Teachers | Forjit AI",
    seoDesc: "Balance chemical equations with step-by-step explanation. Free tool for Chemistry teachers. CBSE Class 9-12 aligned.",
    seoKeywords: ["chemical equation balancer teacher","balance equation CBSE","chemistry equation solver India"],
    faqs: [
      { q: "Does it show the balancing steps?", a: "Yes. Each step shows atom count before and after balancing." },
      { q: "What reaction types are covered?", a: "Combination, decomposition, displacement, double displacement, redox, and more." },
      { q: "Is it CBSE aligned?", a: "Yes. Follows CBSE Class 9-12 chemistry curriculum." },
      { q: "Can it explain the reaction?", a: "Yes. A plain English explanation and real-life example are included." },
      { q: "Is it free?", a: "Completely free. No login or signup required." },
    ],
    priority: 0.88,
  },

  {
    id: "chemistry-lab-report",
    name: "Chemistry Lab Report Generator",
    desc: "Generate a complete lab report for any chemistry practical with observations and conclusions.",
    icon: "🧪", category: "science", subCategory: "chemistry",
    audience: "teacher", model: "smart", maxTokens: 650,
    inputs: [
      { id: "practical", label: "Practical Name", type: "text", placeholder: "e.g. Preparation of Ferrous Sulphate crystals", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "board", label: "Board", type: "select", options: ["CBSE","ICSE / ISC","NIOS (Open School)","Maharashtra (SSC/HSC)","Tamil Nadu (TNBSE)","Karnataka (KSEEB)","Andhra Pradesh (BSEAP)","Telangana (BSETS)","Kerala (SCERT)","Uttar Pradesh (UPMSP)","Rajasthan (RBSE)","Gujarat (GSEB)","West Bengal (WBBSE/WBCHSE)","Madhya Pradesh (MPBSE)","Punjab (PSEB)","Haryana (HBSE)","Bihar (BSEB)","Odisha (BSE)","Jharkhand (JAC)","Chhattisgarh (CGBSE)","Assam (SEBA/AHSEC)","Himachal Pradesh (HPBOSE)","Uttarakhand (UBSE)","Jammu & Kashmir (JKBOSE)","Delhi (DBSE)","Goa (GBSHSE)","Manipur (BSEM)","Tripura (TBSE)","Meghalaya (MBOSE)","Mizoram (MBSE)","Nagaland (NBSE)","Sikkim (SBSE)","Arunachal Pradesh (DBSE-AP)","IB (International Baccalaureate)","Cambridge (IGCSE / A Level)","Edexcel / Pearson","Central University","State University","Deemed University","Autonomous College","Affiliated College","AICTE Affiliated","UGC Recognized","NMC / Medical Council","Bar Council (Law)","NCHMCT (Hotel Mgmt)","NCVT / SCVT (ITI)"] },
    ],
    promptTemplate: `Write a complete chemistry lab report.
Practical: {{practical}} | Class: {{class}} | Board: {{board}}
Sections:
1. AIM
2. APPARATUS & CHEMICALS REQUIRED
3. THEORY (brief scientific principle)
4. PROCEDURE (numbered steps)
5. OBSERVATIONS (table format where applicable)
6. RESULT
7. PRECAUTIONS (5 points)
8. VIVA QUESTIONS (3 likely questions with answers)
Standard school lab report format.`,
    seoTitle: "Free Chemistry Lab Report Generator for Teachers | Forjit AI",
    seoDesc: "Generate complete chemistry practical lab reports for CBSE/ICSE. Free tool for chemistry teachers. Aim, procedure, observations included.",
    seoKeywords: ["chemistry lab report generator","practical report writer CBSE","chemistry practical format India"],
    faqs: [
      { q: "Does it include all sections?", a: "Yes. Aim, apparatus, theory, procedure, observations, result, precautions, and viva questions." },
      { q: "Which boards are supported?", a: "CBSE, ICSE, and State Board formats." },
      { q: "Are viva questions included?", a: "Yes. 3 likely viva questions with answers are included." },
      { q: "Can I use it for any practical?", a: "Yes. Works for any chemistry practical from Class 9-12." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  {
    id: "chemistry-mcq-maker",
    name: "Chemistry MCQ Maker (Class 9–12)",
    desc: "Generate chemistry MCQs with answers for any topic — organic, inorganic, or physical chemistry.",
    icon: "🔬", category: "science", subCategory: "chemistry",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Chemistry Topic", type: "text", placeholder: "e.g. Acids Bases Salts, Organic Chemistry", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] },
      { id: "type", label: "Chemistry Type", type: "select", options: ["Any","Organic","Inorganic","Physical","Electrochemistry"] },
    ],
    promptTemplate: `Generate {{count}} chemistry MCQs with answers.
Topic: {{topic}} | Class: {{class}} | Type: {{type}}
Format: Q[N]. question \n A) B) C) D) \n Answer: X \n Explanation: one line
Include concept-based, numerical, and formula questions. CBSE curriculum.`,
    seoTitle: "Free Chemistry MCQ Maker Class 9-12 | Forjit AI",
    seoDesc: "Generate chemistry MCQs with answers for any topic. Free quiz maker for CBSE chemistry teachers. Organic, inorganic, physical chemistry covered.",
    seoKeywords: ["chemistry MCQ generator CBSE","chemistry quiz maker teacher","chemistry questions class 12 India"],
    faqs: [
      { q: "Does it cover organic chemistry?", a: "Yes. Select 'Organic' type for organic chemistry specific questions." },
      { q: "Are explanations included?", a: "Yes. Each answer includes a one-line explanation." },
      { q: "Can I get numerical problems?", a: "Yes. The tool includes numerical, concept, and formula-based MCQs." },
      { q: "Which classes are supported?", a: "Class 9 through Class 12." },
      { q: "Is it CBSE aligned?", a: "Yes. Follows CBSE chemistry syllabus." },
    ],
    priority: 0.85,
  },

  {
    id: "mole-concept-solver",
    name: "Mole Concept Problem Solver",
    desc: "Solve mole concept numericals step-by-step with formula, working, and explanation.",
    icon: "🧮", category: "science", subCategory: "chemistry",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "problem", label: "Problem Statement", type: "textarea", placeholder: "e.g. Calculate the number of moles in 36g of water (H2O)", required: true, rows: 3 },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Solve this mole concept problem step-by-step.
Problem: {{problem}} | Class: {{class}}
Show:
1. GIVEN DATA
2. FORMULA USED
3. STEP-BY-STEP CALCULATION (with units)
4. ANSWER (with proper units)
5. KEY CONCEPT used in this problem
Clear, student-friendly explanation. CBSE format.`,
    seoTitle: "Free Mole Concept Problem Solver for Teachers | Forjit AI",
    seoDesc: "Solve mole concept numericals step-by-step. Free chemistry tool for Indian teachers. Shows formula, working, and explanation.",
    seoKeywords: ["mole concept solver India","mole numericals step by step CBSE","chemistry mole calculator teacher"],
    faqs: [
      { q: "Does it show all working steps?", a: "Yes. Every step with formula, substitution, and units is shown." },
      { q: "Can I use any mole concept problem?", a: "Yes. Moles, mass, volume, Avogadro's number, molarity problems all work." },
      { q: "Is it suitable for Class 9?", a: "Yes. Works for Class 9-12 mole concept problems." },
      { q: "Are units shown?", a: "Yes. All units are shown at each step." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     BIOLOGY
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "biology-diagram-notes",
    name: "Biology Diagram Description Generator",
    desc: "Generate detailed text descriptions of biology diagrams with labels and functions.",
    icon: "🦠", category: "science", subCategory: "biology",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "diagram", label: "Diagram / Structure", type: "text", placeholder: "e.g. Plant Cell, Heart, Nephron, Mitochondria", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Describe this biology diagram in detail for students.
Structure: {{diagram}} | Class: {{class}}
Provide:
1. WHAT TO DRAW (shape, size, orientation)
2. LABELLED PARTS (list each part with label name)
3. FUNCTION OF EACH PART (one line per part)
4. HOW TO DRAW (step-by-step drawing instructions)
5. EXAM TIPS (what examiners look for in this diagram)
CBSE/NCERT curriculum. Clear and student-friendly.`,
    seoTitle: "Biology Diagram Description Generator for Teachers | Forjit AI",
    seoDesc: "Generate detailed biology diagram descriptions with labels and functions. Free tool for biology teachers. CBSE/NCERT aligned.",
    seoKeywords: ["biology diagram notes teacher","biology diagram labels CBSE","biology diagram description generator India"],
    faqs: [
      { q: "Does it include drawing instructions?", a: "Yes. Step-by-step drawing instructions are included." },
      { q: "What diagrams can it describe?", a: "Any biology structure — cell, organ, system, organism, cycle." },
      { q: "Are functions of each part included?", a: "Yes. Function of each labeled part is described." },
      { q: "Is it useful for Class 10 boards?", a: "Yes. Includes exam tips for board diagrams." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  {
    id: "genetics-punnett-square",
    name: "Genetics & Punnett Square Solver",
    desc: "Solve genetics problems with Punnett squares, phenotype ratios, and explanations.",
    icon: "🧬", category: "science", subCategory: "biology",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "cross", label: "Genetic Cross", type: "text", placeholder: "e.g. Tall (TT) × Dwarf (tt), Monohybrid cross", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Solve this genetics problem with a Punnett square.
Cross: {{cross}} | Class: {{class}}
Show:
1. PARENT GENOTYPES
2. GAMETES PRODUCED
3. PUNNETT SQUARE (text format with | separators)
4. GENOTYPE RATIO
5. PHENOTYPE RATIO
6. CONCLUSION
7. LAW DEMONSTRATED (Mendel's law)
CBSE biology curriculum. Student-friendly.`,
    seoTitle: "Free Genetics Punnett Square Solver for Teachers | Forjit AI",
    seoDesc: "Solve genetics problems with Punnett squares and phenotype ratios. Free biology tool for Indian teachers. CBSE Class 10-12.",
    seoKeywords: ["punnett square solver India","genetics problem solver CBSE","Mendel genetics teacher tool"],
    faqs: [
      { q: "Does it show the Punnett square?", a: "Yes. Complete Punnett square with all combinations." },
      { q: "Are ratios calculated?", a: "Yes. Both genotype and phenotype ratios are given." },
      { q: "Can it handle dihybrid crosses?", a: "Yes. Enter dihybrid cross details and it solves them." },
      { q: "Which Mendel laws are covered?", a: "Law of Dominance, Segregation, and Independent Assortment." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  {
    id: "biology-mcq-maker",
    name: "Biology MCQ Maker (Class 6–12)",
    desc: "Generate biology MCQs with answers for botany, zoology, and human biology topics.",
    icon: "🌿", category: "science", subCategory: "biology",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Biology Topic", type: "text", placeholder: "e.g. Photosynthesis, Cell Division, Human Digestive System", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] },
    ],
    promptTemplate: `Generate {{count}} biology MCQs with answers.
Topic: {{topic}} | Class: {{class}}
Format: Q[N]. question \n A) B) C) D) \n Answer: X \n Explanation: one line
Include diagram-based and application questions. NCERT/CBSE curriculum.`,
    seoTitle: "Free Biology MCQ Maker Class 6-12 | Forjit AI",
    seoDesc: "Generate biology MCQs with answers. Free quiz maker for CBSE biology teachers. Botany, zoology, and human biology topics covered.",
    seoKeywords: ["biology MCQ generator CBSE","biology quiz maker teacher India","biology questions class 10 free"],
    faqs: [
      { q: "Does it cover both botany and zoology?", a: "Yes. Enter any biology topic and get relevant MCQs." },
      { q: "Are explanations included?", a: "Yes. One-line explanation with each answer." },
      { q: "Is it NCERT aligned?", a: "Yes. Follows NCERT biology syllabus." },
      { q: "Can I get 20 questions at once?", a: "Yes. Select up to 20 MCQs per generation." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  /* ════════════════════════════════════════════════════════════════════════
     MATHEMATICS — Phase 2
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "maths-formula-sheet",
    name: "Maths Formula Sheet Generator",
    desc: "Generate a complete formula sheet for any maths topic or chapter.",
    icon: "📐", category: "maths",
    audience: "teacher", model: "fast", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Topic / Chapter", type: "text", placeholder: "e.g. Trigonometry, Quadratic Equations, Statistics", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Create a complete maths formula sheet.
Topic: {{topic}} | Class: {{class}}
Format:
TOPIC: [name]
[Formula Name]: [formula with variables defined]
...all formulas listed...
IMPORTANT NOTES: 2-3 key reminders
COMMON MISTAKES: 2-3 mistakes students make
Comprehensive. All formulas a student needs for exams.`,
    seoTitle: "Free Maths Formula Sheet Generator for Teachers | Forjit AI",
    seoDesc: "Generate complete maths formula sheets for any topic. Free tool for Indian maths teachers. CBSE Class 8-12 aligned.",
    seoKeywords: ["maths formula sheet generator India","math formulas CBSE teacher","maths formula list maker free"],
    faqs: [
      { q: "Are all formulas included?", a: "Yes. Complete formula sheet with all formulas for the topic." },
      { q: "Does it include notes?", a: "Yes. Important notes and common mistakes are included." },
      { q: "What topics are supported?", a: "All maths topics from Class 8-12 — algebra, geometry, trigonometry, calculus, statistics." },
      { q: "Can students use this?", a: "Yes. Print and give to students as a revision sheet." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  {
    id: "statistics-calculator-teacher",
    name: "Statistics Problem Solver",
    desc: "Solve mean, median, mode, standard deviation, and probability problems step-by-step.",
    icon: "📊", category: "maths",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "problem", label: "Problem / Data", type: "textarea", placeholder: "e.g. Find mean, median, mode of: 5, 8, 3, 8, 9, 2, 8, 10", required: true, rows: 3 },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "topic", label: "Statistics Topic", type: "select", options: ["Mean/Median/Mode","Standard Deviation","Probability","Correlation","All of above"] },
    ],
    promptTemplate: `Solve this statistics problem step-by-step.
Problem: {{problem}} | Class: {{class}} | Topic: {{topic}}
Show:
1. IDENTIFY what is asked
2. FORMULA USED
3. STEP-BY-STEP CALCULATION (tabular where needed)
4. ANSWER
5. INTERPRETATION of the result
CBSE maths curriculum. Clear and detailed.`,
    seoTitle: "Free Statistics Problem Solver for Teachers | Forjit AI",
    seoDesc: "Solve mean, median, mode, standard deviation problems step-by-step. Free statistics tool for Indian maths teachers.",
    seoKeywords: ["statistics solver teacher India","mean median mode calculator CBSE","statistics problem step by step free"],
    faqs: [
      { q: "What statistics topics are covered?", a: "Mean, median, mode, standard deviation, probability, and correlation." },
      { q: "Are steps shown?", a: "Yes. Full step-by-step working with formula and substitution." },
      { q: "Can I paste raw data?", a: "Yes. Paste your data set directly into the problem field." },
      { q: "Is the result interpreted?", a: "Yes. A plain English interpretation of the answer is included." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     COMPUTER SCIENCE
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "code-explainer-teacher",
    name: "Code Explainer for Students",
    desc: "Paste any code — get a plain English line-by-line explanation for students.",
    icon: "💻", category: "computer",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "code", label: "Paste Code Here", type: "textarea", placeholder: "Paste Python, C++, Java, or any code…", required: true, rows: 5 },
      { id: "language", label: "Language", type: "select", options: ["Python","C++","Java","C","JavaScript","SQL","Any"] },
      { id: "class", label: "Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Explain this code to students in plain language.
Language: {{language}} | Level: {{class}}
Code:
{{code}}

Provide:
1. WHAT THIS PROGRAM DOES (2-3 sentences)
2. LINE-BY-LINE EXPLANATION (each line explained simply)
3. KEY CONCEPTS used (list)
4. SAMPLE OUTPUT (if applicable)
5. COMMON ERRORS beginners make with this type of code
Student-friendly. No jargon.`,
    seoTitle: "Free Code Explainer for CS Teachers | Forjit AI",
    seoDesc: "Explain any code in plain English for students. Free tool for computer science teachers. Python, C++, Java, SQL supported.",
    seoKeywords: ["code explainer teacher India","explain code to students free","programming code explanation CBSE CS"],
    faqs: [
      { q: "What languages are supported?", a: "Python, C++, Java, C, JavaScript, SQL, and more." },
      { q: "Is it suitable for Class 11-12 CS?", a: "Yes. CBSE Class 11-12 computer science level explanations." },
      { q: "Does it explain line by line?", a: "Yes. Each line is explained in simple English." },
      { q: "Can it show sample output?", a: "Yes. Expected output is shown where applicable." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  {
    id: "pseudocode-generator",
    name: "Pseudocode Generator",
    desc: "Convert algorithm descriptions or code into clean pseudocode for teaching.",
    icon: "📝", category: "computer",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "algorithm", label: "Algorithm / Program Description", type: "textarea", placeholder: "e.g. Find the largest number in an array, or paste actual code", required: true, rows: 3 },
      { id: "style", label: "Pseudocode Style", type: "select", options: ["Simple English","CBSE Format","Structured (Begin/End)","Flowchart-friendly"] },
    ],
    promptTemplate: `Convert this into clear pseudocode.
Algorithm: {{algorithm}}
Style: {{style}}
Write clean, readable pseudocode that students can follow.
Use: INPUT/OUTPUT/IF-THEN-ELSE/FOR/WHILE/BEGIN/END as appropriate.
Add brief comments where helpful.`,
    seoTitle: "Free Pseudocode Generator for CS Teachers | Forjit AI",
    seoDesc: "Convert algorithms into clean pseudocode for students. Free tool for computer science teachers. CBSE format supported.",
    seoKeywords: ["pseudocode generator teacher India","algorithm to pseudocode CBSE","pseudocode maker CS teacher free"],
    faqs: [
      { q: "What styles are available?", a: "Simple English, CBSE format, Structured (Begin/End), and Flowchart-friendly." },
      { q: "Can I paste code to convert to pseudocode?", a: "Yes. Paste actual code and it converts to pseudocode." },
      { q: "Is CBSE format supported?", a: "Yes. Select 'CBSE Format' for board-exam style pseudocode." },
      { q: "Is it useful for teaching algorithms?", a: "Yes. Great for explaining algorithms before coding." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  {
    id: "cs-project-ideas",
    name: "CS Project Idea Generator",
    desc: "Generate original computer science project ideas with scope, features, and tech stack.",
    icon: "🖥️", category: "computer",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "class", label: "Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "domain", label: "Domain", type: "select", options: ["Any Domain","Education","Healthcare","Agriculture","Finance","E-commerce","Social Media","Gaming","Environment"] },
      { id: "language", label: "Language/Tech", type: "select", options: ["Python","Java","C++","Web (HTML/CSS/JS)","Any"] },
      { id: "count", label: "Number of Ideas", type: "select", options: ["3","5","8","10"] },
    ],
    promptTemplate: `Generate {{count}} original CS project ideas.
Level: {{class}} | Domain: {{domain}} | Tech: {{language}}
For each idea:
PROJECT [N]: [Name]
DESCRIPTION: What it does (2 sentences)
KEY FEATURES: 3-4 bullet points
TECH STACK: Technologies to use
DIFFICULTY: Easy/Medium/Hard
INDIA RELEVANCE: Why useful in Indian context
Original, practical, implementable ideas.`,
    seoTitle: "Free CS Project Idea Generator for Teachers | Forjit AI",
    seoDesc: "Generate original computer science project ideas with features and tech stack. Free tool for CS teachers. Class 11-12 and college level.",
    seoKeywords: ["CS project ideas India","computer science project generator CBSE","programming project ideas class 12"],
    faqs: [
      { q: "Are the project ideas original?", a: "Yes. Fresh, practical project ideas relevant to Indian context." },
      { q: "Is it suitable for Class 12?", a: "Yes. Works for Class 11-12 and college level projects." },
      { q: "Are tech stacks suggested?", a: "Yes. Relevant technologies are suggested for each project." },
      { q: "Can I get ideas for a specific domain?", a: "Yes. Select education, healthcare, agriculture, finance, and more." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  {
    id: "sql-query-builder",
    name: "SQL Query Builder for Students",
    desc: "Generate SQL queries with explanation for teaching database concepts.",
    icon: "🗄️", category: "computer",
    audience: "teacher", model: "smart", maxTokens: 450,
    inputs: [
      { id: "task", label: "What Query to Write", type: "textarea", placeholder: "e.g. Find all students with marks > 75 from student table, or create a table for library", required: true, rows: 2 },
      { id: "level", label: "Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Write SQL query/queries for this task with explanation.
Task: {{task}} | Level: {{level}}
Provide:
1. SQL QUERY (clean, formatted)
2. LINE-BY-LINE EXPLANATION
3. SAMPLE TABLE STRUCTURE (if creating/querying)
4. SAMPLE OUTPUT (what result looks like)
5. VARIATIONS (2 similar queries to practice)
CBSE/college database curriculum.`,
    seoTitle: "Free SQL Query Builder for CS Teachers | Forjit AI",
    seoDesc: "Generate SQL queries with explanation for students. Free tool for computer science teachers. CBSE Class 11-12 and college level.",
    seoKeywords: ["SQL query generator teacher India","SQL for students CBSE","database query builder CS teacher free"],
    faqs: [
      { q: "Which SQL concepts are covered?", a: "SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY, CREATE TABLE, and more." },
      { q: "Is it explained line by line?", a: "Yes. Each part of the query is explained simply." },
      { q: "Does it show sample output?", a: "Yes. Expected query output is shown." },
      { q: "Is it CBSE Class 11-12 aligned?", a: "Yes. Covers CBSE database/SQL curriculum." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     GEOGRAPHY
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "geography-case-study",
    name: "Geography Case Study Notes Maker",
    desc: "Generate detailed case study notes for any geography topic — rivers, cities, disasters, agriculture.",
    icon: "🗺️", category: "social-science", subCategory: "geography",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Case Study Topic", type: "text", placeholder: "e.g. Amazon Rainforest, Chennai Floods 2015, Green Revolution in India", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "type", label: "Topic Type", type: "select", options: ["Natural Disaster","River/Water Body","Agriculture","City/Region","Climate","Industrial Region","Any"] },
    ],
    promptTemplate: `Create detailed geography case study notes.
Topic: {{topic}} | Class: {{class}} | Type: {{type}}
Sections:
1. OVERVIEW (location, key facts)
2. IMPORTANT FEATURES (geographical characteristics)
3. CAUSES / FORMATION (how it came about)
4. IMPACT / SIGNIFICANCE (economic, social, environmental)
5. CHALLENGES & SOLUTIONS
6. KEY STATISTICS / DATA POINTS
7. MAP NOTES (what to show on a map)
8. EXAM-LIKELY QUESTIONS (3 questions)
NCERT/CBSE curriculum context.`,
    seoTitle: "Free Geography Case Study Notes Maker | Forjit AI",
    seoDesc: "Generate geography case study notes for any topic. Free tool for Indian geography teachers. Rivers, disasters, agriculture, cities covered.",
    seoKeywords: ["geography case study notes maker","geography notes generator CBSE","geography teacher tool India free"],
    faqs: [
      { q: "What topics can I create case studies for?", a: "Any geography topic — natural disasters, rivers, agriculture, climate, cities, industrial regions." },
      { q: "Is it NCERT aligned?", a: "Yes. Follows NCERT and CBSE geography curriculum." },
      { q: "Are map notes included?", a: "Yes. Notes on what to show on a map are included." },
      { q: "Does it include exam questions?", a: "Yes. 3 likely exam questions are included." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  {
    id: "geography-mcq-maker",
    name: "Geography MCQ Maker",
    desc: "Generate geography MCQs for physical, human, and economic geography topics.",
    icon: "🌍", category: "social-science", subCategory: "geography",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Geography Topic", type: "text", placeholder: "e.g. Monsoon, Soil Types, Population Distribution", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] },
    ],
    promptTemplate: `Generate {{count}} geography MCQs with answers.
Topic: {{topic}} | Class: {{class}}
Format: Q[N]. question \n A) B) C) D) \n Answer: X
Include map-based, data-based, and concept questions. NCERT/CBSE curriculum.`,
    seoTitle: "Free Geography MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate geography MCQs for any topic. Free quiz maker for CBSE geography teachers. Physical, human, and economic geography covered.",
    seoKeywords: ["geography MCQ generator CBSE","geography quiz maker teacher India","geography questions class 10 free"],
    faqs: [
      { q: "What geography types are covered?", a: "Physical, human, economic, and Indian geography." },
      { q: "Is it NCERT aligned?", a: "Yes. Follows NCERT geography syllabus." },
      { q: "Are map-based questions included?", a: "Yes. Map-based and data-interpretation questions are included." },
      { q: "Which classes are supported?", a: "Class 6 through Class 12." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     ENGLISH LANGUAGE — Phase 2
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "english-grammar-worksheet",
    name: "English Grammar Worksheet Generator",
    desc: "Generate grammar worksheets with exercises and answer keys for any grammar topic.",
    icon: "✍️", category: "language", subCategory: "english",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Grammar Topic", type: "text", placeholder: "e.g. Tenses, Articles, Prepositions, Subject-Verb Agreement", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "type", label: "Exercise Type", type: "select", options: ["Fill in the Blanks","Correct the Sentences","Match the Following","Rewrite Sentences","Mixed Types"] },
      { id: "count", label: "Number of Questions", type: "select", options: ["5","8","10","15"] },
    ],
    promptTemplate: `Create an English grammar worksheet.
Topic: {{topic}} | Class: {{class}} | Type: {{type}} | Count: {{count}} questions
Format:
WORKSHEET: [Title]
INSTRUCTIONS: [clear instructions]
EXERCISES: [{{count}} numbered exercises]
---
ANSWER KEY: [all answers]
Age-appropriate. CBSE/ICSE English curriculum.`,
    seoTitle: "Free English Grammar Worksheet Generator for Teachers | Forjit AI",
    seoDesc: "Generate English grammar worksheets with answer keys. Free tool for English teachers. CBSE/ICSE aligned. Fill in blanks, correction, matching.",
    seoKeywords: ["english grammar worksheet generator teacher","grammar exercises maker India free","english worksheet CBSE teacher"],
    faqs: [
      { q: "Is the answer key included?", a: "Yes. Complete answer key at the end of every worksheet." },
      { q: "What exercise types are available?", a: "Fill in the blanks, correct the sentences, match the following, rewrite sentences." },
      { q: "Can I get worksheets for any grammar topic?", a: "Yes. Tenses, articles, prepositions, conjunctions, modals, and more." },
      { q: "Which classes are supported?", a: "Class 4 through Class 10." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  {
    id: "english-comprehension-generator",
    name: "Reading Comprehension Generator",
    desc: "Generate unseen passages with comprehension questions and answers for any class.",
    icon: "📖", category: "language", subCategory: "english",
    audience: "teacher", model: "smart", maxTokens: 650,
    inputs: [
      { id: "theme", label: "Passage Theme", type: "text", placeholder: "e.g. Environment, Science, Indian Culture, Sports", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "length", label: "Passage Length", type: "select", options: ["Short (100-150 words)","Medium (200-250 words)","Long (300-350 words)"] },
    ],
    promptTemplate: `Create an unseen reading comprehension passage with questions.
Theme: {{theme}} | Class: {{class}} | Length: {{length}}
Format:
PASSAGE: [original passage, {{length}}, engaging and age-appropriate]
QUESTIONS:
1. [Factual question]
2. [Inference question]
3. [Vocabulary question — find word meaning from context]
4. [True/False or Yes/No — 2 statements]
5. [Give title to passage]
ANSWERS: [complete answer key]
Indian English curriculum context.`,
    seoTitle: "Free Reading Comprehension Generator for English Teachers | Forjit AI",
    seoDesc: "Generate unseen comprehension passages with questions and answers. Free tool for English teachers. CBSE/ICSE Class 4-10.",
    seoKeywords: ["comprehension passage generator teacher","unseen passage maker CBSE","reading comprehension generator India free"],
    faqs: [
      { q: "Are the passages original?", a: "Yes. Fresh, original passages on any theme you choose." },
      { q: "Are answer keys included?", a: "Yes. Complete answer key for all questions." },
      { q: "What question types are included?", a: "Factual, inference, vocabulary, true/false, and title questions." },
      { q: "Is it suitable for board exams?", a: "Yes. Follows CBSE/ICSE comprehension question pattern." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.88,
  },

  {
    id: "english-formal-letter",
    name: "Formal Letter Writer (English)",
    desc: "Generate formal letters for students — complaint, request, application, editor letters.",
    icon: "📩", category: "language", subCategory: "english",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Application Letter","Complaint Letter","Request Letter","Letter to Editor","Notice","Advertisement"] },
      { id: "topic", label: "Purpose / Topic", type: "text", placeholder: "e.g. Complaining about poor road condition, Requesting leave", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Write a {{type}} for students to use as a model.
Purpose: {{topic}} | Class: {{class}}
Use correct format:
- Sender's address + date
- Receiver's address
- Subject line
- Salutation
- Body (2-3 paragraphs)
- Closing + signature
CBSE English exam format. Formal tone. Word limit 120-150 words.`,
    seoTitle: "Free Formal Letter Writer for English Teachers | Forjit AI",
    seoDesc: "Generate formal letters for students. Application, complaint, request, editor letters. Free tool for English teachers. CBSE format.",
    seoKeywords: ["formal letter generator English teacher","letter writing CBSE class 10","formal letter maker India free"],
    faqs: [
      { q: "What letter types are available?", a: "Application, complaint, request, letter to editor, notice, and advertisement." },
      { q: "Is CBSE format followed?", a: "Yes. Correct CBSE exam format with all required sections." },
      { q: "Is word limit maintained?", a: "Yes. Approximately 120-150 words as required for board exams." },
      { q: "Can students use these as model letters?", a: "Yes. Teachers can use as model answers in class." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  /* ════════════════════════════════════════════════════════════════════════
     HINDI — Phase 2
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "hindi-anuched-lekhan",
    name: "Hindi Anuched Lekhan Generator (अनुच्छेद लेखन)",
    desc: "किसी भी विषय पर 80-100 शब्दों का हिंदी अनुच्छेद बनाएं।",
    icon: "📝", category: "language", subCategory: "hindi",
    audience: "teacher", model: "fast", maxTokens: 350,
    inputs: [
      { id: "topic", label: "विषय (Topic)", type: "text", placeholder: "e.g. समय की पाबंदी, पर्यावरण प्रदूषण, मोबाइल फोन", required: true },
      { id: "class", label: "कक्षा (Class)", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `एक उत्कृष्ट हिंदी अनुच्छेद लिखें।
विषय: {{topic}} | कक्षा: {{class}}
80-100 शब्दों में। सरल हिंदी। परिचय, मुख्य विचार, और निष्कर्ष के साथ।
CBSE/NCERT पाठ्यक्रम के अनुसार।`,
    seoTitle: "Hindi Anuched Lekhan Generator Free | अनुच्छेद लेखन | Forjit AI",
    seoDesc: "किसी भी विषय पर हिंदी अनुच्छेद बनाएं। Free Hindi anuched lekhan tool for teachers and students. CBSE Class 6-10.",
    seoKeywords: ["hindi anuched lekhan generator","अनुच्छेद लेखन AI","CBSE hindi paragraph writer free"],
    faqs: [
      { q: "शब्द सीमा कितनी होगी?", a: "80-100 शब्द — परीक्षा के अनुसार।" },
      { q: "क्या यह CBSE के लिए उपयुक्त है?", a: "हाँ। CBSE और NCERT पाठ्यक्रम के अनुसार।" },
      { q: "किस कक्षा के लिए उपयोगी है?", a: "Class 6 से Class 10 तक।" },
      { q: "क्या भाषा सरल होगी?", a: "हाँ। सरल और शुद्ध हिंदी में।" },
      { q: "क्या यह मुफ्त है?", a: "हाँ। बिल्कुल मुफ्त।" },
    ],
    priority: 0.85,
  },

  {
    id: "hindi-muhavare-explainer",
    name: "Hindi Muhavare & Lokoktiyan Explainer (मुहावरे और लोकोक्तियाँ)",
    desc: "हिंदी मुहावरों और लोकोक्तियों का अर्थ, उदाहरण, और वाक्य प्रयोग।",
    icon: "💬", category: "language", subCategory: "hindi",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "muhavara", label: "मुहावरा / लोकोक्ति", type: "text", placeholder: "e.g. आम के आम गुठलियों के दाम, नाच न जाने आँगन टेढ़ा", required: true },
      { id: "class", label: "कक्षा (Class)", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `हिंदी मुहावरे/लोकोक्ति समझाएं।
मुहावरा: {{muhavara}} | कक्षा: {{class}}
बताएं:
1. अर्थ (Meaning in Hindi)
2. English meaning
3. वाक्य प्रयोग (3 example sentences)
4. इसे कब उपयोग करते हैं (When to use)
5. इसी तरह के 2 अन्य मुहावरे
सरल हिंदी में। CBSE परीक्षा के अनुसार।`,
    seoTitle: "Hindi Muhavare Explainer Free | मुहावरे और लोकोक्तियाँ | Forjit AI",
    seoDesc: "हिंदी मुहावरों और लोकोक्तियों का अर्थ और वाक्य प्रयोग। Free Hindi muhavare tool for teachers and students. CBSE aligned.",
    seoKeywords: ["hindi muhavare explainer free","मुहावरे अर्थ AI","hindi idioms meaning tool India"],
    faqs: [
      { q: "क्या English meaning भी मिलेगी?", a: "हाँ। Hindi और English दोनों में अर्थ दिया जाता है।" },
      { q: "क्या वाक्य प्रयोग भी मिलेगा?", a: "हाँ। 3 example sentences मिलते हैं।" },
      { q: "क्या यह परीक्षा के लिए उपयोगी है?", a: "हाँ। CBSE परीक्षा pattern के अनुसार।" },
      { q: "क्या मिलते-जुलते मुहावरे भी बताए जाते हैं?", a: "हाँ। 2 similar मुहावरे भी बताए जाते हैं।" },
      { q: "क्या यह मुफ्त है?", a: "हाँ। बिल्कुल मुफ्त।" },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     ADMIN / CROSS-SUBJECT — Phase 2
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "syllabus-completion-tracker",
    name: "Syllabus Completion Planner",
    desc: "Create a month-wise syllabus completion plan for any subject and class.",
    icon: "📅", category: "cross-subject",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "subject", label: "Subject", type: "text", placeholder: "e.g. Physics Class 12", required: true },
      { id: "chapters", label: "Chapters to Cover", type: "textarea", placeholder: "List chapters e.g. Electric Charges, Current Electricity, Magnetism…", required: true, rows: 3 },
      { id: "months", label: "Available Months", type: "select", options: ["3 months","4 months","5 months","6 months","8 months","10 months"] },
      { id: "periods", label: "Periods Per Week", type: "select", options: ["3","4","5","6"] },
    ],
    promptTemplate: `Create a syllabus completion planner.
Subject: {{subject}} | Chapters: {{chapters}}
Duration: {{months}} | Periods/week: {{periods}}
Format as a month-wise table:
MONTH | CHAPTERS TO COVER | PERIODS NEEDED | TESTS/ACTIVITIES
Include:
- Revision weeks
- Unit test schedule  
- Buffer time for slow topics
- Practical sessions if applicable
Realistic and practical for Indian school schedule.`,
    seoTitle: "Free Syllabus Completion Planner for Teachers | Forjit AI",
    seoDesc: "Create month-wise syllabus completion plans for any subject. Free tool for Indian school teachers. Includes test schedule and revision.",
    seoKeywords: ["syllabus completion planner teacher India","lesson planner month-wise free","syllabus tracker teacher CBSE"],
    faqs: [
      { q: "Does it include test schedules?", a: "Yes. Unit test and revision schedules are built in." },
      { q: "Is buffer time included?", a: "Yes. Buffer time for slow topics and revision is factored in." },
      { q: "Can I use it for any subject?", a: "Yes. Works for all subjects — science, maths, language, social science." },
      { q: "Is it suitable for the full academic year?", a: "Yes. Works for 3 months to 10 months of planning." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  {
    id: "student-recommendation-letter",
    name: "Student Recommendation Letter Writer",
    desc: "Generate professional recommendation letters for students — college, scholarship, or job.",
    icon: "🎓", category: "cross-subject",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "studentName", label: "Student Name", type: "text", placeholder: "e.g. Priya Sharma", required: true },
      { id: "purpose", label: "Purpose", type: "select", options: ["College Admission","Scholarship Application","Internship","Job Application","Award Nomination"] },
      { id: "subject", label: "Your Subject", type: "text", placeholder: "e.g. Mathematics, Physics", required: true },
      { id: "qualities", label: "Student's Key Strengths", type: "text", placeholder: "e.g. analytical thinking, hardworking, leadership", required: false },
    ],
    promptTemplate: `Write a professional student recommendation letter.
Student: {{studentName}} | Purpose: {{purpose}} | Teacher's Subject: {{subject}}
Strengths: {{qualities}}
Format:
- Date, teacher's designation
- "To Whom It May Concern"
- Para 1: How long known, in what capacity
- Para 2: Academic performance and subject strengths
- Para 3: Character, qualities, extra-curricular
- Para 4: Strong recommendation and contact offer
- Closing: Name, Designation, School, Contact
Professional, specific, warm tone. 250-300 words.`,
    seoTitle: "Free Student Recommendation Letter Writer for Teachers | Forjit AI",
    seoDesc: "Generate professional student recommendation letters. Free tool for Indian teachers. College, scholarship, internship, job letters.",
    seoKeywords: ["recommendation letter generator teacher India","student recommendation letter free","letter of recommendation writer school India"],
    faqs: [
      { q: "What purposes are supported?", a: "College admission, scholarship, internship, job, and award nomination." },
      { q: "Is it professional quality?", a: "Yes. Professional English suitable for official use." },
      { q: "How long is the letter?", a: "Approximately 250-300 words — appropriate length for recommendations." },
      { q: "Can I customise it?", a: "Yes. Copy and personalise with specific details." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  {
    id: "differentiated-instruction-planner",
    name: "Differentiated Instruction Planner",
    desc: "Create teaching plans that address weak, average, and advanced students in the same class.",
    icon: "🎯", category: "cross-subject",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Topic", type: "text", placeholder: "e.g. Fractions, Photosynthesis, World War II", required: true },
      { id: "subject", label: "Subject", type: "text", placeholder: "e.g. Mathematics", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Create a differentiated instruction plan.
Topic: {{topic}} | Subject: {{subject}} | Class: {{class}}
Provide 3 versions of the lesson:
WEAK STUDENTS:
- Learning objective (simplified)
- Activity (concrete, visual, hands-on)
- Assessment (basic recall)
- Support strategies

AVERAGE STUDENTS:
- Learning objective (standard)
- Activity (guided practice)
- Assessment (application)

ADVANCED STUDENTS:
- Learning objective (extended)
- Activity (higher-order thinking)
- Assessment (analysis/creation)
- Extension task

WHOLE CLASS: One activity that includes all levels.
Indian classroom context.`,
    seoTitle: "Free Differentiated Instruction Planner for Teachers | Forjit AI",
    seoDesc: "Create differentiated teaching plans for weak, average, and advanced students. Free tool for Indian school teachers.",
    seoKeywords: ["differentiated instruction planner India","inclusive teaching plan teacher free","differentiated learning CBSE teacher tool"],
    faqs: [
      { q: "What is differentiated instruction?", a: "Teaching the same topic at different levels to meet each student's needs." },
      { q: "Does it cover all student levels?", a: "Yes. Weak, average, and advanced students all get appropriate activities." },
      { q: "Is it suitable for B.Ed?", a: "Yes. Excellent for B.Ed lesson plans and inclusive education assignments." },
      { q: "Can I use it for any subject?", a: "Yes. Works for maths, science, language, social science, and more." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  {
    id: "notice-circular-writer",
    name: "School Notice & Circular Writer",
    desc: "Generate professional school notices and circulars for any event or announcement.",
    icon: "📋", category: "cross-subject",
    audience: "teacher", model: "fast", maxTokens: 350,
    inputs: [
      { id: "type", label: "Notice Type", type: "select", options: ["School Notice","Circular to Parents","Meeting Notice","Event Announcement","Holiday Notice","Exam Circular","General Circular"] },
      { id: "topic", label: "Subject / Purpose", type: "text", placeholder: "e.g. Annual Sports Day, Parent-Teacher Meeting, Diwali Holiday", required: true },
      { id: "details", label: "Key Details", type: "textarea", placeholder: "Date, time, venue, any special instructions…", rows: 2, required: false },
    ],
    promptTemplate: `Write a professional school {{type}}.
Subject: {{topic}}
Details: {{details}}
Format:
NOTICE / CIRCULAR
[Title in caps]
Date: [today's date placeholder]
[Body — clear, concise, 3-4 sentences]
[Any action required]
[Signature: Class Teacher / Principal / School Office]
Professional tone. Clear language. Indian school format.`,
    seoTitle: "Free School Notice & Circular Writer for Teachers | Forjit AI",
    seoDesc: "Generate professional school notices and circulars. Free tool for Indian school teachers. Events, meetings, holidays, exams covered.",
    seoKeywords: ["school notice writer teacher India","circular generator school free","notice board content maker teacher"],
    faqs: [
      { q: "What notice types can I create?", a: "School notice, parent circular, meeting notice, event announcement, holiday notice, exam circular." },
      { q: "Is the format professional?", a: "Yes. Standard Indian school notice/circular format." },
      { q: "Can I add specific details?", a: "Yes. Add date, time, venue in the key details field." },
      { q: "Is it suitable for printing?", a: "Yes. Copy and paste into Word for printing." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  /* ════════════════════════════════════════════════════════════════════════
     HIGHER EDUCATION — Phase 2
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "thesis-chapter-outline",
    name: "Thesis / Dissertation Chapter Outline Maker",
    desc: "Generate a detailed chapter outline for any research thesis or dissertation.",
    icon: "📚", category: "higher-ed",
    audience: "lecturer", model: "smart", maxTokens: 600,
    inputs: [
      { id: "title", label: "Thesis Title / Topic", type: "text", placeholder: "e.g. Impact of E-learning on Student Performance in Rural India", required: true },
      { id: "discipline", label: "Discipline", type: "text", placeholder: "e.g. Education, Computer Science, Economics", required: true },
      { id: "level", label: "Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
    ],
    promptTemplate: `Create a detailed thesis/dissertation chapter outline.
Title: {{title}} | Discipline: {{discipline}} | Level: {{level}}
Provide:
CHAPTER 1: Introduction
- Background, problem statement, objectives, research questions, significance, limitations, chapter scheme

CHAPTER 2: Literature Review
- Key themes to cover, suggested sub-sections, gap identification

CHAPTER 3: Research Methodology
- Research design, data collection, sampling, instruments, analysis plan

CHAPTER 4: Data Analysis & Findings
- Sub-sections for presenting results, tables, figures

CHAPTER 5: Discussion & Conclusions
- Interpretation, implications, recommendations, future scope

REFERENCES: Format suggestion (APA/MLA)
Each chapter with estimated page count and key points to address.`,
    seoTitle: "Free Thesis Chapter Outline Maker for Researchers | Forjit AI",
    seoDesc: "Generate detailed thesis and dissertation chapter outlines. Free tool for Indian college researchers and PhD scholars.",
    seoKeywords: ["thesis outline generator India","dissertation chapter outline free","PhD thesis structure maker India"],
    faqs: [
      { q: "Does it cover all chapters?", a: "Yes. All 5 standard chapters with detailed sub-sections." },
      { q: "Is it suitable for PhD thesis?", a: "Yes. Works for UG dissertation, PG dissertation, M.Phil, and PhD." },
      { q: "Are page counts suggested?", a: "Yes. Estimated page count per chapter is included." },
      { q: "Can it handle any discipline?", a: "Yes. Works for all academic disciplines." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.84,
  },

  {
    id: "citation-formatter",
    name: "Reference & Citation Formatter",
    desc: "Format references in APA, MLA, or Chicago style for research papers and assignments.",
    icon: "🔖", category: "higher-ed",
    audience: "lecturer", model: "fast", maxTokens: 400,
    inputs: [
      { id: "source", label: "Source Details", type: "textarea", placeholder: "e.g. Author name, book/article title, publisher, year, URL…", required: true, rows: 3 },
      { id: "style", label: "Citation Style", type: "select", options: ["APA 7th Edition","MLA 9th Edition","Chicago","Harvard","Vancouver (Medical)"] },
      { id: "type", label: "Source Type", type: "select", options: ["Book","Journal Article","Website","Newspaper","Thesis","Conference Paper","Any"] },
    ],
    promptTemplate: `Format this reference in {{style}} citation style.
Source: {{source}}
Source Type: {{type}}
Provide:
1. FORMATTED REFERENCE (exact format for reference list)
2. IN-TEXT CITATION (how to cite within the paper)
3. COMMON MISTAKES to avoid with this citation
Follow {{style}} guidelines precisely.`,
    seoTitle: "Free Citation & Reference Formatter for Teachers | Forjit AI",
    seoDesc: "Format references in APA, MLA, Chicago, Harvard style. Free citation tool for Indian college researchers and lecturers.",
    seoKeywords: ["citation formatter India free","APA MLA reference generator","bibliography maker college India"],
    faqs: [
      { q: "Which citation styles are supported?", a: "APA 7th, MLA 9th, Chicago, Harvard, and Vancouver (Medical)." },
      { q: "Does it include in-text citations?", a: "Yes. Both reference list format and in-text citation format are given." },
      { q: "What source types are supported?", a: "Books, journal articles, websites, newspapers, theses, and conference papers." },
      { q: "Are common mistakes highlighted?", a: "Yes. Common citation mistakes for that format are noted." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.83,
  },

  /* ════════════════════════════════════════════════════════════════════════
     TIMETABLE & PLANNER
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "class-timetable-generator",
    name: "Class Timetable Generator",
    desc: "Generate a weekly class timetable for any school or college with periods and breaks.",
    icon: "🗓️", category: "cross-subject",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "classes", label: "Classes / Sections", type: "text", placeholder: "e.g. Class 10A, 10B, 11 Science, 11 Commerce", required: true },
      { id: "subjects", label: "Subjects & Periods/Week", type: "textarea", placeholder: "e.g. Maths-6, Science-5, English-5, Hindi-4, SST-4, Computer-2", required: true, rows: 3 },
      { id: "days", label: "School Days", type: "select", options: ["Monday to Friday (5 days)","Monday to Saturday (6 days)"] },
      { id: "periods", label: "Periods Per Day", type: "select", options: ["6 periods","7 periods","8 periods"] },
    ],
    promptTemplate: `Create a complete weekly class timetable.
Classes: {{classes}} | Days: {{days}} | Periods/Day: {{periods}}
Subjects & periods needed: {{subjects}}

Format as a clear table:
DAY | Period 1 | Period 2 | Period 3 | BREAK | Period 4 | Period 5 | Period 6 | ...

Rules:
- No teacher has same subject consecutively more than 2 periods
- Include morning assembly (15 min), lunch break, and short breaks
- Distribute subjects evenly across the week
- Maths and Science in morning slots preferred
- PT/Games on Saturday if 6-day week
Print-ready format. Indian school structure.`,
    seoTitle: "Free Class Timetable Generator for Teachers | Forjit AI",
    seoDesc: "Generate weekly class timetables for any school or college. Free tool for Indian teachers. Balanced subject distribution with breaks.",
    seoKeywords: ["class timetable generator India","school timetable maker free","weekly timetable generator teacher CBSE"],
    faqs: [
      { q: "Can I create timetables for multiple classes?", a: "Yes. Enter multiple classes and sections." },
      { q: "Are breaks included?", a: "Yes. Assembly, lunch, and short breaks are included." },
      { q: "Is subject distribution balanced?", a: "Yes. Subjects are spread evenly across the week." },
      { q: "Can I print the timetable?", a: "Yes. Copy and paste into Word or Excel for printing." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.90,
  },

  {
    id: "annual-academic-planner",
    name: "Annual Academic Master Planner",
    desc: "Create a full academic year plan with terms, exams, holidays, syllabus milestones, and activities.",
    icon: "📆", category: "cross-subject",
    audience: "teacher", model: "smart", maxTokens: 700,
    inputs: [
      { id: "school", label: "School / Institution Type", type: "select", options: ["CBSE School","ICSE School","State Board School","Engineering College","Arts College","Commerce College","Polytechnic / ITI"] },
      { id: "class", label: "Class / Year", type: "text", placeholder: "e.g. Class 10, B.Com Year 2, FY Engineering", required: true },
      { id: "startMonth", label: "Academic Year Start", type: "select", options: ["April (India Standard)","June","July","August"] },
      { id: "exams", label: "Key Exams", type: "text", placeholder: "e.g. Unit Test, Mid-term, Pre-board, Annual", required: false },
    ],
    promptTemplate: `Create a detailed annual academic master planner.
Institution: {{school}} | Class: {{class}} | Start: {{startMonth}} | Exams: {{exams}}

Month-by-month plan covering all 12 months:
MONTH | TERM | SYLLABUS FOCUS | EXAMS/TESTS | ACTIVITIES | HOLIDAYS
Include:
- Term 1 and Term 2 split
- Unit test schedule (monthly)
- Mid-term exam period
- Pre-board / Preliminary exam
- Annual / Board exam preparation
- Parent-teacher meetings (2 per year)
- Sports day, cultural events, science fair
- Revision periods before exams
- Summer/winter vacation blocks
Indian academic calendar. Practical and realistic.`,
    seoTitle: "Free Annual Academic Master Planner for Teachers | Forjit AI",
    seoDesc: "Create a full academic year master plan for any school or college. Free tool for Indian teachers. Month-wise syllabus, exams, activities.",
    seoKeywords: ["annual academic planner teacher India","yearly school planner generator free","academic calendar maker CBSE teacher"],
    faqs: [
      { q: "Does it cover the full year?", a: "Yes. All 12 months with syllabus, exams, and activities." },
      { q: "Are vacation periods included?", a: "Yes. Summer, winter, and festival holidays are included." },
      { q: "Is it suitable for colleges too?", a: "Yes. Works for engineering, arts, commerce, and science colleges." },
      { q: "Are PTM dates included?", a: "Yes. Parent-teacher meeting dates are planned in." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.91,
  },

  /* ════════════════════════════════════════════════════════════════════════
     COMMERCE STREAM
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "accountancy-problem-solver",
    name: "Accountancy Problem Solver",
    desc: "Solve accountancy problems step-by-step — journal entries, ledger, P&L, balance sheet.",
    icon: "📒", category: "commerce",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "problem", label: "Problem / Transaction", type: "textarea", placeholder: "e.g. Journalise: Goods worth ₹5000 purchased from Ram on credit", required: true, rows: 3 },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "topic", label: "Topic", type: "select", options: ["Journal Entries","Ledger Accounts","Trial Balance","P&L Account","Balance Sheet","Cash Flow","Partnership","Company Accounts"] },
    ],
    promptTemplate: `Solve this accountancy problem step-by-step.
Problem: {{problem}} | Class: {{class}} | Topic: {{topic}}
Show:
1. IDENTIFY the type of transaction
2. GOLDEN RULES applied (if journal)
3. JOURNAL ENTRY or LEDGER format (proper T-format)
4. STEP-BY-STEP WORKING
5. FINAL ANSWER with amounts
6. KEY RULE / CONCEPT used
CBSE/ISC accountancy curriculum. Use ₹ symbol.`,
    seoTitle: "Free Accountancy Problem Solver for Teachers | Forjit AI",
    seoDesc: "Solve accountancy journal entries, ledger, P&L, balance sheet problems step-by-step. Free tool for commerce teachers. CBSE Class 11-12.",
    seoKeywords: ["accountancy problem solver India","journal entry solver CBSE","accountancy teacher tool free India"],
    faqs: [
      { q: "What accountancy topics are covered?", a: "Journal entries, ledger, trial balance, P&L, balance sheet, partnership, and company accounts." },
      { q: "Are golden rules explained?", a: "Yes. The applicable golden rules are stated for each journal entry." },
      { q: "Is T-format used for ledger?", a: "Yes. Proper T-account format for ledger entries." },
      { q: "Is it CBSE Class 12 aligned?", a: "Yes. Follows CBSE commerce curriculum for Class 11-12." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.88,
  },

  {
    id: "business-studies-notes",
    name: "Business Studies Notes & Case Study Maker",
    desc: "Generate structured notes and case studies for any Business Studies chapter or topic.",
    icon: "💼", category: "commerce",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Topic / Chapter", type: "text", placeholder: "e.g. Marketing Management, Staffing, Consumer Protection Act", required: true },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "type", label: "Content Type", type: "select", options: ["Chapter Notes","Case Study","MCQ Questions","Difference Table","Concept Map Points"] },
    ],
    promptTemplate: `Create {{type}} for Business Studies.
Topic: {{topic}} | Class: {{class}}
For Notes: Key definitions, concepts, types, importance, functions (exam-focused).
For Case Study: Real Indian company example, problem, analysis, solution.
For MCQ: 10 questions with answers.
For Difference Table: Compare key terms (minimum 3 bases).
For Concept Map: Hierarchical bullet points.
CBSE/NCERT Business Studies curriculum.`,
    seoTitle: "Free Business Studies Notes & Case Study Maker | Forjit AI",
    seoDesc: "Generate Business Studies notes and case studies for any chapter. Free tool for commerce teachers. CBSE Class 11-12 and BBA.",
    seoKeywords: ["business studies notes generator India","BST case study maker CBSE","business studies teacher tool free"],
    faqs: [
      { q: "What content types can I generate?", a: "Chapter notes, case studies, MCQs, difference tables, and concept map points." },
      { q: "Are Indian company examples used?", a: "Yes. Case studies use real Indian company examples." },
      { q: "Is it CBSE Class 12 aligned?", a: "Yes. Follows NCERT Business Studies syllabus." },
      { q: "Can I use it for BBA?", a: "Yes. Select BBA level for college-appropriate content." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  {
    id: "economics-numericals-solver",
    name: "Economics Numericals Solver",
    desc: "Solve economics numericals — national income, elasticity, cost-revenue, index numbers.",
    icon: "📈", category: "commerce",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "problem", label: "Problem", type: "textarea", placeholder: "e.g. Calculate GDP by expenditure method: C=800, I=200, G=150, X-M=50", required: true, rows: 3 },
      { id: "class", label: "Class", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "topic", label: "Topic", type: "select", options: ["National Income","Elasticity","Cost & Revenue","Index Numbers","Money & Banking","Balance of Payments","Any"] },
    ],
    promptTemplate: `Solve this economics numerical step-by-step.
Problem: {{problem}} | Class: {{class}} | Topic: {{topic}}
Show:
1. GIVEN DATA
2. FORMULA USED (name and write formula)
3. STEP-BY-STEP CALCULATION
4. ANSWER with units
5. INTERPRETATION (what does this answer mean)
CBSE economics curriculum. Clear and detailed.`,
    seoTitle: "Free Economics Numericals Solver for Teachers | Forjit AI",
    seoDesc: "Solve economics numericals step-by-step. National income, elasticity, cost-revenue. Free tool for economics teachers. CBSE Class 12.",
    seoKeywords: ["economics numericals solver India","economics problems CBSE step by step","economics teacher tool free India"],
    faqs: [
      { q: "What economics topics are covered?", a: "National income, elasticity, cost/revenue, index numbers, money/banking, and more." },
      { q: "Are formulas shown?", a: "Yes. Formula name and formula are both shown." },
      { q: "Is working shown step by step?", a: "Yes. Every step with values substituted." },
      { q: "Is CBSE Class 12 covered?", a: "Yes. All Class 11-12 economics numericals are covered." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  /* ════════════════════════════════════════════════════════════════════════
     ARTS / HUMANITIES STREAM
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "political-science-notes",
    name: "Political Science Notes Maker",
    desc: "Generate structured notes for any Political Science topic — Indian polity, governance, IR.",
    icon: "🏛️", category: "arts",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Topic", type: "text", placeholder: "e.g. Fundamental Rights, Election Commission, Foreign Policy of India", required: true },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "type", label: "Content Type", type: "select", options: ["Chapter Notes","MCQ Questions","Short Answer Points","Important Definitions","Comparison Table"] },
    ],
    promptTemplate: `Create {{type}} for Political Science.
Topic: {{topic}} | Level: {{class}}
For Notes: Key concepts, provisions, significance, examples, criticisms.
For MCQs: 10 questions with answers. Include article numbers where applicable.
For Short Answer: 5 key points per sub-topic (exam format).
For Definitions: Clear definitions of all key terms.
For Comparison: Compare relevant institutions/concepts.
NCERT/CBSE Political Science curriculum. Include article/act references.`,
    seoTitle: "Free Political Science Notes Maker for Teachers | Forjit AI",
    seoDesc: "Generate Political Science notes and MCQs for any topic. Free tool for Pol Science teachers. CBSE Class 11-12 and BA level.",
    seoKeywords: ["political science notes generator India","polity notes maker CBSE free","political science MCQ teacher tool"],
    faqs: [
      { q: "Are article numbers included?", a: "Yes. Relevant Constitutional article numbers are referenced." },
      { q: "Is it useful for UPSC?", a: "Yes. Select 'UPSC Preparation' for comprehensive notes." },
      { q: "What topics are covered?", a: "Indian Constitution, governance, elections, federalism, international relations, and more." },
      { q: "Is NCERT aligned?", a: "Yes. Follows NCERT Political Science syllabus." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  {
    id: "sociology-psychology-notes",
    name: "Sociology & Psychology Notes Maker",
    desc: "Generate notes, theory summaries, and case studies for Sociology or Psychology topics.",
    icon: "🧠", category: "arts",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "subject", label: "Subject", type: "select", options: ["Sociology","Psychology","Social Work","Anthropology"] },
      { id: "topic", label: "Topic / Theory", type: "text", placeholder: "e.g. Maslow's Hierarchy, Social Stratification, Indian Family System", required: true },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "type", label: "Content Type", type: "select", options: ["Theory Summary","Case Study","MCQ Questions","Key Thinkers & Concepts","Research Methods Notes"] },
    ],
    promptTemplate: `Create {{type}} for {{subject}}.
Topic: {{topic}} | Level: {{class}}
For Theory: Theorist, key concepts, assumptions, applications, criticisms.
For Case Study: Real-world Indian/global example with analysis.
For MCQs: 10 questions with answers.
For Thinkers: Name, nationality, major works, key ideas.
For Research: Types, methods, tools, limitations.
NCERT/UGC curriculum. Indian social context.`,
    seoTitle: "Free Sociology & Psychology Notes Maker for Teachers | Forjit AI",
    seoDesc: "Generate Sociology and Psychology notes, theory summaries, case studies. Free tool for Indian teachers. Class 11-12 and BA level.",
    seoKeywords: ["sociology notes generator India","psychology notes maker free","social science teacher tool India"],
    faqs: [
      { q: "Which subjects are covered?", a: "Sociology, Psychology, Social Work, and Anthropology." },
      { q: "Are Indian examples used?", a: "Yes. Indian social context and examples are used." },
      { q: "Are theorists covered?", a: "Yes. Major theorists with their key ideas and works." },
      { q: "Is it UGC aligned?", a: "Yes. Follows UGC and NCERT curriculum context." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.85,
  },

  /* ════════════════════════════════════════════════════════════════════════
     PROFESSIONAL COURSES
  ════════════════════════════════════════════════════════════════════════ */
  {
    id: "law-llb-notes",
    name: "LLB / Law Notes & Case Summariser",
    desc: "Generate law notes, case summaries, and legal concept explanations for LLB students.",
    icon: "⚖️", category: "professional",
    audience: "lecturer", model: "smart", maxTokens: 650,
    inputs: [
      { id: "topic", label: "Legal Topic / Case", type: "text", placeholder: "e.g. Doctrine of Promissory Estoppel, Kesavananda Bharati case, IPC Section 302", required: true },
      { id: "subject", label: "Law Subject", type: "select", options: ["Constitutional Law","Contract Law","Criminal Law (IPC/BNS)","Tort Law","Family Law","Property Law","Corporate Law","Evidence Act","Any"] },
      { id: "year", label: "LLB Year", type: "select", options: ["LLB Year 1","LLB Year 2","LLB Year 3","LLM"] },
      { id: "type", label: "Content Type", type: "select", options: ["Topic Notes","Case Summary","Landmark Cases List","Bare Act Explanation","Exam Q&A"] },
    ],
    promptTemplate: `Create {{type}} for Law.
Topic/Case: {{topic}} | Subject: {{subject}} | Level: {{year}}
For Notes: Definition, legal provisions, elements, exceptions, landmark cases, landmark judgements.
For Case Summary: Facts, issues, arguments, judgement, ratio decidendi, significance.
For Landmark Cases: Case name, court, year, ratio, significance.
For Bare Act: Section number, text simplified, explanation, illustrations.
For Q&A: 5 likely exam questions with detailed answers.
Relevant Indian laws and BNS (Bharatiya Nyaya Sanhita) updates where applicable.`,
    seoTitle: "Free LLB Law Notes & Case Summariser for Law Teachers | Forjit AI",
    seoDesc: "Generate LLB law notes, case summaries, and legal concept explanations. Free tool for Indian law teachers. Constitutional, Criminal, Contract law.",
    seoKeywords: ["LLB notes generator India","law case summary maker free","legal notes tool India teacher"],
    faqs: [
      { q: "Does it cover BNS (new criminal law)?", a: "Yes. Includes updated Bharatiya Nyaya Sanhita references where applicable." },
      { q: "Are landmark cases included?", a: "Yes. Important landmark cases are referenced in notes." },
      { q: "What law subjects are covered?", a: "Constitutional, Contract, Criminal, Tort, Family, Property, Corporate law and more." },
      { q: "Is it suitable for LLM level?", a: "Yes. Select LLM for advanced level content." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.88,
  },

  {
    id: "mbbs-medical-notes",
    name: "MBBS / Medical Notes Generator",
    desc: "Generate medical notes, case presentations, and clinical summaries for medical students.",
    icon: "🩺", category: "professional",
    audience: "lecturer", model: "smart", maxTokens: 650,
    inputs: [
      { id: "topic", label: "Medical Topic", type: "text", placeholder: "e.g. Myocardial Infarction, Diabetes Mellitus Type 2, Appendicitis management", required: true },
      { id: "subject", label: "Medical Subject", type: "select", options: ["Anatomy","Physiology","Biochemistry","Pathology","Pharmacology","Medicine","Surgery","Obstetrics/Gynecology","Pediatrics","Any"] },
      { id: "year", label: "MBBS Year", type: "select", options: ["1st Year MBBS","2nd Year MBBS","3rd Year MBBS","Final Year MBBS","PG/MD/MS"] },
      { id: "type", label: "Content Type", type: "select", options: ["Topic Notes","Clinical Case Presentation","MCQ Questions","Mnemonics","Short Notes (2 marks)","Long Notes (10 marks)"] },
    ],
    promptTemplate: `Create {{type}} for Medical Education.
Topic: {{topic}} | Subject: {{subject}} | Year: {{year}}
For Topic Notes: Definition, etiology, pathophysiology, clinical features, investigations, treatment, complications, prognosis.
For Clinical Case: Chief complaint, history, examination findings, investigations, diagnosis, management.
For MCQs: 10 medical MCQs with answers (mark tricky options).
For Mnemonics: Memory aids for complex lists/criteria.
For Short Notes: 150-200 words covering key exam points.
For Long Notes: Full detailed notes exam format.
Current clinical guidelines. Indian context (MCI/NMC curriculum).`,
    seoTitle: "Free MBBS Medical Notes Generator for Medical Teachers | Forjit AI",
    seoDesc: "Generate MBBS medical notes, clinical cases, MCQs, and mnemonics. Free tool for Indian medical teachers and professors.",
    seoKeywords: ["MBBS notes generator India","medical notes maker free","clinical notes tool medical teacher India"],
    faqs: [
      { q: "What medical subjects are covered?", a: "Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Medicine, Surgery, OBG, Pediatrics." },
      { q: "Are mnemonics included?", a: "Yes. Select 'Mnemonics' type for memory aids." },
      { q: "Is it NMC curriculum aligned?", a: "Yes. Follows NMC (National Medical Commission) curriculum." },
      { q: "Can I get clinical case presentations?", a: "Yes. Full SOAP format clinical case presentations." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.88,
  },

  {
    id: "iti-vocational-notes",
    name: "ITI / Vocational Training Notes Maker",
    desc: "Generate practical notes, theory content, and worksheets for ITI and vocational trades.",
    icon: "🔧", category: "professional",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "trade", label: "Trade / Subject", type: "text", placeholder: "e.g. Electrician, Fitter, Welder, COPA, Mechanic Diesel, Plumber", required: true },
      { id: "topic", label: "Topic / Practical", type: "text", placeholder: "e.g. Wiring circuits, Lathe operations, OSHA safety rules", required: true },
      { id: "type", label: "Content Type", type: "select", options: ["Theory Notes","Practical Job Sheet","Safety Rules","Tool Description","MCQ Questions","Viva Questions"] },
    ],
    promptTemplate: `Create {{type}} for ITI/Vocational training.
Trade: {{trade}} | Topic: {{topic}}
For Theory Notes: Principle, working, types, applications, advantages, limitations.
For Job Sheet: Aim, materials/tools, procedure (numbered steps), observations, result, precautions.
For Safety Rules: 10 trade-specific safety rules in simple language.
For Tool Description: Tool name, diagram description, parts, uses, care and maintenance.
For MCQs: 10 questions with answers.
For Viva: 10 viva questions with expected answers.
NCVT/SCVT curriculum. Simple practical language.`,
    seoTitle: "Free ITI Vocational Notes Maker for Teachers | Forjit AI",
    seoDesc: "Generate ITI and vocational training notes, job sheets, safety rules, and MCQs. Free tool for ITI instructors. All trades covered.",
    seoKeywords: ["ITI notes generator India","vocational training notes free","ITI job sheet maker NCVT teacher"],
    faqs: [
      { q: "Which ITI trades are supported?", a: "All trades — Electrician, Fitter, Welder, COPA, Mechanic, Plumber, and more." },
      { q: "Are job sheets included?", a: "Yes. Full practical job sheets with procedure and observations." },
      { q: "Is NCVT curriculum followed?", a: "Yes. Follows NCVT and SCVT curriculum guidelines." },
      { q: "Are safety rules included?", a: "Yes. Trade-specific safety rules in simple language." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.87,
  },

  {
    id: "fashion-design-notes",
    name: "Fashion Design Notes & Assignment Maker",
    desc: "Generate notes, project briefs, and assignments for fashion design students.",
    icon: "👗", category: "professional",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Topic / Subject", type: "text", placeholder: "e.g. Fabric Construction, Pattern Making, Fashion History, Garment Finishing", required: true },
      { id: "level", label: "Course Level", type: "select", options: ["Diploma Year 1","Diploma Year 2","Degree Year 1","Degree Year 2","Degree Year 3","Certificate Course"] },
      { id: "type", label: "Content Type", type: "select", options: ["Theory Notes","Project Brief","Assignment Questions","Practical Instruction Sheet","Design Brief","Terminology List"] },
    ],
    promptTemplate: `Create {{type}} for Fashion Design education.
Topic: {{topic}} | Level: {{level}}
For Theory Notes: Definition, types, properties, processes, industry applications.
For Project Brief: Objective, theme, requirements, deliverables, evaluation criteria.
For Assignment: 5 detailed assignment questions (theory + application).
For Practical Instructions: Step-by-step practical with tools, materials, procedure.
For Design Brief: Client profile, requirements, mood board direction, constraints.
For Terminology: 15-20 fashion terms with clear definitions.
NIFT/FDDI/State fashion institute curriculum context.`,
    seoTitle: "Free Fashion Design Notes & Assignment Maker | Forjit AI",
    seoDesc: "Generate fashion design notes, project briefs, and assignments. Free tool for fashion design teachers. NIFT/FDDI curriculum aligned.",
    seoKeywords: ["fashion design notes generator India","fashion design assignment maker free","fashion teacher tool NIFT India"],
    faqs: [
      { q: "What topics are covered?", a: "Fabric, pattern making, garment construction, fashion history, illustration, retail, and more." },
      { q: "Is it NIFT curriculum aligned?", a: "Yes. Follows NIFT and FDDI curriculum context." },
      { q: "Can I create project briefs?", a: "Yes. Full project briefs with objectives and evaluation criteria." },
      { q: "Are design briefs included?", a: "Yes. Client-style design briefs for project-based learning." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },

  {
    id: "hotel-management-notes",
    name: "Hotel Management Notes & SOP Maker",
    desc: "Generate hospitality notes, SOPs, and training content for hotel management students.",
    icon: "🏨", category: "professional",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Topic / Subject", type: "text", placeholder: "e.g. Front Office Operations, Food & Beverage Service, Housekeeping, Menu Planning", required: true },
      { id: "level", label: "Course Level", type: "select", options: ["Certificate (NCHMCT)","Diploma","B.Sc Hotel Management Year 1","B.Sc Year 2","B.Sc Year 3","MBA Hospitality"] },
      { id: "type", label: "Content Type", type: "select", options: ["Theory Notes","Standard Operating Procedure (SOP)","MCQ Questions","Practical Checklist","Guest Interaction Script","Case Study"] },
    ],
    promptTemplate: `Create {{type}} for Hotel Management education.
Topic: {{topic}} | Level: {{level}}
For Theory Notes: Definition, types, roles, procedures, industry standards.
For SOP: Step-by-step standard operating procedure with quality checks.
For MCQs: 10 hospitality MCQs with answers.
For Checklist: Practical checklist with items to verify/complete.
For Guest Script: Professional guest interaction dialogue (greeting, complaint, farewell).
For Case Study: Real hotel scenario with problem and resolution.
NCHMCT/IHM curriculum. International hospitality standards + Indian context.`,
    seoTitle: "Free Hotel Management Notes & SOP Maker for Teachers | Forjit AI",
    seoDesc: "Generate hotel management notes, SOPs, and training content. Free tool for hospitality teachers. NCHMCT/IHM curriculum aligned.",
    seoKeywords: ["hotel management notes generator India","hospitality SOP maker free","hotel management teacher tool NCHMCT"],
    faqs: [
      { q: "Are SOPs included?", a: "Yes. Full Standard Operating Procedures with step-by-step instructions." },
      { q: "What departments are covered?", a: "Front office, F&B service, housekeeping, kitchen, events, and more." },
      { q: "Is NCHMCT curriculum followed?", a: "Yes. Follows NCHMCT and IHM curriculum guidelines." },
      { q: "Are guest interaction scripts available?", a: "Yes. Professional guest handling scripts for training." },
      { q: "Is it free?", a: "Completely free." },
    ],
    priority: 0.86,
  },


  /* ════════════════════════════════════════════════════════════════════
     REGIONAL LANGUAGE TOOLS — Auto-generated
     50 tools across 10 languages
  ════════════════════════════════════════════════════════════════════ */
  {
    id: "tamil-essay-writer",
    name: "Tamil Essay Writer (தமிழ் निबंध)",
    desc: "Write Tamil essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "tamil",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (தமிழ்)", type: "text", placeholder: "e.g. என் தாய்நாடு, சுற்றுச்சூழல், தீபாவளி" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Tamil essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Tamil (Tamil script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Tamil. Appropriate for {{class}} level. TNBSE curriculum.`,
    seoTitle: "Free Tamil Essay Writer for Teachers | தமிழ் निबंध | Forjit AI",
    seoDesc: "Generate Tamil essays for any topic. Free tool for Tamil teachers. TNBSE aligned. Class 1-12 and college.",
    seoKeywords: ["tamil essay writer free India","Tamil nibandh generator","tamil essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Tamil?", a: "Yes. Completely in Tamil (Tamil script)." },
      { q: "Which board is it aligned to?", a: "TNBSE and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "tamil-letter-writer",
    name: "Tamil Letter Writer (தமிழ் पत्र लेखन)",
    desc: "Generate formal and informal Tamil letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "tamil",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (தமிழ்)", type: "text", placeholder: "e.g. விடுமுறை கேட்டு, புகார் கடிதம்" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Tamil.
Purpose: {{topic}} | Level: {{class}}
Write completely in Tamil (Tamil script).
Use correct letter format: address, date, salutation, body, closing, signature.
TNBSE exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Tamil Letter Writer for Teachers | தமிழ் पत्र | Forjit AI",
    seoDesc: "Generate Tamil formal and informal letters. Free tool for Tamil teachers and students. TNBSE format.",
    seoKeywords: ["tamil letter writer free","Tamil patra lekhan tool","tamil formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Tamil letter format for TNBSE exams." },
      { q: "Is it written in Tamil?", a: "Yes. Entirely in Tamil script." },
      { q: "Is it exam ready?", a: "Yes. Follows TNBSE exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "tamil-grammar-explainer",
    name: "Tamil Grammar Explainer (தமிழ் व्याकरण)",
    desc: "Explain Tamil grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "tamil",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (தமிழ்)", type: "text", placeholder: "e.g. வினைச்சொல், பெயர்ச்சொல், வேற்றுமை" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Tamil grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Tamil and English:
1. DEFINITION / RULE (in Tamil)
2. TYPES (if any)
3. EXAMPLES (5 examples in Tamil with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. TNBSE curriculum.`,
    seoTitle: "Free Tamil Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Tamil grammar topics with rules and examples. Free tool for Tamil teachers. TNBSE aligned.",
    seoKeywords: ["tamil grammar explainer free","Tamil vyakaran tool teacher","tamil grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Tamil and English?", a: "Yes. Definition in Tamil, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Tamil grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it TNBSE aligned?", a: "Yes. Follows TNBSE grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "tamil-translation-helper",
    name: "Tamil ↔ English Translation Helper",
    desc: "Translate between Tamil and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "tamil",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Tamil or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Tamil → English","English → Tamil"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Tamil English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Tamil and English with word-by-word explanation. Free tool for Tamil teachers and students.",
    seoKeywords: ["tamil english translation free India","Tamil translator teacher tool","tamil to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Tamil to English and English to Tamil." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "tamil-mcq-maker",
    name: "Tamil Language MCQ Maker",
    desc: "Generate Tamil language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "tamil",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Tamil Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Tamil language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Tamil (Tamil script).
Format: Q[N]. [question in Tamil]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. TNBSE curriculum.`,
    seoTitle: "Free Tamil MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Tamil language MCQs for grammar, vocabulary, comprehension. Free tool for Tamil teachers. TNBSE aligned.",
    seoKeywords: ["tamil MCQ generator teacher India","Tamil language quiz maker free","tamil grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Tamil?", a: "Yes. All questions are in Tamil script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it TNBSE aligned?", a: "Yes. Follows TNBSE language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "telugu-essay-writer",
    name: "Telugu Essay Writer (తెలుగు निबंध)",
    desc: "Write Telugu essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "telugu",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (తెలుగు)", type: "text", placeholder: "e.g. నా దేశం, పర్యావరణం, దీపావళి" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Telugu essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Telugu (Telugu script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Telugu. Appropriate for {{class}} level. BSEAP / BSETS curriculum.`,
    seoTitle: "Free Telugu Essay Writer for Teachers | తెలుగు निबंध | Forjit AI",
    seoDesc: "Generate Telugu essays for any topic. Free tool for Telugu teachers. BSEAP / BSETS aligned. Class 1-12 and college.",
    seoKeywords: ["telugu essay writer free India","Telugu nibandh generator","telugu essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Telugu?", a: "Yes. Completely in Telugu (Telugu script)." },
      { q: "Which board is it aligned to?", a: "BSEAP / BSETS and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "telugu-letter-writer",
    name: "Telugu Letter Writer (తెలుగు पत्र लेखन)",
    desc: "Generate formal and informal Telugu letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "telugu",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (తెలుగు)", type: "text", placeholder: "e.g. సెలవు కోసం, ఫిర్యాదు లేఖ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Telugu.
Purpose: {{topic}} | Level: {{class}}
Write completely in Telugu (Telugu script).
Use correct letter format: address, date, salutation, body, closing, signature.
BSEAP / BSETS exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Telugu Letter Writer for Teachers | తెలుగు पत्र | Forjit AI",
    seoDesc: "Generate Telugu formal and informal letters. Free tool for Telugu teachers and students. BSEAP / BSETS format.",
    seoKeywords: ["telugu letter writer free","Telugu patra lekhan tool","telugu formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Telugu letter format for BSEAP / BSETS exams." },
      { q: "Is it written in Telugu?", a: "Yes. Entirely in Telugu script." },
      { q: "Is it exam ready?", a: "Yes. Follows BSEAP / BSETS exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "telugu-grammar-explainer",
    name: "Telugu Grammar Explainer (తెలుగు व्याकरण)",
    desc: "Explain Telugu grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "telugu",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (తెలుగు)", type: "text", placeholder: "e.g. క్రియ, నామవాచకం, విభక్తి" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Telugu grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Telugu and English:
1. DEFINITION / RULE (in Telugu)
2. TYPES (if any)
3. EXAMPLES (5 examples in Telugu with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. BSEAP / BSETS curriculum.`,
    seoTitle: "Free Telugu Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Telugu grammar topics with rules and examples. Free tool for Telugu teachers. BSEAP / BSETS aligned.",
    seoKeywords: ["telugu grammar explainer free","Telugu vyakaran tool teacher","telugu grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Telugu and English?", a: "Yes. Definition in Telugu, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Telugu grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it BSEAP / BSETS aligned?", a: "Yes. Follows BSEAP / BSETS grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "telugu-translation-helper",
    name: "Telugu ↔ English Translation Helper",
    desc: "Translate between Telugu and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "telugu",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Telugu or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Telugu → English","English → Telugu"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Telugu English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Telugu and English with word-by-word explanation. Free tool for Telugu teachers and students.",
    seoKeywords: ["telugu english translation free India","Telugu translator teacher tool","telugu to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Telugu to English and English to Telugu." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "telugu-mcq-maker",
    name: "Telugu Language MCQ Maker",
    desc: "Generate Telugu language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "telugu",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Telugu Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Telugu language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Telugu (Telugu script).
Format: Q[N]. [question in Telugu]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. BSEAP / BSETS curriculum.`,
    seoTitle: "Free Telugu MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Telugu language MCQs for grammar, vocabulary, comprehension. Free tool for Telugu teachers. BSEAP / BSETS aligned.",
    seoKeywords: ["telugu MCQ generator teacher India","Telugu language quiz maker free","telugu grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Telugu?", a: "Yes. All questions are in Telugu script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it BSEAP / BSETS aligned?", a: "Yes. Follows BSEAP / BSETS language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "kannada-essay-writer",
    name: "Kannada Essay Writer (ಕನ್ನಡ निबंध)",
    desc: "Write Kannada essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "kannada",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (ಕನ್ನಡ)", type: "text", placeholder: "e.g. ನನ್ನ ದೇಶ, ಪರಿಸರ, ದೀಪಾವಳಿ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Kannada essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Kannada (Kannada script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Kannada. Appropriate for {{class}} level. KSEEB curriculum.`,
    seoTitle: "Free Kannada Essay Writer for Teachers | ಕನ್ನಡ निबंध | Forjit AI",
    seoDesc: "Generate Kannada essays for any topic. Free tool for Kannada teachers. KSEEB aligned. Class 1-12 and college.",
    seoKeywords: ["kannada essay writer free India","Kannada nibandh generator","kannada essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Kannada?", a: "Yes. Completely in Kannada (Kannada script)." },
      { q: "Which board is it aligned to?", a: "KSEEB and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "kannada-letter-writer",
    name: "Kannada Letter Writer (ಕನ್ನಡ पत्र लेखन)",
    desc: "Generate formal and informal Kannada letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "kannada",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (ಕನ್ನಡ)", type: "text", placeholder: "e.g. ರಜೆ ಕೋರಿ, ದೂರು ಪತ್ರ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Kannada.
Purpose: {{topic}} | Level: {{class}}
Write completely in Kannada (Kannada script).
Use correct letter format: address, date, salutation, body, closing, signature.
KSEEB exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Kannada Letter Writer for Teachers | ಕನ್ನಡ पत्र | Forjit AI",
    seoDesc: "Generate Kannada formal and informal letters. Free tool for Kannada teachers and students. KSEEB format.",
    seoKeywords: ["kannada letter writer free","Kannada patra lekhan tool","kannada formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Kannada letter format for KSEEB exams." },
      { q: "Is it written in Kannada?", a: "Yes. Entirely in Kannada script." },
      { q: "Is it exam ready?", a: "Yes. Follows KSEEB exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "kannada-grammar-explainer",
    name: "Kannada Grammar Explainer (ಕನ್ನಡ व्याकरण)",
    desc: "Explain Kannada grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "kannada",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (ಕನ್ನಡ)", type: "text", placeholder: "e.g. ಕ್ರಿಯಾಪದ, ನಾಮಪದ, ವಿಭಕ್ತಿ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Kannada grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Kannada and English:
1. DEFINITION / RULE (in Kannada)
2. TYPES (if any)
3. EXAMPLES (5 examples in Kannada with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. KSEEB curriculum.`,
    seoTitle: "Free Kannada Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Kannada grammar topics with rules and examples. Free tool for Kannada teachers. KSEEB aligned.",
    seoKeywords: ["kannada grammar explainer free","Kannada vyakaran tool teacher","kannada grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Kannada and English?", a: "Yes. Definition in Kannada, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Kannada grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it KSEEB aligned?", a: "Yes. Follows KSEEB grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "kannada-translation-helper",
    name: "Kannada ↔ English Translation Helper",
    desc: "Translate between Kannada and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "kannada",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Kannada or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Kannada → English","English → Kannada"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Kannada English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Kannada and English with word-by-word explanation. Free tool for Kannada teachers and students.",
    seoKeywords: ["kannada english translation free India","Kannada translator teacher tool","kannada to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Kannada to English and English to Kannada." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "kannada-mcq-maker",
    name: "Kannada Language MCQ Maker",
    desc: "Generate Kannada language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "kannada",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Kannada Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Kannada language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Kannada (Kannada script).
Format: Q[N]. [question in Kannada]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. KSEEB curriculum.`,
    seoTitle: "Free Kannada MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Kannada language MCQs for grammar, vocabulary, comprehension. Free tool for Kannada teachers. KSEEB aligned.",
    seoKeywords: ["kannada MCQ generator teacher India","Kannada language quiz maker free","kannada grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Kannada?", a: "Yes. All questions are in Kannada script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it KSEEB aligned?", a: "Yes. Follows KSEEB language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "malayalam-essay-writer",
    name: "Malayalam Essay Writer (മലയാളം निबंध)",
    desc: "Write Malayalam essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "malayalam",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (മലയാളം)", type: "text", placeholder: "e.g. എൻ്റെ നാട്, പരിസ്ഥിതി, ദീപാവലി" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Malayalam essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Malayalam (Malayalam script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Malayalam. Appropriate for {{class}} level. SCERT Kerala curriculum.`,
    seoTitle: "Free Malayalam Essay Writer for Teachers | മലയാളം निबंध | Forjit AI",
    seoDesc: "Generate Malayalam essays for any topic. Free tool for Malayalam teachers. SCERT Kerala aligned. Class 1-12 and college.",
    seoKeywords: ["malayalam essay writer free India","Malayalam nibandh generator","malayalam essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Malayalam?", a: "Yes. Completely in Malayalam (Malayalam script)." },
      { q: "Which board is it aligned to?", a: "SCERT Kerala and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "malayalam-letter-writer",
    name: "Malayalam Letter Writer (മലയാളം पत्र लेखन)",
    desc: "Generate formal and informal Malayalam letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "malayalam",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (മലയാളം)", type: "text", placeholder: "e.g. അവധിക്ക് അപേക്ഷ, പരാതി കത്ത്" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Malayalam.
Purpose: {{topic}} | Level: {{class}}
Write completely in Malayalam (Malayalam script).
Use correct letter format: address, date, salutation, body, closing, signature.
SCERT Kerala exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Malayalam Letter Writer for Teachers | മലയാളം पत्र | Forjit AI",
    seoDesc: "Generate Malayalam formal and informal letters. Free tool for Malayalam teachers and students. SCERT Kerala format.",
    seoKeywords: ["malayalam letter writer free","Malayalam patra lekhan tool","malayalam formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Malayalam letter format for SCERT Kerala exams." },
      { q: "Is it written in Malayalam?", a: "Yes. Entirely in Malayalam script." },
      { q: "Is it exam ready?", a: "Yes. Follows SCERT Kerala exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "malayalam-grammar-explainer",
    name: "Malayalam Grammar Explainer (മലയാളം व्याकरण)",
    desc: "Explain Malayalam grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "malayalam",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (മലയാളം)", type: "text", placeholder: "e.g. ക്രിയ, നാമം, വിഭക്തി" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Malayalam grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Malayalam and English:
1. DEFINITION / RULE (in Malayalam)
2. TYPES (if any)
3. EXAMPLES (5 examples in Malayalam with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. SCERT Kerala curriculum.`,
    seoTitle: "Free Malayalam Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Malayalam grammar topics with rules and examples. Free tool for Malayalam teachers. SCERT Kerala aligned.",
    seoKeywords: ["malayalam grammar explainer free","Malayalam vyakaran tool teacher","malayalam grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Malayalam and English?", a: "Yes. Definition in Malayalam, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Malayalam grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it SCERT Kerala aligned?", a: "Yes. Follows SCERT Kerala grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "malayalam-translation-helper",
    name: "Malayalam ↔ English Translation Helper",
    desc: "Translate between Malayalam and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "malayalam",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Malayalam or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Malayalam → English","English → Malayalam"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Malayalam English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Malayalam and English with word-by-word explanation. Free tool for Malayalam teachers and students.",
    seoKeywords: ["malayalam english translation free India","Malayalam translator teacher tool","malayalam to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Malayalam to English and English to Malayalam." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "malayalam-mcq-maker",
    name: "Malayalam Language MCQ Maker",
    desc: "Generate Malayalam language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "malayalam",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Malayalam Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Malayalam language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Malayalam (Malayalam script).
Format: Q[N]. [question in Malayalam]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. SCERT Kerala curriculum.`,
    seoTitle: "Free Malayalam MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Malayalam language MCQs for grammar, vocabulary, comprehension. Free tool for Malayalam teachers. SCERT Kerala aligned.",
    seoKeywords: ["malayalam MCQ generator teacher India","Malayalam language quiz maker free","malayalam grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Malayalam?", a: "Yes. All questions are in Malayalam script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it SCERT Kerala aligned?", a: "Yes. Follows SCERT Kerala language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "marathi-essay-writer",
    name: "Marathi Essay Writer (मराठी निबंध)",
    desc: "Write Marathi essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "marathi",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (मराठी)", type: "text", placeholder: "e.g. माझा देश, पर्यावरण, दिवाळी" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Marathi essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Marathi (Devanagari (Marathi)).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Marathi. Appropriate for {{class}} level. Maharashtra SSC/HSC curriculum.`,
    seoTitle: "Free Marathi Essay Writer for Teachers | मराठी निबंध | Forjit AI",
    seoDesc: "Generate Marathi essays for any topic. Free tool for Marathi teachers. Maharashtra SSC/HSC aligned. Class 1-12 and college.",
    seoKeywords: ["marathi essay writer free India","Marathi nibandh generator","marathi essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Marathi?", a: "Yes. Completely in Marathi (Devanagari (Marathi))." },
      { q: "Which board is it aligned to?", a: "Maharashtra SSC/HSC and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "marathi-letter-writer",
    name: "Marathi Letter Writer (मराठी पत्र लेखन)",
    desc: "Generate formal and informal Marathi letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "marathi",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (मराठी)", type: "text", placeholder: "e.g. रजा मागणी, तक्रार पत्र" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Marathi.
Purpose: {{topic}} | Level: {{class}}
Write completely in Marathi (Devanagari (Marathi)).
Use correct letter format: address, date, salutation, body, closing, signature.
Maharashtra SSC/HSC exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Marathi Letter Writer for Teachers | मराठी पत्र | Forjit AI",
    seoDesc: "Generate Marathi formal and informal letters. Free tool for Marathi teachers and students. Maharashtra SSC/HSC format.",
    seoKeywords: ["marathi letter writer free","Marathi patra lekhan tool","marathi formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Marathi letter format for Maharashtra SSC/HSC exams." },
      { q: "Is it written in Marathi?", a: "Yes. Entirely in Marathi script." },
      { q: "Is it exam ready?", a: "Yes. Follows Maharashtra SSC/HSC exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "marathi-grammar-explainer",
    name: "Marathi Grammar Explainer (मराठी व्याकरण)",
    desc: "Explain Marathi grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "marathi",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (मराठी)", type: "text", placeholder: "e.g. क्रियापद, नाम, विभक्ती" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Marathi grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Marathi and English:
1. DEFINITION / RULE (in Marathi)
2. TYPES (if any)
3. EXAMPLES (5 examples in Marathi with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. Maharashtra SSC/HSC curriculum.`,
    seoTitle: "Free Marathi Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Marathi grammar topics with rules and examples. Free tool for Marathi teachers. Maharashtra SSC/HSC aligned.",
    seoKeywords: ["marathi grammar explainer free","Marathi vyakaran tool teacher","marathi grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Marathi and English?", a: "Yes. Definition in Marathi, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Marathi grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it Maharashtra SSC/HSC aligned?", a: "Yes. Follows Maharashtra SSC/HSC grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "marathi-translation-helper",
    name: "Marathi ↔ English Translation Helper",
    desc: "Translate between Marathi and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "marathi",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Marathi or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Marathi → English","English → Marathi"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Marathi English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Marathi and English with word-by-word explanation. Free tool for Marathi teachers and students.",
    seoKeywords: ["marathi english translation free India","Marathi translator teacher tool","marathi to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Marathi to English and English to Marathi." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "marathi-mcq-maker",
    name: "Marathi Language MCQ Maker",
    desc: "Generate Marathi language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "marathi",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Marathi Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Marathi language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Marathi (Devanagari (Marathi)).
Format: Q[N]. [question in Marathi]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. Maharashtra SSC/HSC curriculum.`,
    seoTitle: "Free Marathi MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Marathi language MCQs for grammar, vocabulary, comprehension. Free tool for Marathi teachers. Maharashtra SSC/HSC aligned.",
    seoKeywords: ["marathi MCQ generator teacher India","Marathi language quiz maker free","marathi grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Marathi?", a: "Yes. All questions are in Marathi script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it Maharashtra SSC/HSC aligned?", a: "Yes. Follows Maharashtra SSC/HSC language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "bengali-essay-writer",
    name: "Bengali Essay Writer (বাংলা निबंध)",
    desc: "Write Bengali essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "bengali",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (বাংলা)", type: "text", placeholder: "e.g. আমার দেশ, পরিবেশ, দীপাবলি" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Bengali essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Bengali (Bengali script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Bengali. Appropriate for {{class}} level. WBBSE / WBCHSE curriculum.`,
    seoTitle: "Free Bengali Essay Writer for Teachers | বাংলা निबंध | Forjit AI",
    seoDesc: "Generate Bengali essays for any topic. Free tool for Bengali teachers. WBBSE / WBCHSE aligned. Class 1-12 and college.",
    seoKeywords: ["bengali essay writer free India","Bengali nibandh generator","bengali essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Bengali?", a: "Yes. Completely in Bengali (Bengali script)." },
      { q: "Which board is it aligned to?", a: "WBBSE / WBCHSE and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "bengali-letter-writer",
    name: "Bengali Letter Writer (বাংলা पत्र लेखन)",
    desc: "Generate formal and informal Bengali letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "bengali",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (বাংলা)", type: "text", placeholder: "e.g. ছুটির আবেদন, অভিযোগ পত্র" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Bengali.
Purpose: {{topic}} | Level: {{class}}
Write completely in Bengali (Bengali script).
Use correct letter format: address, date, salutation, body, closing, signature.
WBBSE / WBCHSE exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Bengali Letter Writer for Teachers | বাংলা पत्र | Forjit AI",
    seoDesc: "Generate Bengali formal and informal letters. Free tool for Bengali teachers and students. WBBSE / WBCHSE format.",
    seoKeywords: ["bengali letter writer free","Bengali patra lekhan tool","bengali formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Bengali letter format for WBBSE / WBCHSE exams." },
      { q: "Is it written in Bengali?", a: "Yes. Entirely in Bengali script." },
      { q: "Is it exam ready?", a: "Yes. Follows WBBSE / WBCHSE exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "bengali-grammar-explainer",
    name: "Bengali Grammar Explainer (বাংলা व्याकरण)",
    desc: "Explain Bengali grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "bengali",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (বাংলা)", type: "text", placeholder: "e.g. ক্রিয়া, বিশেষ্য, কারক" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Bengali grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Bengali and English:
1. DEFINITION / RULE (in Bengali)
2. TYPES (if any)
3. EXAMPLES (5 examples in Bengali with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. WBBSE / WBCHSE curriculum.`,
    seoTitle: "Free Bengali Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Bengali grammar topics with rules and examples. Free tool for Bengali teachers. WBBSE / WBCHSE aligned.",
    seoKeywords: ["bengali grammar explainer free","Bengali vyakaran tool teacher","bengali grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Bengali and English?", a: "Yes. Definition in Bengali, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Bengali grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it WBBSE / WBCHSE aligned?", a: "Yes. Follows WBBSE / WBCHSE grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "bengali-translation-helper",
    name: "Bengali ↔ English Translation Helper",
    desc: "Translate between Bengali and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "bengali",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Bengali or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Bengali → English","English → Bengali"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Bengali English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Bengali and English with word-by-word explanation. Free tool for Bengali teachers and students.",
    seoKeywords: ["bengali english translation free India","Bengali translator teacher tool","bengali to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Bengali to English and English to Bengali." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "bengali-mcq-maker",
    name: "Bengali Language MCQ Maker",
    desc: "Generate Bengali language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "bengali",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Bengali Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Bengali language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Bengali (Bengali script).
Format: Q[N]. [question in Bengali]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. WBBSE / WBCHSE curriculum.`,
    seoTitle: "Free Bengali MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Bengali language MCQs for grammar, vocabulary, comprehension. Free tool for Bengali teachers. WBBSE / WBCHSE aligned.",
    seoKeywords: ["bengali MCQ generator teacher India","Bengali language quiz maker free","bengali grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Bengali?", a: "Yes. All questions are in Bengali script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it WBBSE / WBCHSE aligned?", a: "Yes. Follows WBBSE / WBCHSE language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "gujarati-essay-writer",
    name: "Gujarati Essay Writer (ગુજરાતી निबंध)",
    desc: "Write Gujarati essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "gujarati",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (ગુજરાતી)", type: "text", placeholder: "e.g. મારો દેશ, પર્યાવરણ, દીવાળી" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Gujarati essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Gujarati (Gujarati script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Gujarati. Appropriate for {{class}} level. GSEB curriculum.`,
    seoTitle: "Free Gujarati Essay Writer for Teachers | ગુજરાતી निबंध | Forjit AI",
    seoDesc: "Generate Gujarati essays for any topic. Free tool for Gujarati teachers. GSEB aligned. Class 1-12 and college.",
    seoKeywords: ["gujarati essay writer free India","Gujarati nibandh generator","gujarati essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Gujarati?", a: "Yes. Completely in Gujarati (Gujarati script)." },
      { q: "Which board is it aligned to?", a: "GSEB and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "gujarati-letter-writer",
    name: "Gujarati Letter Writer (ગુજરાતી पत्र लेखन)",
    desc: "Generate formal and informal Gujarati letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "gujarati",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (ગુજરાતી)", type: "text", placeholder: "e.g. રજા માટે અરજી, ફરિયાદ પત્ર" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Gujarati.
Purpose: {{topic}} | Level: {{class}}
Write completely in Gujarati (Gujarati script).
Use correct letter format: address, date, salutation, body, closing, signature.
GSEB exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Gujarati Letter Writer for Teachers | ગુજરાતી पत्र | Forjit AI",
    seoDesc: "Generate Gujarati formal and informal letters. Free tool for Gujarati teachers and students. GSEB format.",
    seoKeywords: ["gujarati letter writer free","Gujarati patra lekhan tool","gujarati formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Gujarati letter format for GSEB exams." },
      { q: "Is it written in Gujarati?", a: "Yes. Entirely in Gujarati script." },
      { q: "Is it exam ready?", a: "Yes. Follows GSEB exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "gujarati-grammar-explainer",
    name: "Gujarati Grammar Explainer (ગુજરાતી व्याकरण)",
    desc: "Explain Gujarati grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "gujarati",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (ગુજરાતી)", type: "text", placeholder: "e.g. ક્રિયાપદ, નામ, વિભક્તિ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Gujarati grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Gujarati and English:
1. DEFINITION / RULE (in Gujarati)
2. TYPES (if any)
3. EXAMPLES (5 examples in Gujarati with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. GSEB curriculum.`,
    seoTitle: "Free Gujarati Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Gujarati grammar topics with rules and examples. Free tool for Gujarati teachers. GSEB aligned.",
    seoKeywords: ["gujarati grammar explainer free","Gujarati vyakaran tool teacher","gujarati grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Gujarati and English?", a: "Yes. Definition in Gujarati, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Gujarati grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it GSEB aligned?", a: "Yes. Follows GSEB grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "gujarati-translation-helper",
    name: "Gujarati ↔ English Translation Helper",
    desc: "Translate between Gujarati and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "gujarati",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Gujarati or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Gujarati → English","English → Gujarati"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Gujarati English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Gujarati and English with word-by-word explanation. Free tool for Gujarati teachers and students.",
    seoKeywords: ["gujarati english translation free India","Gujarati translator teacher tool","gujarati to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Gujarati to English and English to Gujarati." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "gujarati-mcq-maker",
    name: "Gujarati Language MCQ Maker",
    desc: "Generate Gujarati language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "gujarati",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Gujarati Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Gujarati language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Gujarati (Gujarati script).
Format: Q[N]. [question in Gujarati]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. GSEB curriculum.`,
    seoTitle: "Free Gujarati MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Gujarati language MCQs for grammar, vocabulary, comprehension. Free tool for Gujarati teachers. GSEB aligned.",
    seoKeywords: ["gujarati MCQ generator teacher India","Gujarati language quiz maker free","gujarati grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Gujarati?", a: "Yes. All questions are in Gujarati script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it GSEB aligned?", a: "Yes. Follows GSEB language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "punjabi-essay-writer",
    name: "Punjabi Essay Writer (ਪੰਜਾਬੀ निबंध)",
    desc: "Write Punjabi essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "punjabi",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (ਪੰਜਾਬੀ)", type: "text", placeholder: "e.g. ਮੇਰਾ ਦੇਸ਼, ਵਾਤਾਵਰਣ, ਦੀਵਾਲੀ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Punjabi essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Punjabi (Gurmukhi script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Punjabi. Appropriate for {{class}} level. PSEB curriculum.`,
    seoTitle: "Free Punjabi Essay Writer for Teachers | ਪੰਜਾਬੀ निबंध | Forjit AI",
    seoDesc: "Generate Punjabi essays for any topic. Free tool for Punjabi teachers. PSEB aligned. Class 1-12 and college.",
    seoKeywords: ["punjabi essay writer free India","Punjabi nibandh generator","punjabi essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Punjabi?", a: "Yes. Completely in Punjabi (Gurmukhi script)." },
      { q: "Which board is it aligned to?", a: "PSEB and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "punjabi-letter-writer",
    name: "Punjabi Letter Writer (ਪੰਜਾਬੀ पत्र लेखन)",
    desc: "Generate formal and informal Punjabi letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "punjabi",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (ਪੰਜਾਬੀ)", type: "text", placeholder: "e.g. ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ, ਸ਼ਿਕਾਇਤ ਪੱਤਰ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Punjabi.
Purpose: {{topic}} | Level: {{class}}
Write completely in Punjabi (Gurmukhi script).
Use correct letter format: address, date, salutation, body, closing, signature.
PSEB exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Punjabi Letter Writer for Teachers | ਪੰਜਾਬੀ पत्र | Forjit AI",
    seoDesc: "Generate Punjabi formal and informal letters. Free tool for Punjabi teachers and students. PSEB format.",
    seoKeywords: ["punjabi letter writer free","Punjabi patra lekhan tool","punjabi formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Punjabi letter format for PSEB exams." },
      { q: "Is it written in Punjabi?", a: "Yes. Entirely in Punjabi script." },
      { q: "Is it exam ready?", a: "Yes. Follows PSEB exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "punjabi-grammar-explainer",
    name: "Punjabi Grammar Explainer (ਪੰਜਾਬੀ व्याकरण)",
    desc: "Explain Punjabi grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "punjabi",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (ਪੰਜਾਬੀ)", type: "text", placeholder: "e.g. ਕ੍ਰਿਆ, ਨਾਂਵ, ਕਾਰਕ" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Punjabi grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Punjabi and English:
1. DEFINITION / RULE (in Punjabi)
2. TYPES (if any)
3. EXAMPLES (5 examples in Punjabi with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. PSEB curriculum.`,
    seoTitle: "Free Punjabi Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Punjabi grammar topics with rules and examples. Free tool for Punjabi teachers. PSEB aligned.",
    seoKeywords: ["punjabi grammar explainer free","Punjabi vyakaran tool teacher","punjabi grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Punjabi and English?", a: "Yes. Definition in Punjabi, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Punjabi grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it PSEB aligned?", a: "Yes. Follows PSEB grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "punjabi-translation-helper",
    name: "Punjabi ↔ English Translation Helper",
    desc: "Translate between Punjabi and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "punjabi",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Punjabi or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Punjabi → English","English → Punjabi"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Punjabi English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Punjabi and English with word-by-word explanation. Free tool for Punjabi teachers and students.",
    seoKeywords: ["punjabi english translation free India","Punjabi translator teacher tool","punjabi to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Punjabi to English and English to Punjabi." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "punjabi-mcq-maker",
    name: "Punjabi Language MCQ Maker",
    desc: "Generate Punjabi language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "punjabi",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Punjabi Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Punjabi language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Punjabi (Gurmukhi script).
Format: Q[N]. [question in Punjabi]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. PSEB curriculum.`,
    seoTitle: "Free Punjabi MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Punjabi language MCQs for grammar, vocabulary, comprehension. Free tool for Punjabi teachers. PSEB aligned.",
    seoKeywords: ["punjabi MCQ generator teacher India","Punjabi language quiz maker free","punjabi grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Punjabi?", a: "Yes. All questions are in Punjabi script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it PSEB aligned?", a: "Yes. Follows PSEB language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "odia-essay-writer",
    name: "Odia Essay Writer (ଓଡ଼ିଆ निबंध)",
    desc: "Write Odia essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "odia",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (ଓଡ଼ିଆ)", type: "text", placeholder: "e.g. ମୋ ଦେଶ, ପରିବେଶ, ଦୀପାବଳି" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Odia essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Odia (Odia script).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Odia. Appropriate for {{class}} level. BSE Odisha curriculum.`,
    seoTitle: "Free Odia Essay Writer for Teachers | ଓଡ଼ିଆ निबंध | Forjit AI",
    seoDesc: "Generate Odia essays for any topic. Free tool for Odia teachers. BSE Odisha aligned. Class 1-12 and college.",
    seoKeywords: ["odia essay writer free India","Odia nibandh generator","odia essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Odia?", a: "Yes. Completely in Odia (Odia script)." },
      { q: "Which board is it aligned to?", a: "BSE Odisha and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "odia-letter-writer",
    name: "Odia Letter Writer (ଓଡ଼ିଆ पत्र लेखन)",
    desc: "Generate formal and informal Odia letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "odia",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (ଓଡ଼ିଆ)", type: "text", placeholder: "e.g. ଛୁଟି ଆବେଦନ, ଅଭିଯୋଗ ପତ୍ର" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Odia.
Purpose: {{topic}} | Level: {{class}}
Write completely in Odia (Odia script).
Use correct letter format: address, date, salutation, body, closing, signature.
BSE Odisha exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Odia Letter Writer for Teachers | ଓଡ଼ିଆ पत्र | Forjit AI",
    seoDesc: "Generate Odia formal and informal letters. Free tool for Odia teachers and students. BSE Odisha format.",
    seoKeywords: ["odia letter writer free","Odia patra lekhan tool","odia formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Odia letter format for BSE Odisha exams." },
      { q: "Is it written in Odia?", a: "Yes. Entirely in Odia script." },
      { q: "Is it exam ready?", a: "Yes. Follows BSE Odisha exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "odia-grammar-explainer",
    name: "Odia Grammar Explainer (ଓଡ଼ିଆ व्याकरण)",
    desc: "Explain Odia grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "odia",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (ଓଡ଼ିଆ)", type: "text", placeholder: "e.g. ক্রিয়া, নাম, বিভক্তি" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Odia grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Odia and English:
1. DEFINITION / RULE (in Odia)
2. TYPES (if any)
3. EXAMPLES (5 examples in Odia with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. BSE Odisha curriculum.`,
    seoTitle: "Free Odia Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Odia grammar topics with rules and examples. Free tool for Odia teachers. BSE Odisha aligned.",
    seoKeywords: ["odia grammar explainer free","Odia vyakaran tool teacher","odia grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Odia and English?", a: "Yes. Definition in Odia, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Odia grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it BSE Odisha aligned?", a: "Yes. Follows BSE Odisha grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "odia-translation-helper",
    name: "Odia ↔ English Translation Helper",
    desc: "Translate between Odia and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "odia",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Odia or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Odia → English","English → Odia"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Odia English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Odia and English with word-by-word explanation. Free tool for Odia teachers and students.",
    seoKeywords: ["odia english translation free India","Odia translator teacher tool","odia to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Odia to English and English to Odia." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "odia-mcq-maker",
    name: "Odia Language MCQ Maker",
    desc: "Generate Odia language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "odia",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Odia Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Odia language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Odia (Odia script).
Format: Q[N]. [question in Odia]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. BSE Odisha curriculum.`,
    seoTitle: "Free Odia MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Odia language MCQs for grammar, vocabulary, comprehension. Free tool for Odia teachers. BSE Odisha aligned.",
    seoKeywords: ["odia MCQ generator teacher India","Odia language quiz maker free","odia grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Odia?", a: "Yes. All questions are in Odia script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it BSE Odisha aligned?", a: "Yes. Follows BSE Odisha language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "urdu-essay-writer",
    name: "Urdu Essay Writer (اردو निबंध)",
    desc: "Write Urdu essays on any topic for school and college students.",
    icon: "✍️", category: "language", subCategory: "urdu",
    audience: "teacher", model: "smart", maxTokens: 600,
    inputs: [
      { id: "topic", label: "Essay Topic (اردو)", type: "text", placeholder: "e.g. میرا وطن, ماحولیات, عید" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] }
    ],
    promptTemplate: `Write a complete Urdu essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in Urdu (Nastaliq (Urdu script)).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct Urdu. Appropriate for {{class}} level. JKBOSE / UPMSP / CBSE Urdu curriculum.`,
    seoTitle: "Free Urdu Essay Writer for Teachers | اردو निबंध | Forjit AI",
    seoDesc: "Generate Urdu essays for any topic. Free tool for Urdu teachers. JKBOSE / UPMSP / CBSE Urdu aligned. Class 1-12 and college.",
    seoKeywords: ["urdu essay writer free India","Urdu nibandh generator","urdu essay maker teacher"],
    faqs: [
      { q: "Is the essay written in Urdu?", a: "Yes. Completely in Urdu (Nastaliq (Urdu script))." },
      { q: "Which board is it aligned to?", a: "JKBOSE / UPMSP / CBSE Urdu and national curriculum." },
      { q: "Can I set the word count?", a: "Yes. 100 to 500 words." },
      { q: "Is it useful for all classes?", a: "Yes. Class 1 to PhD level." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.86,
  },
  {
    id: "urdu-letter-writer",
    name: "Urdu Letter Writer (اردو पत्र लेखन)",
    desc: "Generate formal and informal Urdu letters for students and teachers.",
    icon: "📮", category: "language", subCategory: "urdu",
    audience: "teacher", model: "fast", maxTokens: 450,
    inputs: [
      { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
      { id: "topic", label: "Purpose (اردو)", type: "text", placeholder: "e.g. چھٹی کی درخواست, شکایتی خط" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Write a {{type}} in Urdu.
Purpose: {{topic}} | Level: {{class}}
Write completely in Urdu (Nastaliq (Urdu script)).
Use correct letter format: address, date, salutation, body, closing, signature.
JKBOSE / UPMSP / CBSE Urdu exam format. Appropriate language for {{class}} level.`,
    seoTitle: "Free Urdu Letter Writer for Teachers | اردو पत्र | Forjit AI",
    seoDesc: "Generate Urdu formal and informal letters. Free tool for Urdu teachers and students. JKBOSE / UPMSP / CBSE Urdu format.",
    seoKeywords: ["urdu letter writer free","Urdu patra lekhan tool","urdu formal letter generator India"],
    faqs: [
      { q: "What letter types are available?", a: "Formal, informal, application, complaint, and invitation letters." },
      { q: "Is the format correct?", a: "Yes. Correct Urdu letter format for JKBOSE / UPMSP / CBSE Urdu exams." },
      { q: "Is it written in Urdu?", a: "Yes. Entirely in Urdu script." },
      { q: "Is it exam ready?", a: "Yes. Follows JKBOSE / UPMSP / CBSE Urdu exam pattern." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.85,
  },
  {
    id: "urdu-grammar-explainer",
    name: "Urdu Grammar Explainer (اردو व्याकरण)",
    desc: "Explain Urdu grammar topics with rules, examples, and exercises.",
    icon: "📖", category: "language", subCategory: "urdu",
    audience: "teacher", model: "smart", maxTokens: 500,
    inputs: [
      { id: "topic", label: "Grammar Topic (اردو)", type: "text", placeholder: "e.g. فعل, اسم, ضمیر" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Explain this Urdu grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH Urdu and English:
1. DEFINITION / RULE (in Urdu)
2. TYPES (if any)
3. EXAMPLES (5 examples in Urdu with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. JKBOSE / UPMSP / CBSE Urdu curriculum.`,
    seoTitle: "Free Urdu Grammar Explainer for Teachers | Forjit AI",
    seoDesc: "Explain Urdu grammar topics with rules and examples. Free tool for Urdu teachers. JKBOSE / UPMSP / CBSE Urdu aligned.",
    seoKeywords: ["urdu grammar explainer free","Urdu vyakaran tool teacher","urdu grammar rules examples India"],
    faqs: [
      { q: "Is explanation in both Urdu and English?", a: "Yes. Definition in Urdu, with English meanings for examples." },
      { q: "Are exercises included?", a: "Yes. 5 practice exercises are included." },
      { q: "What grammar topics are covered?", a: "All Urdu grammar topics — parts of speech, tenses, sentence types, and more." },
      { q: "Is it JKBOSE / UPMSP / CBSE Urdu aligned?", a: "Yes. Follows JKBOSE / UPMSP / CBSE Urdu grammar curriculum." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.84,
  },
  {
    id: "urdu-translation-helper",
    name: "Urdu ↔ English Translation Helper",
    desc: "Translate between Urdu and English with explanations for teachers and students.",
    icon: "🔄", category: "language", subCategory: "urdu",
    audience: "teacher", model: "fast", maxTokens: 400,
    inputs: [
      { id: "text", label: "Text to Translate", type: "textarea", placeholder: "Type in Urdu or English…", rows: 3 },
      { id: "direction", label: "Direction", type: "select", options: ["Urdu → English","English → Urdu"] },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] }
    ],
    promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
    seoTitle: "Free Urdu English Translation Helper for Teachers | Forjit AI",
    seoDesc: "Translate between Urdu and English with word-by-word explanation. Free tool for Urdu teachers and students.",
    seoKeywords: ["urdu english translation free India","Urdu translator teacher tool","urdu to english translator"],
    faqs: [
      { q: "Does it work both ways?", a: "Yes. Urdu to English and English to Urdu." },
      { q: "Is word-by-word breakdown included?", a: "Yes. Key words are explained individually." },
      { q: "Is cultural context explained?", a: "Yes. Idioms and cultural notes are included where relevant." },
      { q: "Is it suitable for all levels?", a: "Yes. From Class 1 to PhD level translations." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
  {
    id: "urdu-mcq-maker",
    name: "Urdu Language MCQ Maker",
    desc: "Generate Urdu language MCQs for grammar, comprehension, and vocabulary.",
    icon: "✅", category: "language", subCategory: "urdu",
    audience: "teacher", model: "smart", maxTokens: 550,
    inputs: [
      { id: "topic", label: "Urdu Topic", type: "text", placeholder: "e.g. Grammar, Vocabulary, Comprehension, Literature" },
      { id: "class", label: "Class / Level", type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Diploma / Certificate","ITI / Vocational","UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)","B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE","B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch","B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)","PG Year 1","PG Year 2","M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME","M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design","M.Sc Nursing","MHMCT","M.Phil","PhD / Doctorate","Post-Doctoral","UPSC / Competitive Exams","Professional Training"] },
      { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] }
    ],
    promptTemplate: `Generate {{count}} Urdu language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in Urdu (Nastaliq (Urdu script)).
Format: Q[N]. [question in Urdu]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. JKBOSE / UPMSP / CBSE Urdu curriculum.`,
    seoTitle: "Free Urdu MCQ Maker for Teachers | Forjit AI",
    seoDesc: "Generate Urdu language MCQs for grammar, vocabulary, comprehension. Free tool for Urdu teachers. JKBOSE / UPMSP / CBSE Urdu aligned.",
    seoKeywords: ["urdu MCQ generator teacher India","Urdu language quiz maker free","urdu grammar MCQ CBSE"],
    faqs: [
      { q: "Are questions written in Urdu?", a: "Yes. All questions are in Urdu script." },
      { q: "What topics are covered?", a: "Grammar, vocabulary, comprehension, and literature." },
      { q: "Is it JKBOSE / UPMSP / CBSE Urdu aligned?", a: "Yes. Follows JKBOSE / UPMSP / CBSE Urdu language curriculum." },
      { q: "How many MCQs can I generate?", a: "5 to 20 MCQs per session." },
      { q: "Is it free?", a: "Completely free." }
    ],
    priority: 0.83,
  },
];
