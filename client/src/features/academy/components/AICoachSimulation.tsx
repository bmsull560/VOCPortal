import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { createDiscoveryCoachAgent } from "../agents";
import type { AgentContext, AgentSessionState } from "../agents/types";

interface AICoachSimulationProps {
  lessonId: string;
  userRole: string;
  maturityLevel: number;
  onComplete?: () => void;
}

/**
 * AICoachSimulation - Interactive AI-Powered Discovery Practice
 * 
 * Uses the stateless DiscoveryCoachAgent to provide real-time feedback
 * on discovery questions without storing state in the component.
 */
export function AICoachSimulation({
  lessonId,
  userRole,
  maturityLevel,
  onComplete,
}: AICoachSimulationProps) {
  const [sessionState, setSessionState] = useState<AgentSessionState>({
    sessionId: `session-${Date.now()}`,
    userId: "demo-user", // TODO: Get from auth context
    lessonId,
    conversationHistory: [],
  });

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create agent instance (stateless - no singleton)
      const agent = createDiscoveryCoachAgent();

      // Build context (not stored in agent)
      const context: AgentContext = {
        userProfile: {
          role: userRole,
          maturityLevel,
          completedLessons: [],
        },
        currentLesson: {
          id: lessonId,
          title: "Discovery Practice",
          targetRoles: [userRole],
          minMaturity: maturityLevel,
        },
        conversationHistory: sessionState.conversationHistory,
      };

      // Execute agent (pure function - returns new state)
      const response = await agent.execute(userInput, context, sessionState);

      // Update session state (immutable update)
      const newSessionState: AgentSessionState = {
        ...sessionState,
        conversationHistory: [
          ...sessionState.conversationHistory,
          {
            role: "user",
            content: userInput,
            timestamp: Date.now(),
          },
          {
            role: "agent",
            content: response.response,
            timestamp: Date.now() + 1,
          },
        ],
      };

      setSessionState(newSessionState);
      setUserInput("");

      // TODO: Persist session state to database
      // await saveSessionState(newSessionState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Agent execution error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Discovery Coach
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Practice discovery questions and get real-time feedback from your AI coach
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation History */}
        <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted/30">
          {sessionState.conversationHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Start by asking a discovery question. I'll provide feedback to help you improve!
              </p>
            </div>
          ) : (
            sessionState.conversationHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  } p-3 rounded-lg`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-semibold">
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-background border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 animate-pulse" />
                  <span className="text-xs font-semibold">AI Coach</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Analyzing your question...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            placeholder="Type your discovery question here... (e.g., 'What KPIs does your role own?')"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={3}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {userRole}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Level {maturityLevel}
              </Badge>
            </div>
            <Button onClick={handleSubmit} disabled={!userInput.trim() || isLoading}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Analyzing..." : "Send"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {sessionState.conversationHistory.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {Math.floor(sessionState.conversationHistory.length / 2)} questions asked
              </span>
            </div>
            {sessionState.conversationHistory.length >= 10 && (
              <Button onClick={onComplete} variant="outline" size="sm">
                Complete Practice
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
