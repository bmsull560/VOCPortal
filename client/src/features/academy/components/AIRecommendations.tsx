import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { createLessonPersonalizationAgent } from "../agents";
import type { AgentContext, AgentSessionState } from "../agents/types";
import { ACADEMY_LESSONS } from "../data/lessons";
import { useLocation } from "wouter";

interface AIRecommendationsProps {
  userRole: string;
  maturityLevel: number;
  completedLessons?: string[];
  userGoal?: string;
}

export function AIRecommendations({
  userRole,
  maturityLevel,
  completedLessons = [],
  userGoal,
}: AIRecommendationsProps) {
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState("");

  const fetchRecommendations = async (goal?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const agent = createLessonPersonalizationAgent();

      const context: AgentContext = {
        userProfile: {
          role: userRole,
          maturityLevel,
          completedLessons,
        },
        currentLesson: undefined,
        conversationHistory: [],
      };

      const sessionState: AgentSessionState = {
        sessionId: `rec-${Date.now()}`,
        userId: "demo-user",
        lessonId: "recommendations",
        conversationHistory: [],
      };

      const input = goal || userGoal || "What should I learn next?";
      const result = await agent.execute(input, context, sessionState);

      // Map recommended lesson IDs to actual lesson data
      const enrichedRecommendations = result.recommendedLessons
        .map((rec: any) => {
          const lesson = ACADEMY_LESSONS[rec.lessonId];
          if (!lesson) return null;
          return {
            ...lesson,
            relevanceScore: rec.relevanceScore,
            reasoning: rec.reasoning,
          };
        })
        .filter(Boolean)
        .slice(0, 3); // Show top 3

      setRecommendations(enrichedRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations");
      console.error("Recommendation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userRole, maturityLevel]);

  const handleCustomGoal = () => {
    if (customGoal.trim()) {
      fetchRecommendations(customGoal);
      setCustomGoal("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Personalized learning path based on your role, level, and goals
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRecommendations()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Custom Goal Input */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <label className="text-sm font-medium mb-2 block">
            What would you like to learn?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomGoal()}
              placeholder="e.g., 'I want to improve my discovery skills'"
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button onClick={handleCustomGoal} disabled={isLoading || !customGoal.trim()}>
              Ask AI
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">AI is analyzing your learning path...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Recommendations */}
        {!isLoading && !error && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((lesson, index) => (
              <div
                key={lesson.id}
                className="p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all cursor-pointer bg-background"
                onClick={() => setLocation(`/academy/lesson/${lesson.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-amber-100 text-amber-700"
                          : index === 1
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{lesson.title}</h4>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {Math.round(lesson.relevanceScore * 100)}% match
                      </Badge>
                    </div>

                    {lesson.summary && (
                      <p className="text-xs text-muted-foreground mb-2">{lesson.summary}</p>
                    )}

                    {/* AI Reasoning */}
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                      <div className="flex items-start gap-1">
                        <Sparkles className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-900">
                          <strong>Why this lesson:</strong> {lesson.reasoning}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      {lesson.targetRoles.map((role: string) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {lesson.estimatedMinutes && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.estimatedMinutes} min
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Level {lesson.minMaturity}
                      </Badge>
                    </div>
                  </div>

                  {/* Action */}
                  <Button size="sm" variant="ghost" className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recommendations available yet.</p>
            <p className="text-xs mt-1">Try asking the AI what you'd like to learn!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
