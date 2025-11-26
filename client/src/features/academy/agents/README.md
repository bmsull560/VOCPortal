# VOS Academy Agents - Enterprise-Grade AI Architecture

## Overview

This module implements a **stateless, enterprise-ready agent system** for the VOS Academy, following the architectural principles from the enterprise audit:

### Key Principles

✅ **Stateless Design** - No singleton state, all state passed as arguments  
✅ **Schema Validation** - Zod validation for all LLM outputs  
✅ **Defensive Parsing** - Robust JSON extraction with retry logic  
✅ **Session-Based State** - State stored in DB, not in memory  
✅ **Context Optimization** - RAG-style retrieval, not context dumping  

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Request                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Hydrate Session State (from DB, not singleton)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Create Agent Instance (stateless, no this.state)        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Execute Agent (pure function: input → output)           │
│     - Build prompt with context                             │
│     - Call LLM                                              │
│     - Parse & validate with Zod                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Persist Updated State (atomic DB transaction)           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Return Response                           │
└─────────────────────────────────────────────────────────────┘
```

## Agents

### 1. DiscoveryCoachAgent

AI-powered coaching for VOS Discovery practice.

**Use Case:** Real-time feedback on discovery questions  
**Input:** User's discovery question  
**Output:** Feedback, quality score, improvement suggestions  

```typescript
import { createDiscoveryCoachAgent } from './agents';

const agent = createDiscoveryCoachAgent();
const result = await agent.execute(
  "What KPIs does your role own?",
  context,
  sessionState
);

// result.feedback.quality: "excellent" | "good" | "needs_improvement"
// result.score: 0-100
```

### 2. LessonPersonalizationAgent

RAG-based learning path recommendations.

**Use Case:** Personalized lesson recommendations  
**Input:** User goals or "What should I learn next?"  
**Output:** Ranked lesson recommendations with reasoning  

```typescript
import { createLessonPersonalizationAgent } from './agents';

const agent = createLessonPersonalizationAgent();
const result = await agent.execute(
  "I want to improve my discovery skills",
  context,
  sessionState
);

// result.recommendedLessons: [{ lessonId, relevanceScore, reasoning }]
// result.learningPath: ["lesson-1", "lesson-2", "lesson-3"]
```

### 3. QuizGenerationAgent

Dynamic quiz creation based on lesson content.

**Use Case:** Generate contextual assessment questions  
**Input:** "Generate 5 questions on Discovery Excellence"  
**Output:** Validated quiz questions with explanations  

```typescript
import { createQuizGenerationAgent } from './agents';

const agent = createQuizGenerationAgent();
const result = await agent.execute(
  "Generate 3 medium difficulty questions",
  context,
  sessionState
);

// result.questions: [{ id, text, options, correctAnswer, explanation }]
```

## SafeJsonParser Utility

Handles all common LLM output issues:

```typescript
import { parseLLMOutput } from './agents/utils/safeJsonParser';
import { z } from 'zod';

const schema = z.object({
  response: z.string(),
  score: z.number(),
});

// Handles markdown, mixed text, trailing commas, etc.
const data = await parseLLMOutput(llmOutput, schema);
```

### Features

- ✅ Strips markdown code blocks (` ```json `)
- ✅ Extracts JSON from mixed text
- ✅ Repairs trailing commas
- ✅ Validates against Zod schema
- ✅ Retry logic with LLM self-correction

## State Management

### ❌ Old (Singleton - Race Condition Risk)

```typescript
class AgentOrchestrator {
  private state: State; // BUG: Shared across requests!
  
  async process(input: string) {
    this.state.update(input); // Request B overwrites Request A's state
  }
}

export const orchestrator = new AgentOrchestrator(); // Singleton
```

### ✅ New (Stateless - Concurrency Safe)

```typescript
class BaseAgent {
  // No internal state properties!
  
  async execute(
    input: string,
    context: AgentContext,      // Passed in
    sessionState: AgentSessionState // Passed in
  ): Promise<Output> {
    // Pure function - output depends only on inputs
    return result;
  }
}

// Usage:
const state = await db.getSession(sessionId);  // 1. Hydrate
const agent = new DiscoveryCoachAgent();        // 2. Create
const result = await agent.execute(input, context, state); // 3. Execute
await db.saveSession(sessionId, newState);      // 4. Persist
```

## Integration Example

### Add AI Coach to a Lesson

```tsx
import { AICoachSimulation } from '@/features/academy/components/AICoachSimulation';

function MyLesson() {
  return (
    <div>
      <h1>Discovery Practice</h1>
      
      <AICoachSimulation
        lessonId="pillar-2-discovery-intro"
        userRole="Sales"
        maturityLevel={2}
        onComplete={() => console.log("Practice complete!")}
      />
    </div>
  );
}
```

### Use Agent in a tRPC Procedure

```typescript
// server/routers/academy.ts
import { createDiscoveryCoachAgent } from '@/features/academy/agents';

export const academyRouter = router({
  coachFeedback: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      question: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Hydrate session state
      const sessionState = await db.getAgentSession(input.sessionId);
      
      // 2. Build context
      const context = {
        userProfile: {
          role: ctx.user.vosRole,
          maturityLevel: ctx.user.maturityLevel,
          completedLessons: await db.getCompletedLessons(ctx.user.id),
        },
        conversationHistory: sessionState.conversationHistory,
      };
      
      // 3. Execute agent (stateless)
      const agent = createDiscoveryCoachAgent();
      const result = await agent.execute(input.question, context, sessionState);
      
      // 4. Persist updated state
      const newState = {
        ...sessionState,
        conversationHistory: [
          ...sessionState.conversationHistory,
          { role: "user", content: input.question, timestamp: Date.now() },
          { role: "agent", content: result.response, timestamp: Date.now() + 1 },
        ],
      };
      await db.saveAgentSession(input.sessionId, newState);
      
      return result;
    }),
});
```

## Testing

### Unit Test Example

```typescript
import { createDiscoveryCoachAgent } from './agents';

describe('DiscoveryCoachAgent', () => {
  it('should provide feedback on discovery questions', async () => {
    const agent = createDiscoveryCoachAgent();
    
    const context = {
      userProfile: { role: 'Sales', maturityLevel: 1, completedLessons: [] },
      conversationHistory: [],
    };
    
    const sessionState = {
      sessionId: 'test-123',
      userId: 'user-456',
      conversationHistory: [],
    };
    
    const result = await agent.execute(
      "What KPIs does your role own?",
      context,
      sessionState
    );
    
    expect(result.feedback.quality).toBe('excellent');
    expect(result.score).toBeGreaterThan(80);
  });
});
```

### Concurrency Test

```typescript
// Test that concurrent requests don't cross-contaminate
it('should handle concurrent sessions without state leakage', async () => {
  const agent = createDiscoveryCoachAgent();
  
  const sessions = Array.from({ length: 50 }, (_, i) => ({
    sessionId: `session-${i}`,
    userId: `user-${i}`,
    conversationHistory: [],
  }));
  
  const results = await Promise.all(
    sessions.map((session) =>
      agent.execute("Test question", context, session)
    )
  );
  
  // Verify no cross-contamination
  results.forEach((result, i) => {
    expect(result).toBeDefined();
    // Each result should be independent
  });
});
```

## Security

### Input Sanitization

All user inputs are sanitized in `BaseAgent.sanitizeInput()`:

- ✅ Strips `<script>` tags
- ✅ Removes SQL injection patterns
- ✅ Limits input length (2000 chars)

### Output Validation

All LLM outputs are validated against strict Zod schemas before being returned to the client.

## Performance

### Context Optimization

Instead of dumping full user profile:

```typescript
// ❌ Bad: Context dumping (1000+ tokens)
const prompt = `User profile: ${JSON.stringify(fullProfile)}`;

// ✅ Good: Context retrieval (50-100 tokens)
const relevantContext = await vectorDB.query(userQuery, topK=3);
const prompt = `Relevant context: ${relevantContext}`;
```

### Caching

Cache LLM responses based on prompt hash:

```typescript
const cacheKey = hashPrompt(prompt + config);
const cached = await redis.get(cacheKey);
if (cached) return cached;

const result = await llm.call(prompt);
await redis.set(cacheKey, result, { ex: 3600 });
```

## Migration Path

1. **Phase 1 (Current):** Agents work with mock LLM responses
2. **Phase 2:** Connect to real LLM (OpenAI/Anthropic)
3. **Phase 3:** Add vector DB for RAG
4. **Phase 4:** Implement caching and rate limiting

## Next Steps

- [ ] Connect to real LLM API (OpenAI/Anthropic)
- [ ] Add database schema for `agent_sessions` table
- [ ] Implement vector DB for RAG-based context retrieval
- [ ] Add Redis caching for LLM responses
- [ ] Create admin dashboard for monitoring agent performance
- [ ] Add A/B testing framework for prompt optimization

## Success Metrics

- **Reliability:** < 1% agent failure rate
- **Latency:** P95 < 2s for agent responses
- **Concurrency:** Support 100+ simultaneous sessions
- **Security:** Zero critical vulnerabilities
- **Token Efficiency:** < 500 tokens per interaction (avg)
