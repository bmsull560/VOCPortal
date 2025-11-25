import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, XCircle, Award, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Quiz() {
  const { pillarNumber } = useParams<{ pillarNumber: string }>();
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const pillarNum = parseInt(pillarNumber || "1");

  // Fetch pillar data
  const { data: pillar, isLoading: pillarLoading } = trpc.pillars.getByNumber.useQuery(
    { pillarNumber: pillarNum },
    { enabled: !!pillarNumber }
  );

  // Fetch quiz questions
  const { data: questions, isLoading: questionsLoading } = trpc.quiz.getQuestions.useQuery(
    { pillarId: pillar?.id || 0 },
    { enabled: !!pillar?.id }
  );

  const submitQuizMutation = trpc.quiz.submitQuiz.useMutation({
    onSuccess: (result: any) => {
      setQuizResult(result);
      setQuizSubmitted(true);
      toast.success(`Quiz completed!`);
    },
    onError: (error: any) => {
      toast.error(`Failed to submit quiz: ${error.message}`);
    }
  });

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (loading || pillarLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!pillar || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Quiz Not Available</CardTitle>
            <CardDescription>
              No quiz questions found for this pillar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      toast.error(`Please answer all questions (${answeredCount}/${questions.length} answered)`);
      return;
    }

    // Calculate score and correctness
    const answers = questions.map(q => {
      const selectedAnswer = selectedAnswers[q.id];
      const isCorrect = selectedAnswer === q.correctAnswer;
      return {
        questionId: q.id,
        selectedAnswer,
        isCorrect,
        pointsEarned: isCorrect ? (q.points || 4) : 0
      };
    });

    const totalPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const maxPoints = questions.reduce((sum, q) => sum + (q.points || 4), 0);
    const score = Math.round((totalPoints / maxPoints) * 100);

    submitQuizMutation.mutate({
      pillarId: pillar.id,
      answers,
      score
    });
  };

  const getCertificationBadge = (score: number) => {
    if (score >= 95) return { label: "Gold", color: "bg-yellow-500" };
    if (score >= 80) return { label: "Silver", color: "bg-gray-400" };
    if (score >= 60) return { label: "Bronze", color: "bg-amber-600" };
    return null;
  };

  // Quiz Results View
  if (quizSubmitted && quizResult) {
    const certification = getCertificationBadge(quizResult.score);
    
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="container max-w-3xl">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {quizResult.passed ? (
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                  ) : (
                    <XCircle className="h-20 w-20 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-3xl">
                  {quizResult.passed ? "Congratulations!" : "Keep Learning"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {quizResult.passed 
                    ? "You've successfully completed this pillar quiz"
                    : "You need 80% to pass. Review the material and try again."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground">
                    Attempt #{quizResult.attemptNumber}
                  </p>
                </div>

                {certification && quizResult.passed && (
                  <div className="py-6">
                    <Badge className={`${certification.color} text-white text-lg px-6 py-2`}>
                      <Award className="mr-2 h-5 w-5" />
                      {certification.label} Certification
                    </Badge>
                  </div>
                )}

                {quizResult.feedback && (
                  <div className="text-left space-y-4 p-6 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-semibold mb-2">Overall Feedback</h3>
                      <p className="text-sm text-muted-foreground">{quizResult.feedback.overall}</p>
                    </div>
                    
                    {quizResult.feedback.strengths && quizResult.feedback.strengths.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Strengths</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {quizResult.feedback.strengths.map((strength: string, i: number) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quizResult.feedback.improvements && quizResult.feedback.improvements.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {quizResult.feedback.improvements.map((improvement: string, i: number) => (
                            <li key={i}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center pt-4">
                  <Link href={`/pillar/${pillarNumber}`}>
                    <Button variant="outline">
                      Review Content
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button>
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Quiz Taking View
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          {/* Quiz Header */}
          <div className="mb-6">
            <Badge variant="outline" className="mb-2">Pillar {pillarNumber}</Badge>
            <h1 className="text-3xl font-bold mb-2">{pillar.title} Quiz</h1>
            <p className="text-muted-foreground">
              Answer all questions to earn your certification
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {currentQuestion.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedAnswers[currentQuestion.id] || ""} 
                onValueChange={handleAnswerSelect}
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.id} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-primary w-8'
                      : selectedAnswers[questions[index].id]
                      ? 'bg-primary/50'
                      : 'bg-muted-foreground/20'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitQuizMutation.isPending}
              >
                {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
