export interface SimulationMessage {
  id: string;
  speaker: "learner" | "persona";
  text: string;
}

export interface SimulationPrompt {
  id: string;
  text: string;
  response: string;
  feedback?: string;
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  persona: {
    name: string;
    role: string;
    company: string;
  };
  prompts: SimulationPrompt[];
}

export const ACADEMY_SIMULATIONS: Record<string, Simulation> = {
  "discovery-basics": {
    id: "discovery-basics",
    title: "Discovery Call Simulation",
    description:
      "Practice the VOS Discovery framework with a mock VP of Sales. Ask the right questions to uncover pain and quantify impact.",
    persona: {
      name: "Sarah Chen",
      role: "VP of Sales",
      company: "TechCorp Inc.",
    },
    prompts: [
      {
        id: "intro",
        text: "Hi Sarah, thanks for taking the time. To start, what KPIs does your role own?",
        response:
          "Thanks for asking! I'm primarily measured on pipeline generation, win rate, and average deal size. Right now we're hitting about 18% win rate and $85K average deal size.",
        feedback:
          "Great start! You anchored the conversation in role-owned KPIs. Now dig into current state vs. benchmark.",
      },
      {
        id: "baseline",
        text: "18% win rate—how does that compare to your industry benchmark or internal goals?",
        response:
          "Industry benchmark is around 25% for our segment. We're definitely underperforming. Our CEO wants us at 22% by end of year.",
        feedback:
          "Excellent! You've quantified the gap (18% → 22-25%). Now explore what's preventing progress.",
      },
      {
        id: "blockers",
        text: "What's preventing you from hitting that 22-25% win rate?",
        response:
          "Honestly, our proposals are too generic. Reps don't have time to customize them, so prospects see the same deck everyone else gets. We lose on differentiation.",
        feedback:
          "Perfect discovery question! You've uncovered a pain (generic proposals) tied to the KPI (win rate). Now quantify the impact.",
      },
      {
        id: "impact",
        text: "If you could move from 18% to 22% win rate, what would that mean in revenue terms?",
        response:
          "We have about $50M in pipeline per quarter. A 4-point lift in win rate would be an extra $2M per quarter, or $8M annually. That's significant.",
        feedback:
          "Excellent! You've built a value hypothesis: Generic proposals → 18% win rate → $8M revenue gap. This is the foundation of a VOS business case.",
      },
      {
        id: "validation",
        text: "Who else is impacted by this problem, and how would they measure success?",
        response:
          "Our sales ops team spends a ton of time trying to templatize proposals, but they can't keep up. And our CFO cares about forecast accuracy—generic proposals make it hard to predict which deals will close.",
        feedback:
          "Great! You've identified cross-functional impact (Sales Ops, CFO) and additional KPIs (forecast accuracy). This strengthens the business case.",
      },
    ],
  },
};
