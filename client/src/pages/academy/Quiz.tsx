import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Target,
  TrendingUp,
  Users,
  Brain,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  scenario?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  points: number;
  maturityFeedback: {
    level0_1: string;
    level2: string;
    level3plus: string;
  };
}

interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  categoryScores: Record<string, number>;
  answers: Array<{
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>;
  feedback: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
}

const quizData: Record<string, QuizQuestion[]> = {
  '1': [
    {
      id: 1,
      category: 'Value Definitions',
      question: 'What is the primary difference between a feature and a value?',
      options: [
        {
          id: 'a',
          text: 'Features are what the product does, value is what it enables for the customer',
          isCorrect: true,
          explanation: 'Features describe product capabilities, while value focuses on customer outcomes and business impact.'
        },
        {
          id: 'b',
          text: 'Features and value are the same thing',
          isCorrect: false,
          explanation: 'Features and value are distinct concepts. Features describe what the product does, while value describes the business impact.'
        },
        {
          id: 'c',
          text: 'Features are technical, value is marketing language',
          isCorrect: false,
          explanation: 'This is a common misconception. Value is not just marketing language - it represents real business outcomes.'
        },
        {
          id: 'd',
          text: 'Features cost more than value',
          isCorrect: false,
          explanation: 'This comparison doesn\'t make sense. Features enable value, but they aren\'t directly comparable in cost.'
        }
      ],
      points: 4,
      maturityFeedback: {
        level0_1: 'Focus on understanding the distinction between product capabilities and customer outcomes.',
        level2: 'Practice translating features into value statements in your customer conversations.',
        level3plus: 'Help your team master value-first communication across all customer touchpoints.'
      }
    },
    {
      id: 2,
      category: 'Value Framework',
      question: 'Which framework helps organize value conversations around business impact?',
      options: [
        {
          id: 'a',
          text: 'Revenue/Cost/Risk Framework',
          isCorrect: true,
          explanation: 'The Revenue/Cost/Risk framework provides a structured way to discuss business impact in financial terms.'
        },
        {
          id: 'b',
          text: 'Feature/Benefit/Advantage Framework',
          isCorrect: false,
          explanation: 'This traditional sales framework focuses on product features rather than business value.'
        },
        {
          id: 'c',
          text: 'Problem/Solution/Benefit Framework',
          isCorrect: false,
          explanation: 'While useful, this framework doesn\'t specifically address financial business impact.'
        },
        {
          id: 'd',
          text: 'SWOT Analysis Framework',
          isCorrect: false,
          explanation: 'SWOT is a strategic planning tool, not specifically designed for value conversations.'
        }
      ],
      points: 4,
      maturityFeedback: {
        level0_1: 'Learn the Revenue/Cost/Risk framework and practice applying it to customer situations.',
        level2: 'Develop your ability to quantify revenue, cost, and risk impacts for different stakeholders.',
        level3plus: 'Create customized frameworks for your specific industry and customer segments.'
      }
    },
    {
      id: 3,
      category: 'Customer Outcomes',
      scenario: 'A customer says "We need to improve our team productivity by 30% this quarter."',
      question: 'What is the best value-focused response?',
      options: [
        {
          id: 'a',
          text: 'Our product has features that can help with productivity',
          isCorrect: false,
          explanation: 'This response immediately jumps to features without understanding the business context.'
        },
        {
          id: 'b',
          text: 'What specific productivity challenges are you trying to address?',
          isCorrect: true,
          explanation: 'This response seeks to understand the specific business problem before discussing solutions.'
        },
        {
          id: 'c',
          text: 'We can definitely help you achieve that goal',
          isCorrect: false,
          explanation: 'Making promises without understanding the situation is premature and risky.'
        },
        {
          id: 'd',
          text: 'Let me show you a demo of our productivity features',
          isCorrect: false,
          explanation: 'Jumping to a demo without understanding the business needs is not value-focused.'
        }
      ],
      points: 4,
      maturityFeedback: {
        level0_1: 'Practice asking discovery questions before presenting solutions.',
        level2: 'Develop a structured approach to understanding customer business challenges.',
        level3plus: 'Create a discovery framework that uncovers both stated and unstated customer needs.'
      }
    }
  ]
};

const categoryIcons = {
  'Value Definitions': Target,
  'Value Framework': TrendingUp,
  'Customer Outcomes': Users,
  'ROI Modeling': Brain,
  'Business Impact': Lightbulb,
};

export default function AcademyQuiz() {
  const { user } = useAuth();
  const { pillar } = useParams<{ pillar: string }>();
  const [, setLocation] = useLocation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);

  const questions = quizData[pillar || '1'] || [];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [isTimerActive, timeRemaining]);

  const handleAnswer = (questionId: number, answerId: string) => {
    setAnswers((prev: Record<number, string>) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsTimerActive(false);
    
    let earnedPoints = 0;
    let categoryScores: Record<string, number> = {};
    const answerDetails: QuizResult['answers'] = [];

    questions.forEach((question) => {
      const selectedAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);
      const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
      const isCorrect = selectedOption?.isCorrect || false;
      const pointsEarned = isCorrect ? question.points : 0;

      earnedPoints += pointsEarned;

      // Category scoring
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = 0;
      }
      categoryScores[question.category] += pointsEarned;

      answerDetails.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer || '',
        isCorrect,
        pointsEarned
      });
    });

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= 80;

    // Generate feedback
    const strengths: string[] = [];
    const improvements: string[] = [];
    const nextSteps: string[] = [];

    if (percentage >= 90) {
      strengths.push('Excellent understanding of value concepts');
      nextSteps.push('Ready for advanced value modeling');
    } else if (percentage >= 80) {
      strengths.push('Solid grasp of core value principles');
      improvements.push('Review areas where points were lost');
    } else {
      improvements.push('Focus on understanding value vs. features');
      nextSteps.push('Review foundational value concepts');
    }

    // Category-specific feedback
    Object.entries(categoryScores).forEach(([category, score]) => {
      const maxCategoryPoints = questions
        .filter(q => q.category === category)
        .reduce((sum, q) => sum + q.points, 0);
      const categoryPercentage = (score / maxCategoryPoints) * 100;

      if (categoryPercentage >= 80) {
        strengths.push(`Strong performance in ${category}`);
      } else {
        improvements.push(`Review ${category} concepts`);
      }
    });

    const result: QuizResult = {
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
      categoryScores,
      answers: answerDetails,
      feedback: {
        strengths,
        improvements,
        nextSteps
      }
    };

    setQuizResult(result);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getMaturityLevelFeedback = (question: QuizQuestion) => {
    const userLevel = user?.maturityLevel || 0;
    if (userLevel <= 1) return question.maturityFeedback.level0_1;
    if (userLevel === 2) return question.maturityFeedback.level2;
    return question.maturityFeedback.level3plus;
  };

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/academy/dashboard" className="flex items-center gap-2">
                <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
                <span className="font-bold text-xl">{APP_TITLE}</span>
              </Link>
              <div className="h-6 w-px bg-border mx-2" />
              <span className="font-semibold">Quiz Results</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Back to Academy
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="container max-w-4xl">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${
                quizResult.passed ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {quizResult.passed ? (
                  <CheckCircle className="h-10 w-10" />
                ) : (
                  <XCircle className="h-10 w-10" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {quizResult.passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
              </h1>
              <p className="text-muted-foreground text-lg">
                Your Score: {quizResult.score}/{quizResult.totalPoints} ({quizResult.percentage.toFixed(1)}%)
              </p>
              <Badge variant={quizResult.passed ? "default" : "secondary"} className="mt-2">
                {quizResult.passed ? 'Passing Score' : 'Below Passing Score'}
              </Badge>
            </div>

            {/* Category Performance */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(quizResult.categoryScores).map(([category, score]) => {
                    const maxCategoryPoints = questions
                      .filter(q => q.category === category)
                      .reduce((sum, q) => sum + q.points, 0);
                    const percentage = (score / maxCategoryPoints) * 100;
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{score}/{maxCategoryPoints}</div>
                            <div className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</div>
                          </div>
                          <Progress value={percentage} className="h-2 w-24" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Answer Review */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Answer Review</CardTitle>
                <CardDescription>
                  Review your answers and learn from the explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const userAnswer = quizResult.answers.find(a => a.questionId === question.id);
                    const selectedOption = question.options.find(opt => opt.id === userAnswer?.selectedAnswer);
                    const correctOption = question.options.find(opt => opt.isCorrect);

                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          {userAnswer?.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium mb-2">
                              {index + 1}. {question.question}
                            </div>
                            {question.scenario && (
                              <div className="text-sm text-muted-foreground mb-3 italic">
                                Scenario: {question.scenario}
                              </div>
                            )}
                          </div>
                          <Badge variant="outline">
                            {userAnswer?.pointsEarned}/{question.points} points
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Your answer: </span>
                            <span className={userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {selectedOption?.text}
                            </span>
                          </div>
                          {!userAnswer?.isCorrect && (
                            <div>
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">{correctOption?.text}</span>
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            <span className="font-medium">Explanation: </span>
                            {correctOption?.explanation}
                          </div>
                        </div>

                        {/* Maturity-specific feedback */}
                        <Alert className="mt-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong>Your Level Feedback:</strong> {getMaturityLevelFeedback(question)}
                          </AlertDescription>
                        </Alert>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Personalized Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                    <ul className="space-y-1 text-sm">
                      {quizResult.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1 text-sm">
                      {quizResult.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Next Steps</h4>
                    <ul className="space-y-1 text-sm">
                      {quizResult.feedback.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={() => setLocation('/academy/dashboard')} className="flex-1">
                Back to Academy
              </Button>
              {!quizResult.passed && (
                <Button variant="outline" onClick={() => {
                  setShowResults(false);
                  setQuizResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeRemaining(1800);
                }}>
                  Retake Quiz
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isTimerActive && currentQuestion === 0) {
    setIsTimerActive(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/academy/dashboard" className="flex items-center gap-2">
              <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <span className="font-semibold">Pillar {pillar} Quiz</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-muted'
            }`}>
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Exit Quiz
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{question.category}</Badge>
                <Badge variant="secondary">{question.points} points</Badge>
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
              {question.scenario && (
                <CardDescription className="text-base mt-2 p-3 bg-muted rounded-lg">
                  <strong>Scenario:</strong> {question.scenario}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={answers[question.id]} 
                onValueChange={(value) => handleAnswer(question.id, value)}
                className="space-y-4"
              >
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!answers[question.id]}
                >
                  {currentQuestion === questions.length - 1 ? (
                    <>Submit Quiz</>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
