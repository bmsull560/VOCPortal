import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Brain,
  Lightbulb,
  RefreshCw,
  Award
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface AssessmentQuestion {
  id: number;
  category: string;
  question: string;
  description: string;
  options: {
    value: string;
    label: string;
    description: string;
    level: number;
  }[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    category: "Value Language",
    question: "How does your organization currently define and communicate value?",
    description: "Assess your team's value communication maturity",
    options: [
      {
        value: "feature-focused",
        label: "Feature-Focused",
        description: "We primarily discuss product features and capabilities",
        level: 0
      },
      {
        value: "mixed-language",
        label: "Mixed Language",
        description: "Some teams use value language, but it's inconsistent",
        level: 1
      },
      {
        value: "emerging-consistency",
        label: "Emerging Consistency",
        description: "We have basic value definitions and some team alignment",
        level: 2
      },
      {
        value: "structured-framework",
        label: "Structured Framework",
        description: "We use consistent value frameworks across teams",
        level: 3
      },
      {
        value: "automated-value-modeling",
        label: "Automated Value Modeling",
        description: "AI assists in value modeling and communication",
        level: 4
      },
      {
        value: "self-improving-system",
        label: "Self-Improving System",
        description: "Value language evolves automatically based on outcomes",
        level: 5
      }
    ]
  },
  {
    id: 2,
    category: "Data & Metrics",
    question: "How mature is your value measurement and KPI tracking?",
    description: "Evaluate your data-driven value capabilities",
    options: [
      {
        value: "no-kpis",
        label: "No Standard KPIs",
        description: "We don't have standardized value metrics",
        level: 0
      },
      {
        value: "basic-metrics",
        label: "Basic Metrics",
        description: "We track some metrics but lack consistency",
        level: 1
      },
      {
        value: "defined-kpis",
        label: "Defined KPIs",
        description: "We have standard KPIs and basic tracking",
        level: 2
      },
      {
        value: "value-fabric",
        label: "Value Fabric",
        description: "Integrated data model connects all value metrics",
        level: 3
      },
      {
        value: "predictive-analytics",
        label: "Predictive Analytics",
        description: "AI predicts value outcomes and opportunities",
        level: 4
      },
      {
        value: "autonomous-optimization",
        label: "Autonomous Optimization",
        description: "System automatically optimizes value metrics",
        level: 5
      }
    ]
  },
  {
    id: 3,
    category: "Process & Governance",
    question: "How would you describe your value-driven processes?",
    description: "Assess process maturity and governance",
    options: [
      {
        value: "ad-hoc",
        label: "Ad-Hoc Processes",
        description: "Value discussions happen randomly without structure",
        level: 0
      },
      {
        value: "emerging-processes",
        label: "Emerging Processes",
        description: "Some teams are developing value processes",
        level: 1
      },
      {
        value: "standardized-workflows",
        label: "Standardized Workflows",
        description: "We have documented value processes and templates",
        level: 2
      },
      {
        value: "lifecycle-integration",
        label: "Lifecycle Integration",
        description: "Value processes span the entire customer lifecycle",
        level: 3
      },
      {
        value: "ai-augmented",
        label: "AI-Augmented",
        description: "AI enhances and accelerates value processes",
        level: 4
      },
      {
        value: "self-orchestrating",
        label: "Self-Orchestrating",
        description: "Processes automatically adapt and improve",
        level: 5
      }
    ]
  },
  {
    id: 4,
    category: "Customer Collaboration",
    question: "How do you collaborate with customers on value realization?",
    description: "Evaluate customer partnership maturity",
    options: [
      {
        value: "transactional",
        label: "Transactional",
        description: "Limited customer collaboration beyond sales",
        level: 0
      },
      {
        value: "basic-engagement",
        label: "Basic Engagement",
        description: "Some customer success activities exist",
        level: 1
      },
      {
        value: "structured-partnership",
        label: "Structured Partnership",
        description: "We have formal customer success processes",
        level: 2
      },
      {
        value: "joint-value-creation",
        label: "Joint Value Creation",
        description: "Customers actively participate in value creation",
        level: 3
      },
      {
        value: "predictive-guidance",
        label: "Predictive Guidance",
        description: "AI proactively guides customer value journeys",
        level: 4
      },
      {
        value: "ecosystem-synergy",
        label: "Ecosystem Synergy",
        description: "Customer and supplier ecosystems create shared value",
        level: 5
      }
    ]
  },
  {
    id: 5,
    category: "Technology & Automation",
    question: "What's the current state of your value technology stack?",
    description: "Assess your technological capabilities",
    options: [
      {
        value: "manual-tools",
        label: "Manual Tools",
        description: "Spreadsheets and manual processes dominate",
        level: 0
      },
      {
        value: "basic-systems",
        label: "Basic Systems",
        description: "Some CRM/CS tools but limited integration",
        level: 1
      },
      {
        value: "integrated-platform",
        label: "Integrated Platform",
        description: "Connected systems with basic automation",
        level: 2
      },
      {
        value: "value-fabric-tech",
        label: "Value Fabric Tech",
        description: "Unified technology platform for value operations",
        level: 3
      },
      {
        value: "ai-integrated",
        label: "AI-Integrated",
        description: "AI is embedded throughout the value stack",
        level: 4
      },
      {
        value: "autonomous-systems",
        label: "Autonomous Systems",
        description: "Self-managing technology that optimizes value",
        level: 5
      }
    ]
  }
];

const categoryIcons = {
  "Value Language": Target,
  "Data & Metrics": TrendingUp,
  "Process & Governance": RefreshCw,
  "Customer Collaboration": Users,
  "Technology & Automation": Brain,
};

export default function AcademyMaturityAssessment() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<number | null>(null);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    let totalScore = 0;
    let answeredQuestions = 0;

    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = assessmentQuestions.find(q => q.id === parseInt(questionId));
      if (question) {
        const selectedOption = question.options.find(opt => opt.value === answerValue);
        if (selectedOption) {
          totalScore += selectedOption.level;
          answeredQuestions++;
        }
      }
    });

    const averageLevel = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
    setAssessmentResult(averageLevel);
    setIsCompleted(true);
  };

  const getMaturityLevelColor = (level: number) => {
    if (level === 0) return "bg-red-500";
    if (level === 1) return "bg-orange-500";
    if (level === 2) return "bg-yellow-500";
    if (level === 3) return "bg-lime-500";
    if (level === 4) return "bg-green-500";
    return "bg-teal-600";
  };

  const getMaturityLevelLabel = (level: number) => {
    const labels = [
      "L0: Value Chaos",
      "L1: Value Awareness", 
      "L2: Value Alignment",
      "L3: Value Integration",
      "L4: Value Automation",
      "L5: Value Operating System"
    ];
    return labels[level] || "Unknown";
  };

  const getMaturityLevelDescription = (level: number) => {
    const descriptions = [
      "Your organization operates with inconsistent value language and fragmented processes. Focus on establishing basic value definitions and communication standards.",
      "You're beginning to recognize the importance of value-driven approaches. Continue building consistency in value language and basic metrics.",
      "Good progress! You have established value foundations and some standardized processes. Focus on expanding integration and governance.",
      "Strong maturity! Your organization integrates value across the lifecycle. Focus on automation and predictive capabilities.",
      "Excellent! You're using AI to augment value operations. Focus on autonomous workflows and self-improving systems.",
      "Outstanding! You operate a fully agentic Value Operating System. Focus on continuous optimization and ecosystem expansion."
    ];
    return descriptions[level] || "";
  };

  if (isCompleted && assessmentResult !== null) {
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
              <span className="font-semibold">Maturity Assessment</span>
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
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
              <p className="text-muted-foreground">Your VOS Maturity Level has been calculated</p>
            </div>

            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className={`h-20 w-20 rounded-full ${getMaturityLevelColor(assessmentResult)} flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4`}>
                  L{assessmentResult}
                </div>
                <CardTitle className="text-2xl">{getMaturityLevelLabel(assessmentResult)}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {getMaturityLevelDescription(assessmentResult)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Your Assessment Breakdown</h3>
                    <div className="space-y-3">
                      {assessmentQuestions.map((question) => {
                        const Icon = categoryIcons[question.category as keyof typeof categoryIcons];
                        const answer = answers[question.id];
                        const selectedOption = question.options.find(opt => opt.value === answer);
                        
                        return (
                          <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">{question.category}</div>
                                <div className="text-sm text-muted-foreground">{selectedOption?.label}</div>
                              </div>
                            </div>
                            <Badge variant="outline">Level {selectedOption?.level}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setLocation('/academy/dashboard')} className="flex-1">
                      View Academy Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsCompleted(false);
                      setAssessmentResult(null);
                      setAnswers({});
                      setCurrentQuestion(0);
                    }}>
                      Retake Assessment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const Icon = categoryIcons[question.category as keyof typeof categoryIcons];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

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
            <span className="font-semibold">Maturity Assessment</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Exit Assessment
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">{question.category}</Badge>
                  <CardTitle className="text-xl">{question.question}</CardTitle>
                  <CardDescription className="text-base mt-2">{question.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={answers[question.id]} 
                onValueChange={(value) => handleAnswer(question.id, value)}
                className="space-y-4"
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      <Badge variant="outline" className="mt-2">Level {option.level}</Badge>
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
                  {currentQuestion === assessmentQuestions.length - 1 ? (
                    <>Complete Assessment</>
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
