export interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export const ACADEMY_QUIZZES: Record<string, Quiz> = {
  "outcome-economics-basics": {
    id: "outcome-economics-basics",
    title: "Outcome Economics Fundamentals",
    description: "Test your understanding of the Value Triad and outcome-based thinking.",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        text: "Which of the following is NOT part of the Value Triad?",
        options: [
          { id: "a", text: "Revenue Impact" },
          { id: "b", text: "Cost Reduction" },
          { id: "c", text: "Risk Mitigation" },
          { id: "d", text: "Feature Adoption" },
        ],
        correctAnswer: "d",
        explanation:
          "The Value Triad consists of Revenue, Cost, and Risk. Feature adoption is a means to an end, not an outcome itself.",
      },
      {
        id: "q2",
        text: "A customer says 'We need better reporting.' Which question best translates this to outcome language?",
        options: [
          { id: "a", text: "What reporting features do you need?" },
          { id: "b", text: "What decision are you trying to make faster or better with that data?" },
          { id: "c", text: "How many reports do you run per week?" },
          { id: "d", text: "What tools do you currently use?" },
        ],
        correctAnswer: "b",
        explanation:
          "Outcome-focused questions dig into the business impact (faster decisions, better outcomes) rather than features or current state alone.",
      },
      {
        id: "q3",
        text: "When building a conservative ROI model, you should:",
        options: [
          { id: "a", text: "Use the customer's most optimistic estimates" },
          { id: "b", text: "Apply industry benchmarks and assume lower-end ranges" },
          { id: "c", text: "Ignore risk factors to simplify the model" },
          { id: "d", text: "Focus only on revenue impact" },
        ],
        correctAnswer: "b",
        explanation:
          "Conservative modeling uses benchmarks and lower-end assumptions to build credibility and avoid over-promising.",
      },
      {
        id: "q4",
        text: "Which KPI is most likely owned by a Sales role?",
        options: [
          { id: "a", text: "Customer Onboarding Time" },
          { id: "b", text: "Lead Conversion Rate" },
          { id: "c", text: "Support Ticket Volume" },
          { id: "d", text: "Product Feature Usage" },
        ],
        correctAnswer: "b",
        explanation:
          "Lead Conversion Rate is a core sales metric. Onboarding is CS, support tickets are CS/Support, and feature usage is Product.",
      },
      {
        id: "q5",
        text: "A customer mentions 'compliance risk.' This maps to which part of the Value Triad?",
        options: [
          { id: "a", text: "Revenue Impact" },
          { id: "b", text: "Cost Reduction" },
          { id: "c", text: "Risk Mitigation" },
          { id: "d", text: "None of the above" },
        ],
        correctAnswer: "c",
        explanation:
          "Compliance risk is a form of Risk Mitigation. Quantifying potential fines or audit costs makes this tangible.",
      },
    ],
  },
  "kpi-modeling-basics": {
    id: "kpi-modeling-basics",
    title: "KPI Modeling Fundamentals",
    description: "Validate your ability to identify, quantify, and model KPIs.",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        text: "What makes a KPI 'good' in VOS terms?",
        options: [
          { id: "a", text: "It's easy to measure" },
          { id: "b", text: "It's owned by a specific role and tied to business outcomes" },
          { id: "c", text: "It has a large number" },
          { id: "d", text: "It's mentioned in the product roadmap" },
        ],
        correctAnswer: "b",
        explanation:
          "A good KPI is role-owned, measurable, outcome-tied, and trackable over time.",
      },
      {
        id: "q2",
        text: "Industry benchmark for Lead Conversion Rate is typically:",
        options: [
          { id: "a", text: "5-10%" },
          { id: "b", text: "15-25%" },
          { id: "c", text: "40-50%" },
          { id: "d", text: "60-70%" },
        ],
        correctAnswer: "b",
        explanation:
          "VOS uses 15-25% as a conservative benchmark for B2B lead conversion rates.",
      },
      {
        id: "q3",
        text: "When a customer says 'We spend too much time on manual tasks,' your first question should be:",
        options: [
          { id: "a", text: "What tools do you use today?" },
          { id: "b", text: "How many hours per week does this consume?" },
          { id: "c", text: "Can you show me your current process?" },
          { id: "d", text: "What would you do with that time instead?" },
        ],
        correctAnswer: "b",
        explanation:
          "Quantifying the baseline (hours/week) is the first step to building a cost reduction model.",
      },
    ],
  },
  "discovery-framework-basics": {
    id: "discovery-framework-basics",
    title: "Discovery Framework Quiz",
    description: "Test your mastery of the VOS Discovery Map.",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        text: "The first question in VOS Discovery is:",
        options: [
          { id: "a", text: "What features do you need?" },
          { id: "b", text: "What KPIs does your role own?" },
          { id: "c", text: "What's your budget?" },
          { id: "d", text: "Who are your competitors?" },
        ],
        correctAnswer: "b",
        explanation:
          "Starting with role-owned KPIs anchors the conversation in outcomes from the start.",
      },
      {
        id: "q2",
        text: "A customer says 'Our sales cycle is too long.' What's your next question?",
        options: [
          { id: "a", text: "How long is it currently, and what's the benchmark for your industry?" },
          { id: "b", text: "What CRM do you use?" },
          { id: "c", text: "How many reps do you have?" },
          { id: "d", text: "What's your close rate?" },
        ],
        correctAnswer: "a",
        explanation:
          "Quantifying current state and comparing to benchmarks builds the baseline for a value hypothesis.",
      },
      {
        id: "q3",
        text: "Discovery should result in:",
        options: [
          { id: "a", text: "A list of required features" },
          { id: "b", text: "A quantified pain → KPI → value hypothesis" },
          { id: "c", text: "A product demo" },
          { id: "d", text: "A pricing proposal" },
        ],
        correctAnswer: "b",
        explanation:
          "The output of discovery is a testable value hypothesis grounded in quantified pain and KPIs.",
      },
    ],
  },
  "pain-to-value-basics": {
    id: "pain-to-value-basics",
    title: "Pain to Value Mapping",
    description: "Validate your ability to translate pain into value hypotheses.",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        text: "A customer says 'We lose deals because our proposals are generic.' This pain maps to:",
        options: [
          { id: "a", text: "Revenue (win rate improvement)" },
          { id: "b", text: "Cost (proposal creation time)" },
          { id: "c", text: "Risk (compliance)" },
          { id: "d", text: "None of the above" },
        ],
        correctAnswer: "a",
        explanation:
          "Generic proposals → lower win rate → lost revenue. This is a Revenue impact pain.",
      },
      {
        id: "q2",
        text: "The Pain → Value chain is:",
        options: [
          { id: "a", text: "Pain → Feature → Adoption" },
          { id: "b", text: "Pain → KPI → Value Hypothesis" },
          { id: "c", text: "Pain → Demo → Close" },
          { id: "d", text: "Pain → Price → ROI" },
        ],
        correctAnswer: "b",
        explanation:
          "VOS maps pain to a measurable KPI, then builds a quantified value hypothesis.",
      },
    ],
  },
};
