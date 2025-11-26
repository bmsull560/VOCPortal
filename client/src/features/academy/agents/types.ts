import { z } from "zod";

/**
 * Agent Types for VOS Academy
 * 
 * Following stateless architecture principles:
 * - No singleton state
 * - All state passed as arguments
 * - Schema validation for all LLM outputs
 */

// Agent Session State (stored in DB, not in memory)
export const AgentSessionStateSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  lessonId: z.string().optional(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "agent", "system"]),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
  currentContext: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AgentSessionState = z.infer<typeof AgentSessionStateSchema>;

// Agent Response Schema (validated output from LLM)
export const AgentResponseSchema = z.object({
  message: z.string(),
  suggestions: z.array(z.string()).optional(),
  feedback: z
    .object({
      type: z.enum(["positive", "constructive", "critical"]),
      content: z.string(),
    })
    .optional(),
  nextAction: z
    .enum(["continue", "quiz", "complete", "retry"])
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

// Discovery Coach Agent Output
export const DiscoveryCoachOutputSchema = z.object({
  response: z.string(),
  feedback: z.object({
    quality: z.enum(["excellent", "good", "needs_improvement"]),
    reasoning: z.string(),
    improvements: z.array(z.string()),
  }),
  nextPrompt: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
});

export type DiscoveryCoachOutput = z.infer<typeof DiscoveryCoachOutputSchema>;

// Quiz Generation Output
export const QuizGenerationOutputSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      options: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      ),
      correctAnswer: z.string(),
      explanation: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    })
  ),
});

export type QuizGenerationOutput = z.infer<typeof QuizGenerationOutputSchema>;

// Lesson Personalization Output
export const LessonPersonalizationOutputSchema = z.object({
  recommendedLessons: z.array(
    z.object({
      lessonId: z.string(),
      relevanceScore: z.number(),
      reasoning: z.string(),
    })
  ),
  learningPath: z.array(z.string()),
  focusAreas: z.array(z.string()),
});

export type LessonPersonalizationOutput = z.infer<
  typeof LessonPersonalizationOutputSchema
>;

// Agent Configuration
export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// Agent Context (passed to each agent call, not stored in singleton)
export interface AgentContext {
  userProfile: {
    role: string;
    maturityLevel: number;
    completedLessons: string[];
  };
  currentLesson?: {
    id: string;
    title: string;
    targetRoles: string[];
    minMaturity: number;
  };
  conversationHistory: Array<{
    role: "user" | "agent" | "system";
    content: string;
  }>;
}
