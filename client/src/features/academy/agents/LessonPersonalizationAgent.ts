import { BaseAgent } from "./BaseAgent";
import {
  LessonPersonalizationOutputSchema,
  type LessonPersonalizationOutput,
  type AgentConfig,
  type AgentContext,
  type AgentSessionState,
} from "./types";

/**
 * LessonPersonalizationAgent - RAG-Based Learning Path Recommendation
 * 
 * Analyzes user profile, progress, and goals to recommend personalized
 * learning paths through the VOS Academy curriculum.
 * 
 * Uses context retrieval (not context dumping) to optimize token usage.
 */
export class LessonPersonalizationAgent extends BaseAgent<LessonPersonalizationOutput> {
  constructor(config?: Partial<AgentConfig>) {
    const defaultConfig: AgentConfig = {
      model: "gpt-4",
      temperature: 0.3, // Lower temperature for more consistent recommendations
      maxTokens: 800,
      systemPrompt: `You are a VOS Learning Path Advisor. Your role is to recommend personalized learning paths based on:

1. User's current role (Sales, CS, Marketing, Product, Executive, VE)
2. Current maturity level (0-5)
3. Completed lessons and quiz scores
4. Career goals and focus areas

VOS Academy Structure:
- 6 Roles × 6 Maturity Levels = 36 possible learning paths
- 10 Pillars covering the full VOS methodology
- Lessons can target specific roles or "All"

Recommendation Strategy:
- Prioritize lessons at current maturity level
- Show "next level" preview for motivation
- Balance role-specific and cross-functional content
- Identify skill gaps based on quiz performance`,
    };

    super({ ...defaultConfig, ...config }, LessonPersonalizationOutputSchema);
  }

  async execute(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): Promise<LessonPersonalizationOutput> {
    const sanitizedInput = this.sanitizeInput(input);
    const prompt = this.buildPrompt(sanitizedInput, context, sessionState);
    const rawResponse = await this.callLLM(prompt);
    const parsedResponse = await this.parseLLMResponseWithRetry(rawResponse);

    return parsedResponse;
  }

  protected buildPrompt(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): string {
    const { role, maturityLevel, completedLessons } = context.userProfile;

    return `${this.config.systemPrompt}

USER PROFILE:
- Role: ${role}
- Maturity Level: ${maturityLevel}
- Completed Lessons: ${completedLessons.length} (${completedLessons.join(", ")})

USER REQUEST:
"${input}"

AVAILABLE LESSONS (Context-Optimized Sample):
${this.buildLessonContext(context)}

Recommend a personalized learning path in the following JSON format:
{
  "recommendedLessons": [
    {
      "lessonId": "pillar-1-outcome-economics-intro",
      "relevanceScore": 95,
      "reasoning": "Foundational for all roles, addresses gap in outcome thinking"
    }
  ],
  "learningPath": ["lesson-id-1", "lesson-id-2", "lesson-id-3"],
  "focusAreas": ["Discovery Excellence", "KPI Modeling", "Business Case Development"]
}

Respond ONLY with valid JSON, no additional text.`;
  }

  /**
   * Build optimized lesson context (RAG-style retrieval)
   * In production, this would query a vector DB for relevant lessons
   */
  private buildLessonContext(context: AgentContext): string {
    // Mock: In production, use embeddings to retrieve top-K relevant lessons
    const mockLessons = [
      {
        id: "pillar-1-outcome-economics-intro",
        title: "Outcome Economics: The Value Triad",
        targetRoles: ["All"],
        minMaturity: 1,
      },
      {
        id: "pillar-2-discovery-intro",
        title: "Discovery Excellence",
        targetRoles: ["All"],
        minMaturity: 2,
      },
      {
        id: "pillar-1-advanced-modeling",
        title: "Advanced ROI Modeling",
        targetRoles: ["VE", "Executive"],
        minMaturity: 3,
      },
    ];

    return mockLessons
      .map(
        (lesson) =>
          `- ${lesson.id}: "${lesson.title}" (Roles: ${lesson.targetRoles.join(", ")}, Level: ${lesson.minMaturity})`
      )
      .join("\n");
  }
}

/**
 * Factory function
 */
export function createLessonPersonalizationAgent(
  config?: Partial<AgentConfig>
): LessonPersonalizationAgent {
  return new LessonPersonalizationAgent(config);
}
