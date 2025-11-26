import { BaseAgent } from "./BaseAgent";
import {
  QuizGenerationOutputSchema,
  type QuizGenerationOutput,
  type AgentConfig,
  type AgentContext,
  type AgentSessionState,
} from "./types";

/**
 * QuizGenerationAgent - Dynamic Quiz Creation
 * 
 * Generates contextual quiz questions based on lesson content,
 * user maturity level, and learning objectives.
 * 
 * Ensures questions are:
 * - Relevant to the lesson content
 * - Appropriate for maturity level
 * - Outcome-focused (not just memorization)
 */
export class QuizGenerationAgent extends BaseAgent<QuizGenerationOutput> {
  constructor(config?: Partial<AgentConfig>) {
    const defaultConfig: AgentConfig = {
      model: "gpt-4",
      temperature: 0.5,
      maxTokens: 1500,
      systemPrompt: `You are a VOS Assessment Designer. Create quiz questions that test understanding of VOS principles, not just memorization.

Question Design Principles:
1. Scenario-based: Use realistic business situations
2. Outcome-focused: Test ability to apply VOS frameworks
3. Progressive difficulty: Match user's maturity level
4. Actionable feedback: Explanations should teach, not just correct

Question Types:
- Application: "Given this scenario, which approach aligns with VOS?"
- Analysis: "What's the primary issue with this discovery question?"
- Synthesis: "How would you quantify this pain point?"

Avoid:
- Pure definition questions ("What is the Value Triad?")
- Trick questions with ambiguous answers
- Questions requiring external knowledge not covered in the lesson`,
    };

    super({ ...defaultConfig, ...config }, QuizGenerationOutputSchema);
  }

  async execute(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): Promise<QuizGenerationOutput> {
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
    const { role, maturityLevel } = context.userProfile;
    const lessonTitle = context.currentLesson?.title || "VOS Fundamentals";

    return `${this.config.systemPrompt}

LESSON CONTEXT:
- Title: ${lessonTitle}
- Target Role: ${role}
- Maturity Level: ${maturityLevel}

GENERATION REQUEST:
"${input}"

Generate quiz questions in the following JSON format:
{
  "questions": [
    {
      "id": "q1",
      "text": "A customer says 'We need better reporting.' Which question best translates this to outcome language?",
      "options": [
        { "id": "a", "text": "What reporting features do you need?" },
        { "id": "b", "text": "What decision are you trying to make faster with that data?" },
        { "id": "c", "text": "How many reports do you run per week?" },
        { "id": "d", "text": "What tools do you currently use?" }
      ],
      "correctAnswer": "b",
      "explanation": "Outcome-focused questions dig into the business impact (faster decisions) rather than features.",
      "difficulty": "medium"
    }
  ]
}

Generate ${input.includes("number") ? input.match(/\d+/)?.[0] || "3" : "3"} questions.
Respond ONLY with valid JSON, no additional text.`;
  }
}

/**
 * Factory function
 */
export function createQuizGenerationAgent(
  config?: Partial<AgentConfig>
): QuizGenerationAgent {
  return new QuizGenerationAgent(config);
}
