import type { AcademyLesson } from "../types/schema";

export const ACADEMY_LESSONS: Record<string, AcademyLesson> = {
  "pillar-1-outcome-economics-intro": {
    id: "pillar-1-outcome-economics-intro",
    title: "Outcome Economics: The Value Triad",
    summary: "Learn the foundation of VOS: Revenue, Cost, and Risk outcomes.",
    targetRoles: ["All"],
    minMaturity: 1,
    estimatedMinutes: 15,
    blocks: [
      {
        id: "intro-text",
        type: "text",
        title: "Why Outcome Economics?",
        body:
          "Outcome economics is the discipline of quantifying impact across revenue, cost, and risk. In VOS, every value story is anchored in this triad.\n\nThe Value Triad ensures that every customer conversation is grounded in measurable business outcomes rather than features or capabilities.",
      },
      {
        id: "video-overview",
        type: "video",
        title: "Video: The Value Triad",
        url: "https://example.com/videos/value-triad-intro.mp4",
        description:
          "A short overview of how the Revenue / Cost / Risk triad shows up in typical VOS customer stories.",
      },
      {
        id: "roi-cheatsheet",
        type: "download",
        title: "KPI & ROI Cheatsheet",
        description: "Reference sheet for common VOS KPIs and value levers.",
        url: "/assets/demo/kpi-roi-cheatsheet.pdf",
      },
      {
        id: "quiz-checkpoint",
        type: "quiz",
        title: "Checkpoint Quiz: Outcome Economics",
        quizId: "outcome-economics-basics",
      },
    ],
  },
  "pillar-1-kpi-modeling": {
    id: "pillar-1-kpi-modeling",
    title: "KPI Modeling & Benchmarks",
    summary:
      "Master the art of identifying, quantifying, and modeling KPIs with conservative assumptions and industry benchmarks.",
    targetRoles: ["All"],
    minMaturity: 1,
    estimatedMinutes: 20,
    blocks: [
      {
        id: "kpi-intro",
        type: "text",
        title: "What Makes a Good KPI?",
        body:
          "A good KPI is:\n• Measurable (has a number)\n• Owned by a specific role\n• Tied to business outcomes\n• Trackable over time\n\nExamples:\n- Lead Conversion Rate: 15-25% (Sales)\n- Customer Onboarding Time: 20-35 days (CS)\n- Manual Hours per Process: 10-40 hrs/week (Operations)",
      },
      {
        id: "benchmark-video",
        type: "video",
        title: "Video: Using Industry Benchmarks",
        url: "https://example.com/videos/kpi-benchmarks.mp4",
        description: "How to apply conservative benchmarks in your value models.",
      },
      {
        id: "kpi-template",
        type: "download",
        title: "KPI Definition Template",
        description: "Excel template for documenting KPIs with formulas and baselines.",
        url: "/assets/demo/kpi-template.xlsx",
      },
      {
        id: "kpi-quiz",
        type: "quiz",
        title: "KPI Modeling Quiz",
        quizId: "kpi-modeling-basics",
      },
    ],
  },
  "pillar-2-discovery-intro": {
    id: "pillar-2-discovery-intro",
    title: "Discovery Excellence",
    summary: "Learn the VOS Discovery framework to uncover pain and quantify value.",
    targetRoles: ["All"],
    minMaturity: 2,
    estimatedMinutes: 25,
    blocks: [
      {
        id: "discovery-intro",
        type: "text",
        title: "Why Discovery Matters",
        body:
          "Discovery is where value stories begin. The VOS Discovery Map ensures you:\n\n1. Identify the customer's KPIs and current state\n2. Quantify pain points with baseline metrics\n3. Map pain to Revenue, Cost, or Risk impact\n4. Build a testable value hypothesis\n\nWithout structured discovery, you're guessing at value.",
      },
      {
        id: "discovery-framework",
        type: "text",
        title: "The VOS Discovery Questions",
        body:
          "Core questions to ask in every discovery:\n\n• What KPIs does your role own?\n• How are those measured today?\n• What prevents progress on those KPIs?\n• What would measurable improvement look like?\n• Who else is impacted by this problem?\n\nThese questions anchor every conversation in outcomes, not features.",
      },
      {
        id: "discovery-video",
        type: "video",
        title: "Video: Discovery in Action",
        url: "https://example.com/videos/discovery-demo.mp4",
        description: "Watch a real discovery call using the VOS framework.",
      },
      {
        id: "ai-coach-practice",
        type: "ai-coach",
        title: "AI Coach: Practice Discovery Questions",
        description: "Get real-time AI feedback on your discovery questions and learn to ask better questions that uncover value.",
      },
      {
        id: "discovery-simulation",
        type: "simulation",
        title: "Practice: Discovery Roleplay",
        simulationId: "discovery-basics",
      },
      {
        id: "discovery-quiz",
        type: "quiz",
        title: "Discovery Framework Quiz",
        quizId: "discovery-framework-basics",
      },
    ],
  },
  "pillar-2-pain-to-value": {
    id: "pillar-2-pain-to-value",
    title: "Pain to Value Hypotheses",
    summary: "Translate customer pain into quantified value hypotheses for Sales conversations.",
    targetRoles: ["Sales", "CS"],
    minMaturity: 2,
    estimatedMinutes: 18,
    blocks: [
      {
        id: "pain-mapping",
        type: "text",
        title: "The Pain → Value Chain",
        body:
          "Every pain point can be mapped to value:\n\nPain: 'Our sales team wastes time on unqualified leads'\n↓\nKPI: Lead Conversion Rate (currently 12%, benchmark 20%)\n↓\nValue Hypothesis: Improving conversion by 8% = $2M additional revenue\n\nThis chain makes pain tangible and quantifiable.",
      },
      {
        id: "hypothesis-template",
        type: "download",
        title: "Value Hypothesis Template",
        description: "Framework for documenting pain-to-value mappings.",
        url: "/assets/demo/value-hypothesis-template.pdf",
      },
      {
        id: "ai-coach-value-hypothesis",
        type: "ai-coach",
        title: "AI Coach: Build Your Value Hypothesis",
        description: "Practice translating customer pain into quantified value hypotheses with AI guidance.",
      },
      {
        id: "pain-quiz",
        type: "quiz",
        title: "Pain Mapping Quiz",
        quizId: "pain-to-value-basics",
      },
    ],
  },

  // Advanced VE-specific lesson (Level 3)
  "pillar-1-advanced-modeling": {
    id: "pillar-1-advanced-modeling",
    title: "Advanced ROI Modeling for Value Engineers",
    summary: "Deep dive into multi-variable ROI models, sensitivity analysis, and executive-ready business cases.",
    targetRoles: ["VE", "Executive"],
    minMaturity: 3,
    estimatedMinutes: 45,
    blocks: [
      {
        id: "intro",
        type: "text",
        title: "Advanced Modeling Techniques",
        body: `As a Value Engineer or Executive stakeholder, you need to build credible, defensible business cases that withstand CFO scrutiny.

**This lesson covers:**
- Multi-variable ROI modeling
- Sensitivity analysis and risk weighting
- Conservative vs. aggressive scenarios
- Executive presentation frameworks`,
      },
      {
        id: "video",
        type: "video",
        title: "Building Executive-Ready Business Cases",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Watch how to structure a business case for C-level approval",
      },
      {
        id: "modeling-framework",
        type: "text",
        title: "The VOS Modeling Framework",
        body: `**Step 1: Identify All Value Drivers**
- Revenue impact (win rate, deal size, velocity)
- Cost reduction (time savings, headcount avoidance)
- Risk mitigation (compliance, security, downtime)

**Step 2: Quantify Each Driver**
- Baseline metrics (current state)
- Target metrics (future state with solution)
- Improvement delta (% or absolute)

**Step 3: Apply Conservative Assumptions**
- Use industry benchmarks, not customer aspirations
- Discount by 20-30% for risk
- Model 3 scenarios: Conservative, Realistic, Optimistic

**Step 4: Build Sensitivity Analysis**
- What if adoption is only 50%?
- What if time-to-value is 6 months instead of 3?
- Which variables have the highest impact?`,
      },
      {
        id: "ai-coach-roi-modeling",
        type: "ai-coach",
        title: "AI Coach: Advanced ROI Modeling",
        description: "Get expert feedback on your ROI models and learn to build executive-ready business cases.",
      },
    ],
  },

  // CS-specific lesson (Level 2)
  "pillar-3-cs-value-realization": {
    id: "pillar-3-cs-value-realization",
    title: "Value Realization for Customer Success",
    summary: "Track, measure, and communicate value delivery to drive retention and expansion.",
    targetRoles: ["CS"],
    minMaturity: 2,
    estimatedMinutes: 30,
    blocks: [
      {
        id: "intro",
        type: "text",
        title: "From Promise to Proof",
        body: `Customer Success owns the hardest part of VOS: **proving the value was delivered**.

Sales makes the promise. CS delivers the proof.

**Your role:**
- Track KPI progress against baseline
- Quantify realized value (not just usage)
- Build QBRs around outcomes, not features
- Identify expansion opportunities based on incremental value`,
      },
      {
        id: "tracking",
        type: "text",
        title: "The Value Tracking Framework",
        body: `**1. Baseline Capture (Week 1)**
- Document pre-solution KPIs
- Get customer sign-off on metrics
- Set success criteria

**2. Milestone Check-ins (Monthly)**
- Measure KPI movement
- Calculate partial value realized
- Identify blockers to full adoption

**3. Value Realization Report (Quarterly)**
- Total value delivered to date
- ROI vs. original business case
- Expansion opportunities based on new pain points

**Example:**
- Baseline: 18% win rate, $50M pipeline
- Current: 21% win rate, $55M pipeline
- Value realized: $1.65M incremental revenue (3% × $55M)`,
      },
    ],
  },

  // Marketing-specific lesson (Level 2)
  "pillar-4-marketing-value-messaging": {
    id: "pillar-4-marketing-value-messaging",
    title: "Value-Based Messaging for Marketing",
    summary: "Craft campaigns and content that speak to outcomes, not features.",
    targetRoles: ["Marketing"],
    minMaturity: 2,
    estimatedMinutes: 25,
    blocks: [
      {
        id: "intro",
        type: "text",
        title: "From Features to Outcomes",
        body: `Marketing's job is to make the buyer **feel the pain** and **see the outcome** before they ever talk to Sales.

**Bad messaging:** "Our platform has AI-powered analytics"
**Good messaging:** "Reduce forecast error by 40% with predictive pipeline analytics"

The difference? The second one speaks to a KPI (forecast accuracy) and quantifies the impact.`,
      },
      {
        id: "framework",
        type: "text",
        title: "The Outcome Messaging Framework",
        body: `**Step 1: Identify the Persona's Top 3 KPIs**
- Sales VP: Win rate, deal size, sales cycle length
- CFO: Operating margin, cash flow, risk exposure

**Step 2: Map Your Solution to KPI Movement**
- "Increase win rate by 15-25%"
- "Reduce sales cycle by 30 days"
- "Cut manual reporting time by 10 hours/week"

**Step 3: Validate with Customer Proof Points**
- "TechCorp increased win rate from 18% to 24% in 6 months"
- Use real numbers, not vague claims

**Step 4: Test and Iterate**
- A/B test outcome-based vs. feature-based messaging
- Measure conversion lift`,
      },
    ],
  },
};
