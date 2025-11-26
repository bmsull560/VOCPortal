/**
 * VOS Academy Agents - Stateless AI Architecture
 * 
 * Export all agents and utilities for easy import
 */

// Base Agent
export { BaseAgent } from "./BaseAgent";

// Specialized Agents
export {
  DiscoveryCoachAgent,
  createDiscoveryCoachAgent,
} from "./DiscoveryCoachAgent";
export {
  LessonPersonalizationAgent,
  createLessonPersonalizationAgent,
} from "./LessonPersonalizationAgent";
export {
  QuizGenerationAgent,
  createQuizGenerationAgent,
} from "./QuizGenerationAgent";

// Types
export type {
  AgentSessionState,
  AgentResponse,
  DiscoveryCoachOutput,
  QuizGenerationOutput,
  LessonPersonalizationOutput,
  AgentConfig,
  AgentContext,
} from "./types";

// Schemas (for external validation)
export {
  AgentSessionStateSchema,
  AgentResponseSchema,
  DiscoveryCoachOutputSchema,
  QuizGenerationOutputSchema,
  LessonPersonalizationOutputSchema,
} from "./types";

// Utilities
export {
  parseLLMOutput,
  parseLLMOutputWithRetry,
  isValidJson,
  parseMultipleJson,
  JsonParseError,
} from "./utils/safeJsonParser";
