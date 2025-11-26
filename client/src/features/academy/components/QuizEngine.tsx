import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { ACADEMY_QUIZZES, type Quiz, type QuizQuestion } from "../data/quizzes";

interface QuizEngineProps {
  quizId: string;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizEngine({ quizId, onComplete }: QuizEngineProps) {
  const quiz = ACADEMY_QUIZZES[quizId];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  if (!quiz) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">
            Quiz not found: <span className="font-mono">{quizId}</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResults(true);
      const score = calculateScore(quiz, newAnswers);
      const passed = score >= quiz.passingScore;
      onComplete?.(score, passed);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[quiz.questions[currentQuestionIndex - 1].id] || "");
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setSelectedAnswer("");
  };

  if (showResults) {
    const score = calculateScore(quiz, answers);
    const passed = score >= quiz.passingScore;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <div className="text-sm text-muted-foreground mb-4">
              {passed ? "Passed!" : `Passing score: ${quiz.passingScore}%`}
            </div>
            <Progress value={score} className="h-2 mb-4" />
          </div>

          <div className="space-y-3">
            {quiz.questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border ${
                    isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Question {idx + 1}</div>
                      <div className="text-xs text-muted-foreground">{q.explanation}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            {!passed && (
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Retry Quiz
              </Button>
            )}
            <Button
              onClick={() => onComplete?.(score, passed)}
              className="flex-1"
              disabled={!passed}
            >
              {passed ? "Continue" : "Review & Retry"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{quiz.title}</CardTitle>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>Passing: {quiz.passingScore}%</span>
        </div>
        <Progress
          value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
          className="h-1 mt-2"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-4">{currentQuestion.text}</p>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedAnswer(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-sm">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedAnswer} className="flex-1">
            {isLastQuestion ? "Submit" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateScore(quiz: Quiz, answers: Record<string, string>): number {
  let correct = 0;
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correct++;
    }
  });
  return Math.round((correct / quiz.questions.length) * 100);
}
