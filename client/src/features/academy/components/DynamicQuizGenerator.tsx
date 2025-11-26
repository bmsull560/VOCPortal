import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle, XCircle, RefreshCw, Zap } from "lucide-react";
import { createQuizGenerationAgent } from "../agents";
import type { AgentContext, AgentSessionState } from "../agents/types";

interface DynamicQuizGeneratorProps {
  lessonId: string;
  lessonTitle: string;
  userRole: string;
  maturityLevel: number;
}

export function DynamicQuizGenerator({
  lessonId,
  lessonTitle,
  userRole,
  maturityLevel,
}: DynamicQuizGeneratorProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = useState(3);

  const generateQuiz = async () => {
    setIsGenerating(true);
    setError(null);
    setUserAnswers({});
    setShowResults(false);

    try {
      const agent = createQuizGenerationAgent();

      const context: AgentContext = {
        userProfile: {
          role: userRole,
          maturityLevel,
          completedLessons: [],
        },
        currentLesson: {
          id: lessonId,
          title: lessonTitle,
          targetRoles: [userRole],
          minMaturity: maturityLevel,
        },
        conversationHistory: [],
      };

      const sessionState: AgentSessionState = {
        sessionId: `quiz-${Date.now()}`,
        userId: "demo-user",
        lessonId,
        conversationHistory: [],
      };

      const input = `Generate ${questionCount} ${difficulty} difficulty questions on ${lessonTitle}`;
      const result = await agent.execute(input, context, sessionState);

      setQuestions(result.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
      console.error("Quiz generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    const correct = questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
    return Math.round((correct / questions.length) * 100);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          AI Quiz Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Quiz Configuration */}
        {questions.length === 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                <p className="text-sm text-purple-900">
                  Generate a custom quiz tailored to your learning level using AI
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Difficulty Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          difficulty === diff
                            ? getDifficultyColor(diff)
                            : "bg-background border-border hover:bg-muted"
                        }`}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Questions</label>
                  <div className="flex gap-2">
                    {[3, 5, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          questionCount === count
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-muted"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={generateQuiz}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Quiz
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Quiz Questions */}
        {questions.length > 0 && !showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty.toUpperCase()} Difficulty
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Object.keys(userAnswers).length} / {questions.length} answered
              </span>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg bg-background">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm font-medium flex-1">{question.text}</p>
                </div>

                <RadioGroup
                  value={userAnswers[question.id]}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="space-y-2 ml-9">
                    {question.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                        <Label
                          htmlFor={`${question.id}-${optIndex}`}
                          className="text-sm cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                onClick={submitQuiz}
                disabled={Object.keys(userAnswers).length !== questions.length}
                className="flex-1"
              >
                Submit Quiz
              </Button>
              <Button variant="outline" onClick={() => setQuestions([])}>
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">{calculateScore()}%</div>
              <p className="text-sm text-muted-foreground">
                {questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length} out of{" "}
                {questions.length} correct
              </p>
            </div>

            {/* Answer Review */}
            <div className="space-y-4">
              {questions.map((question, index) => {
                const isCorrect = userAnswers[question.id] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={`p-4 border-2 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2">{question.text}</p>
                        <div className="text-xs space-y-1">
                          <p>
                            <strong>Your answer:</strong>{" "}
                            <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                              {userAnswers[question.id]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <strong>Correct answer:</strong>{" "}
                              <span className="text-green-700">{question.correctAnswer}</span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="mt-2 text-muted-foreground">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setQuestions([])} className="flex-1">
                Generate New Quiz
              </Button>
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Review Answers
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
