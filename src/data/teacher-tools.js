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
  "cross-subject": { label: "All Teachers",       emoji: "🏫", color: "amber"  },
  "science":       { label: "Science",             emoji: "🔬", color: "blue"   },
  "maths":         { label: "Mathematics",         emoji: "📐", color: "purple" },
  "language":      { label: "Languages",           emoji: "📝", color: "green"  },
  "social-science":{ label: "Social Science",      emoji: "🌍", color: "teal"   },
  "computer":      { label: "Computer Science",    emoji: "💻", color: "indigo" },
  "higher-ed":     { label: "Higher Education",    emoji: "🎓", color: "rose"   },
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
      { id: "class",    label: "Class",    type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","College"] },
      { id: "board",    label: "Board",    type: "select", options: ["CBSE","ICSE","State Board","IB"] },
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
      { id: "class",      label: "Class",             type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",    label: "Class",            type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",        label: "Class",            type: "select", options: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",   label: "Class",   type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",    label: "Class",            type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",    label: "Class",         type: "select", options: ["Class 8","Class 9","Class 10","Class 11","Class 12"] },
      { id: "board",    label: "Board",         type: "select", options: ["CBSE","ICSE","State Board"] },
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
      { id: "class",       label: "Class",            type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10"] },
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
      { id: "class",      label: "Class",        type: "select", options: ["Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",     label: "कक्षा (Class)",          type: "select", options: ["Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",      label: "कक्षा (Class)",            type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "class",      label: "Class",             type: "select", options: ["Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"] },
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
      { id: "class",   label: "Class",                    type: "select", options: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"] },
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
      { id: "level",   label: "Level",         type: "select", options: ["UG First Year","UG Second Year","UG Third Year","PG Level"] },
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

];
