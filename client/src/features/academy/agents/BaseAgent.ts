import { z } from "zod";
import { parseLLMOutput, parseLLMOutputWithRetry } from "./utils/safeJsonParser";
import type { AgentConfig, AgentContext, AgentSessionState } from "./types";

/**
 * BaseAgent - Stateless Agent Architecture
 * 
 * Key principles:
 * - No internal state (all state passed as arguments)
 * - Schema validation for all outputs
 * - Defensive parsing with retry logic
 * - Pure functions (output depends only on input)
 */
export abstract class BaseAgent<TOutput> {
  protected config: AgentConfig;
  protected outputSchema: z.ZodSchema<TOutput>;

  constructor(config: AgentConfig, outputSchema: z.ZodSchema<TOutput>) {
    this.config = config;
    this.outputSchema = outputSchema;
  }

  /**
   * Main execution method - must be implemented by subclasses
   * 
   * @param input - User input or query
   * @param context - Current agent context (NOT stored in this class)
   * @param sessionState - Current session state (from DB)
   * @returns Validated agent output
   */
  abstract execute(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): Promise<TOutput>;

  /**
   * Build the prompt for the LLM
   */
  protected abstract buildPrompt(
    input: string,
    context: AgentContext,
    sessionState: AgentSessionState
  ): string;

  /**
   * Call the LLM with the constructed prompt
   * 
   * NOTE: In production, this would call your LLM gateway (OpenAI, Anthropic, etc.)
   * For now, this is a mock that returns structured responses
   */
  protected async callLLM(prompt: string): Promise<string> {
    // TODO: Replace with actual LLM call
    // Example: return await openai.chat.completions.create({ ... })
    
    console.log("LLM Prompt:", prompt);
    
    // Mock response for development
    return JSON.stringify({
      message: "This is a mock response. Connect to a real LLM in production.",
      suggestions: ["Suggestion 1", "Suggestion 2"],
    });
  }

  /**
   * Parse LLM output with schema validation
   */
  protected async parseLLMResponse(content: string): Promise<TOutput> {
    return parseLLMOutput(content, this.outputSchema);
  }

  /**
   * Parse with automatic retry on failure
   */
  protected async parseLLMResponseWithRetry(
    initialContent: string,
    maxRetries: number = 2
  ): Promise<TOutput> {
    return parseLLMOutputWithRetry(
      (retryPrompt) => this.callLLM(retryPrompt),
      initialContent,
      this.outputSchema,
      maxRetries
    );
  }

  /**
   * Sanitize user input to prevent injection attacks
   */
  protected sanitizeInput(input: string): string {
    // Remove potential script tags
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    // Remove potential SQL injection patterns
    sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi, "");
    
    // Trim and limit length
    sanitized = sanitized.trim().substring(0, 2000);
    
    return sanitized;
  }

  /**
   * Build conversation context from history
   */
  protected buildConversationContext(
    sessionState: AgentSessionState,
    maxMessages: number = 10
  ): string {
    const recentHistory = sessionState.conversationHistory.slice(-maxMessages);
    
    return recentHistory
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");
  }

  /**
   * Update session state (pure function - returns new state)
   */
  protected updateSessionState(
    currentState: AgentSessionState,
    userInput: string,
    agentResponse: string
  ): AgentSessionState {
    const timestamp = Date.now();
    
    return {
      ...currentState,
      conversationHistory: [
        ...currentState.conversationHistory,
        {
          role: "user",
          content: userInput,
          timestamp,
        },
        {
          role: "agent",
          content: agentResponse,
          timestamp: timestamp + 1,
        },
      ],
    };
  }
}
