import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  Brain,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Target,
  MessageSquare,
  FileText,
  Clock,
  Award
} from "lucide-react";
import { Link } from "wouter";

interface SimulationStep {
  id: string;
  type: 'scenario' | 'decision' | 'interaction' | 'reflection';
  title: string;
  content: {
    text?: string;
    scenario?: string;
    character?: string;
    dialogue?: string;
    options?: Array<{
      id: string;
      text: string;
      impact: string;
      score: number;
    }>;
    context?: string;
  };
  scoring: {
    maxScore: number;
    criteria: string[];
  };
}

interface Simulation {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: string;
  steps: SimulationStep[];
  maxScore: number;
  passingScore: number;
}

const simulations: Record<string, Simulation> = {
  'discovery-call': {
    id: 'discovery-call',
    title: 'Value Discovery Call Simulation',
    description: 'Practice conducting a value-focused discovery call with a prospective customer',
    type: 'role-play',
    duration: '30 minutes',
    maxScore: 100,
    passingScore: 80,
    steps: [
      {
        id: 'step-1',
        type: 'scenario',
        title: 'Opening the Call',
        content: {
          scenario: 'You are speaking with Sarah, VP of Operations at Acme Corp. She agreed to a 30-minute discovery call after your initial outreach.',
          character: 'Sarah (VP of Operations)',
          dialogue: 'Thanks for taking the time to speak with me today. Your team mentioned something about value operations - can you tell me more about what that means?',
          context: 'This is your opportunity to set the stage for a value-focused conversation rather than jumping into product features.'
        },
        scoring: {
          maxScore: 20,
          criteria: ['Value framing', 'Business context', 'Discovery approach']
        }
      },
      {
        id: 'step-2',
        type: 'decision',
        title: 'Choose Your Response',
        content: {
          text: 'How do you respond to Sarah\'s question about value operations?',
          options: [
            {
              id: 'option-1',
              text: 'Let me show you our product features that demonstrate value operations',
              impact: 'Immediately jumps to features without understanding business context',
              score: 5
            },
            {
              id: 'option-2',
              text: 'Before I explain, I\'d love to understand more about your current operations and what challenges you\'re facing',
              impact: 'Seeks to understand business context first',
              score: 20
            },
            {
              id: 'option-3',
              text: 'Value operations is a framework that helps companies measure and optimize the business impact of their investments',
              impact: 'Provides definition but still lacks business context',
              score: 12
            },
            {
              id: 'option-4',
              text: 'Great question! Most companies I work with are struggling to connect their technology investments to business outcomes. Is that something you\'re experiencing?',
              impact: 'Relates to common business challenges while opening discovery',
              score: 18
            }
          ]
        },
        scoring: {
          maxScore: 20,
          criteria: ['Discovery mindset', 'Business relevance', 'Value framing']
        }
      },
      {
        id: 'step-3',
        type: 'scenario',
        title: 'Sarah\'s Response',
        content: {
          character: 'Sarah (VP of Operations)',
          dialogue: 'That\'s interesting. We are struggling with showing the ROI of our recent technology investments. Our CEO keeps asking for business impact data, but we\'re not sure how to measure it effectively.',
          context: 'Sarah has revealed a specific business pain point. This is your opportunity to dig deeper and understand the value gap.'
        },
        scoring: {
          maxScore: 15,
          criteria: ['Active listening', 'Pain identification']
        }
      },
      {
        id: 'step-4',
        type: 'decision',
        title: 'Deep Dive on the Pain',
        content: {
          text: 'How do you respond to Sarah\'s ROI measurement challenge?',
          options: [
            {
              id: 'option-1',
              text: 'Our product has built-in ROI tracking that can solve this problem for you',
              impact: 'Premature solution without understanding the full scope',
              score: 8
            },
            {
              id: 'option-2',
              text: 'Can you tell me more about the specific technology investments you\'re referring to and what metrics you\'ve tried to track so far?',
              impact: 'Seeks specific details to understand the current state',
              score: 20
            },
            {
              id: 'option-3',
              text: 'ROI measurement is a common challenge. Let me explain our Revenue/Cost/Risk framework that can help',
              impact: 'Educates but still needs more context about their specific situation',
              score: 15
            },
            {
              id: 'option-4',
              text: 'That\'s exactly the kind of challenge we help with. What would be the business impact if you could solve this ROI measurement problem?',
              impact: 'Focuses on the business value of solving the problem',
              score: 18
            }
          ]
        },
        scoring: {
          maxScore: 20,
          criteria: ['Problem understanding', 'Value focus', 'Discovery depth']
        }
      },
      {
        id: 'step-5',
        type: 'interaction',
        title: 'Building the Value Tree',
        content: {
          scenario: 'Based on your conversation, you\'ve identified that Sarah needs to measure ROI for three main areas: employee productivity tools, customer service platform, and supply chain software.',
          text: 'Now you need to help Sarah structure this into a Value Tree. Which approach would be most effective?',
          options: [
            {
              id: 'option-1',
              text: 'Start with the technology features and work backwards to business impact',
              impact: 'Feature-first approach rather than value-first',
              score: 10
            },
            {
              id: 'option-2',
              text: 'Focus on the revenue impact first, then cost savings, then risk reduction',
              impact: 'Structured Revenue/Cost/Risk approach',
              score: 20
            },
            {
              id: 'option-3',
              text: 'Ask Sarah which area is most important to her CEO and start there',
              impact: 'Stakeholder-aligned approach',
              score: 18
            },
            {
              id: 'option-4',
              text: 'Create a comprehensive tree covering all three areas simultaneously',
              impact: 'Comprehensive but potentially overwhelming',
              score: 15
            }
          ]
        },
        scoring: {
          maxScore: 20,
          criteria: ['Value Tree methodology', 'Stakeholder alignment', 'Structured approach']
        }
      },
      {
        id: 'step-6',
        type: 'reflection',
        title: 'Call Debrief',
        content: {
          text: 'The discovery call is complete. You\'ve established the value framework and Sarah has agreed to a follow-up meeting with her CFO.',
          scenario: 'Review your performance and identify areas for improvement in your next discovery call.',
          context: 'Reflect on how well you maintained a value-focused conversation throughout the call.'
        },
        scoring: {
          maxScore: 15,
          criteria: ['Value consistency', 'Business outcome focus', 'Next steps clarity']
        }
      }
    ]
  },
  'handoff-workflow': {
    id: 'handoff-workflow',
    title: 'Sales to Customer Success Handoff',
    description: 'Master the critical handoff process from Sales to Customer Success',
    type: 'handoff',
    duration: '25 minutes',
    maxScore: 100,
    passingScore: 80,
    steps: [
      {
        id: 'step-1',
        type: 'scenario',
        title: 'Preparation for Handoff',
        content: {
          scenario: 'You\'ve just closed a deal with TechCorp for a $250K annual contract. The customer expects to see ROI within 6 months.',
          text: 'What information should you prepare before the handoff meeting with Customer Success?',
          context: 'A successful handoff requires comprehensive preparation and documentation.'
        },
        scoring: {
          maxScore: 25,
          criteria: ['Documentation completeness', 'Value articulation', 'Success criteria']
        }
      },
      {
        id: 'step-2',
        type: 'decision',
        title: 'Handoff Package Contents',
        content: {
          text: 'Which elements are most critical for the handoff package?',
          options: [
            {
              id: 'option-1',
              text: 'Contract details and implementation timeline',
              impact: 'Basic information but lacks value context',
              score: 12
            },
            {
              id: 'option-2',
              text: 'Complete Value Tree, ROI model, and success metrics',
              impact: 'Value-focused handoff with clear success criteria',
              score: 25
            },
            {
              id: 'option-3',
              text: 'Technical specifications and user guides',
              impact: 'Technical focus without business context',
              score: 8
            },
            {
              id: 'option-4',
              text: 'Customer contact information and meeting notes',
              impact: 'Basic contact info but lacks strategic value',
              score: 10
            }
          ]
        },
        scoring: {
          maxScore: 25,
          criteria: ['Value artifacts', 'Success metrics', 'Continuity']
        }
      },
      {
        id: 'step-3',
        type: 'interaction',
        title: 'Handoff Meeting',
        content: {
          scenario: 'You\'re in the handoff meeting with the Customer Success Manager (CSM).',
          character: 'CSM',
          dialogue: 'Thanks for the handoff package. Can you walk me through the key value drivers that convinced this customer to buy?',
          context: 'This is your opportunity to ensure the CSM understands the value proposition.'
        },
        scoring: {
          maxScore: 25,
          criteria: ['Value communication', 'Context transfer', 'Partnership alignment']
        }
      },
      {
        id: 'step-4',
        type: 'reflection',
        title: 'Post-Handoff Follow-up',
        content: {
          text: 'The handoff is complete. What are your ongoing responsibilities?',
          scenario: 'Consider how you can support the Customer Success team while maintaining appropriate boundaries.',
          context: 'Successful handoffs include ongoing partnership between Sales and CS.'
        },
        scoring: {
          maxScore: 25,
          criteria: ['Partnership mindset', 'Value continuity', 'Customer success focus']
        }
      }
    ]
  }
};

export default function AcademySimulation() {
  const { user } = useAuth();
  const { workflow } = useParams<{ workflow: string }>();
  const [, setLocation] = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const simulation = simulations[workflow || ''];

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Simulation Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested simulation does not exist.</p>
          <Link href="/academy/dashboard">
            <Button>Back to Academy</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepData = simulation.steps[currentStep];
  const progress = ((currentStep + 1) / simulation.steps.length) * 100;

  const handleAnswer = (stepId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [stepId]: answerId }));
  };

  const handleNext = () => {
    if (currentStep < simulation.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSimulation();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateStepScore = (stepId: string) => {
    const answerId = selectedAnswers[stepId];
    const step = simulation.steps.find(s => s.id === stepId);
    
    if (!step || !answerId || step.type !== 'decision') return 0;
    
    const option = step.content.options?.find(opt => opt.id === answerId);
    return option?.score || 0;
  };

  const completeSimulation = () => {
    let totalScore = 0;
    
    simulation.steps.forEach(step => {
      if (step.type === 'decision') {
        totalScore += calculateStepScore(step.id);
      } else {
        // For non-decision steps, award partial points based on completion
        totalScore += step.scoring.maxScore * 0.8; // Assume 80% completion for interaction steps
      }
    });

    setScore(Math.round(totalScore));
    setIsCompleted(true);
    setShowResults(true);
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setScore(0);
    setIsCompleted(false);
    setShowResults(false);
    setIsPlaying(false);
  };

  if (!isPlaying && !showResults) {
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
              <span className="font-semibold">Simulation</span>
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
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{simulation.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{simulation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{simulation.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{simulation.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Passing Score</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{simulation.steps.length}</div>
                  <div className="text-sm text-muted-foreground">Steps</div>
                </div>
              </div>

              <Button onClick={() => setIsPlaying(true)} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Simulation
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">In this simulation, you will:</h4>
                  <ul className="space-y-2">
                    {simulation.steps.map((step, index) => (
                      <li key={step.id} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span>{step.title}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Scoring Criteria</h4>
                    <p className="text-sm text-muted-foreground">
                      You will be evaluated on your ability to maintain value-focused conversations, 
                      ask discovery questions, and structure solutions around business outcomes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= simulation.passingScore;

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
              <span className="font-semibold">Simulation Results</span>
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
              <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${
                passed ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {passed ? (
                  <CheckCircle className="h-10 w-10" />
                ) : (
                  <XCircle className="h-10 w-10" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {passed ? 'Simulation Passed!' : 'Simulation Not Passed'}
              </h1>
              <p className="text-muted-foreground text-lg">
                Your Score: {score}/{simulation.maxScore} ({Math.round((score / simulation.maxScore) * 100)}%)
              </p>
              <Badge variant={passed ? "default" : "secondary"} className="mt-2">
                {passed ? 'Passing Score' : 'Below Passing Score'}
              </Badge>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {simulation.steps.map((step, index) => {
                    const stepScore = step.type === 'decision' ? calculateStepScore(step.id) : step.scoring.maxScore * 0.8;
                    const stepPercentage = (stepScore / step.scoring.maxScore) * 100;
                    
                    return (
                      <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <div className="text-sm text-muted-foreground">{step.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{Math.round(stepScore)}/{step.scoring.maxScore}</div>
                            <div className="text-sm text-muted-foreground">{Math.round(stepPercentage)}%</div>
                          </div>
                          <Progress value={stepPercentage} className="h-2 w-20" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setLocation('/academy/dashboard')} className="flex-1">
                Back to Academy
              </Button>
              {!passed && (
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
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
            <span className="font-semibold">{simulation.title}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Exit Simulation
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of {simulation.steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="capitalize">{currentStepData.type}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {currentStepData.scoring.maxScore} points
                </div>
              </div>
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Scenario Content */}
                {currentStepData.content.scenario && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Scenario</h4>
                    <p className="text-muted-foreground">{currentStepData.content.scenario}</p>
                  </div>
                )}

                {/* Character Dialogue */}
                {currentStepData.content.character && currentStepData.content.dialogue && (
                  <div className="flex gap-4 p-4 border rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{currentStepData.content.character}</div>
                      <div className="text-muted-foreground">"{currentStepData.content.dialogue}"</div>
                    </div>
                  </div>
                )}

                {/* Context */}
                {currentStepData.content.context && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Context</h4>
                    <p className="text-blue-700">{currentStepData.content.context}</p>
                  </div>
                )}

                {/* Decision Options */}
                {currentStepData.content.options && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Choose your response:</h4>
                    {currentStepData.content.options.map((option) => (
                      <div 
                        key={option.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAnswers[currentStepData.id] === option.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleAnswer(currentStepData.id, option.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-5 w-5 rounded-full border-2 mt-0.5 ${
                            selectedAnswers[currentStepData.id] === option.id 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {selectedAnswers[currentStepData.id] === option.id && (
                              <div className="h-full w-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1">{option.text}</div>
                            <div className="text-sm text-muted-foreground">{option.impact}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructions for non-decision steps */}
                {currentStepData.type !== 'decision' && currentStepData.content.text && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">{currentStepData.content.text}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Step
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={currentStepData.type === 'decision' && !selectedAnswers[currentStepData.id]}
                  >
                    {currentStep === simulation.steps.length - 1 ? (
                      <>Complete Simulation</>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
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
