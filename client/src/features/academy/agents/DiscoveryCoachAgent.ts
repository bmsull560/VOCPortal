import { BaseAgent } from "./BaseAgent";
import {
  DiscoveryCoachOutputSchema,
  type DiscoveryCoachOutput,
  type AgentConfig,
  type AgentContext,
  type AgentSessionState,
} from "./types";

/**
 * DiscoveryCoachAgent - AI-Powered Discovery Coaching
 * 
 * Provides real-time feedback on discovery questions, helping users
 * master the VOS Discovery framework through interactive practice.
 * 
 * Stateless design: All state passed as arguments, no singleton storage.
 */
export class DiscoveryCoachAgent extends BaseAgent<DiscoveryCoachOutput> {
  constructor(config?: Partial<AgentConfig>) {
    const defaultConfig: AgentConfig = {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: `You are a VOS Discovery Coach. Your role is to help sales professionals master outcome-based discovery.

Core VOS Principles:
1. Start with role-owned KPIs
2. Quantify current state vs. benchmark
3. Identify blockers to KPI progress
4. Calculate business impact
5. Map to Revenue, Cost, or Risk

Evaluate discovery questions on:
- Specificity (avoids vague "tell me about..." questions)
- Quantification (seeks numbers, not just stories)
- Outcome-focus (ties to business KPIs, not features)
- Follow-through (builds on previous answers)

Provide constructive feedback that helps the learner improve.`,
    };

    super({ ...defaultConfig, ...config }, DiscoveryCoachOutputSchema);
  }

  async execute(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): Promise<DiscoveryCoachOutput> {
    // Sanitize input
    const sanitizedInput = this.sanitizeInput(input);

    // Build prompt with context
    const prompt = this.buildPrompt(sanitizedInput, context, sessionState);

    // Call LLM
    const rawResponse = await this.callLLM(prompt);

    // Parse and validate response
    const parsedResponse = await this.parseLLMResponseWithRetry(rawResponse);

    return parsedResponse;
  }

  protected buildPrompt(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): string {
    const conversationContext = this.buildConversationContext(sessionState);
    const userRole = context.userProfile.role;
    const maturityLevel = context.userProfile.maturityLevel;

    return `${this.config.systemPrompt}

LEARNER CONTEXT:
- Role: ${userRole}
- Maturity Level: ${maturityLevel}
- Current Lesson: ${context.currentLesson?.title || "Discovery Practice"}

CONVERSATION HISTORY:
${conversationContext}

LEARNER'S DISCOVERY QUESTION:
"${input}"

Evaluate this discovery question and provide feedback in the following JSON format:
{
  "response": "Your conversational response to the learner",
  "feedback": {
    "quality": "excellent" | "good" | "needs_improvement",
    "reasoning": "Why you rated it this way",
    "improvements": ["Specific suggestion 1", "Specific suggestion 2"]
  },
  "nextPrompt": "A suggested follow-up question the learner could ask",
  "score": 85
}

Respond ONLY with valid JSON, no additional text.`;
  }
}

/**
 * Factory function to create a DiscoveryCoachAgent instance
 */
export function createDiscoveryCoachAgent(
  config?: Partial<AgentConfig>
): DiscoveryCoachAgent {
  return new DiscoveryCoachAgent(config);
}
