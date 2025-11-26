import { useParams } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  TrendingUp, 
  Users,
  Brain,
  Lightbulb,
  Rocket,
  Crown,
  ArrowLeft,
  Play,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  Clock,
  Video,
  FileText,
  Download,
  MessageSquare,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

interface Module {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz' | 'simulation';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
}

interface LevelContent {
  level: number;
  title: string;
  description: string;
  objectives: string[];
  modules: Module[];
  quiz: {
    id: string;
    title: string;
    questions: number;
    passingScore: number;
    attempts: number;
    bestScore?: number;
    passed?: boolean;
  };
  simulation?: {
    id: string;
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    score?: number;
  };
}

const levelContent: Record<string, Record<number, LevelContent>> = {
  sales: {
    0: {
      level: 0,
      title: 'Value Awareness',
      description: 'Transition from feature-focused to outcome-oriented discussions',
      objectives: [
        'Apply Revenue/Cost/Risk framework',
        'Identify customer pains without quantification',
        'Use basic value language in pitches'
      ],
      modules: [
        {
          id: 'sales-0-1',
          title: 'Introduction to Value Selling',
          description: 'Learn the fundamentals of value-based selling',
          type: 'video',
          duration: '45 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        },
        {
          id: 'sales-0-2',
          title: 'Revenue/Cost/Risk Framework',
          description: 'Master the core value framework',
          type: 'interactive',
          duration: '60 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        },
        {
          id: 'sales-0-3',
          title: 'Basic Value Language',
          description: 'Practice using value-focused language',
          type: 'reading',
          duration: '30 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        }
      ],
      quiz: {
        id: 'sales-0-quiz',
        title: 'Value Awareness Assessment',
        questions: 10,
        passingScore: 80,
        attempts: 0
      }
    },
    1: {
      level: 1,
      title: 'Value-Guided Selling',
      description: 'Build preliminary Value Trees and ROI models',
      objectives: [
        'Construct basic Value Trees',
        'Integrate discovery into pitches',
        'Facilitate CS handoffs with artifacts'
      ],
      modules: [
        {
          id: 'sales-1-1',
          title: 'Building Value Trees',
          description: 'Learn to construct effective Value Trees',
          type: 'interactive',
          duration: '75 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        },
        {
          id: 'sales-1-2',
          title: 'ROI Modeling Basics',
          description: 'Introduction to ROI calculations',
          type: 'video',
          duration: '50 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        },
        {
          id: 'sales-1-3',
          title: 'Discovery Integration',
          description: 'Integrate discovery into sales process',
          type: 'simulation',
          duration: '45 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        },
        {
          id: 'sales-1-4',
          title: 'CS Handoff Best Practices',
          description: 'Effective customer success handoffs',
          type: 'reading',
          duration: '30 min',
          isCompleted: false,
          isLocked: false,
          progress: 0
        }
      ],
      quiz: {
        id: 'sales-1-quiz',
        title: 'Value-Guided Selling Assessment',
        questions: 12,
        passingScore: 80,
        attempts: 0
      },
      simulation: {
        id: 'sales-1-sim',
        title: 'Discovery Call Simulation',
        description: 'Practice a value-focused discovery call',
        duration: '30 min',
        completed: false
      }
    }
  }
};

export default function RoleLevel() {
  const { user } = useAuth();
  const { role, level } = useParams<{ role: string; level: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('modules');

  const currentLevel = levelContent[role || '']?.[parseInt(level || '0')];
  
  if (!currentLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Level Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested level does not exist.</p>
          <Link href="/academy/dashboard">
            <Button>Back to Academy</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'reading': return FileText;
      case 'interactive': return Target;
      case 'quiz': return Award;
      case 'simulation': return Brain;
      default: return BookOpen;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-600';
      case 'reading': return 'text-green-600';
      case 'interactive': return 'text-purple-600';
      case 'quiz': return 'text-orange-600';
      case 'simulation': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const completedModules = currentLevel.modules.filter(m => m.isCompleted).length;
  const totalModules = currentLevel.modules.length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

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
            <Link href={`/academy/role/${role}`} className="text-muted-foreground hover:text-foreground">
              {role?.toUpperCase()} Track
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <span className="font-semibold">Level {currentLevel.level}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href={`/academy/role/${role}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Back to Track
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Level Header */}
          <div className="mb-8">
            <Link href={`/academy/role/${role}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {role?.toUpperCase()} Track
            </Link>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{currentLevel.title}</h1>
                <p className="text-muted-foreground text-lg">{currentLevel.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary mb-1">{overallProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Learning Objectives */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLevel.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modules">Learning Modules</TabsTrigger>
              <TabsTrigger value="quiz">Assessment</TabsTrigger>
              {currentLevel.simulation && (
                <TabsTrigger value="simulation">Simulation</TabsTrigger>
              )}
            </TabsList>

            {/* Learning Modules */}
            <TabsContent value="modules" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {currentLevel.modules.map((module, index) => {
                  const Icon = getModuleIcon(module.type);
                  const colorClass = getModuleColor(module.type);
                  
                  return (
                    <Card key={module.id} className={`transition-all ${module.isCompleted ? 'bg-green-50 border-green-200' : ''} ${module.isLocked ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                              <Icon className={`h-6 w-6 ${colorClass}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{module.title}</h3>
                                {module.isCompleted && (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {module.duration}
                                </div>
                                <Badge variant="outline" className="capitalize">
                                  {module.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {module.progress > 0 && (
                              <div className="text-right">
                                <div className="text-sm font-medium">{module.progress}%</div>
                                <Progress value={module.progress} className="h-1 w-20" />
                              </div>
                            )}
                            <Button 
                              disabled={module.isLocked}
                              onClick={() => {
                                // Handle module navigation
                                console.log(`Navigate to module: ${module.id}`);
                              }}
                            >
                              {module.isLocked ? (
                                <>Locked</>
                              ) : module.isCompleted ? (
                                <>Review</>
                              ) : module.progress > 0 ? (
                                <>Continue</>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Quiz */}
            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {currentLevel.quiz.title}
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge with {currentLevel.quiz.questions} questions. Passing score: {currentLevel.quiz.passingScore}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">{currentLevel.quiz.questions}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">{currentLevel.quiz.passingScore}%</div>
                        <div className="text-sm text-muted-foreground">Passing Score</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">{currentLevel.quiz.attempts}</div>
                        <div className="text-sm text-muted-foreground">Attempts</div>
                      </div>
                    </div>

                    {currentLevel.quiz.bestScore && (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {currentLevel.quiz.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                          )}
                          <div>
                            <div className="font-medium">Best Score: {currentLevel.quiz.bestScore}%</div>
                            <div className="text-sm text-muted-foreground">
                              {currentLevel.quiz.passed ? 'Quiz passed!' : 'Try again to improve your score'}
                            </div>
                          </div>
                        </div>
                        <Badge variant={currentLevel.quiz.passed ? "default" : "secondary"}>
                          {currentLevel.quiz.passed ? "Passed" : "Not Passed"}
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          // Navigate to quiz
                          console.log(`Navigate to quiz: ${currentLevel.quiz.id}`);
                        }}
                      >
                        {currentLevel.quiz.attempts > 0 ? (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            Retake Quiz
                          </>
                        ) : (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            Start Quiz
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Simulation */}
            {currentLevel.simulation && (
              <TabsContent value="simulation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {currentLevel.simulation.title}
                    </CardTitle>
                    <CardDescription>
                      {currentLevel.simulation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentLevel.simulation.duration}
                        </div>
                        <Badge variant="outline">
                          {currentLevel.simulation.completed ? 'Completed' : 'Not Started'}
                        </Badge>
                      </div>

                      {currentLevel.simulation.score && (
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Best Score: {currentLevel.simulation.score}%</div>
                              <div className="text-sm text-muted-foreground">
                                {currentLevel.simulation.score >= 80 ? 'Excellent performance!' : 'Keep practicing to improve'}
                              </div>
                            </div>
                          </div>
                          <Badge variant={currentLevel.simulation.score >= 80 ? "default" : "secondary"}>
                            {currentLevel.simulation.score >= 80 ? "Passed" : "Needs Improvement"}
                          </Badge>
                        </div>
                      )}

                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Navigate to simulation
                          console.log(`Navigate to simulation: ${currentLevel.simulation?.id}`);
                        }}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {currentLevel.simulation.completed ? 'Practice Again' : 'Start Simulation'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
