import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Brain,
  Target,
  Users,
  Lightbulb,
  RefreshCw,
  Rocket,
  Crown,
  Play,
  Lock,
  CheckCircle,
  ArrowRight,
  Gauge,
  GraduationCap
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { LessonPlayer } from "../../features/academy/engine/LessonPlayer";
import { MatrixRoadmap } from "../../features/academy/components/MatrixRoadmap";
import { AIRecommendations } from "../../features/academy/components/AIRecommendations";

interface RoleTrack {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  currentLevel: number;
  totalLevels: number;
  progressPercentage: number;
  isLocked: boolean;
}

interface PillarProgress {
  id: string;
  name: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

export default function AcademyDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Mock data - replace with actual API calls
  const roleTracks: RoleTrack[] = [
    {
      id: 'sales',
      name: 'Sales',
      description: 'Value-guided selling and lifecycle management',
      icon: TrendingUp,
      currentLevel: user?.vosRole === 'Sales' ? 2 : 0,
      totalLevels: 5,
      progressPercentage: user?.vosRole === 'Sales' ? 40 : 0,
      isLocked: false
    },
    {
      id: 'cs',
      name: 'Customer Success',
      description: 'Value realization and expansion strategies',
      icon: Users,
      currentLevel: user?.vosRole === 'CS' ? 1 : 0,
      totalLevels: 5,
      progressPercentage: user?.vosRole === 'CS' ? 20 : 0,
      isLocked: false
    },
    {
      id: 've',
      name: 'Value Engineer',
      description: 'Modeling, governance, and agent orchestration',
      icon: Brain,
      currentLevel: user?.vosRole === 'VE' ? 3 : 0,
      totalLevels: 5,
      progressPercentage: user?.vosRole === 'VE' ? 60 : 0,
      isLocked: false
    },
    {
      id: 'product',
      name: 'Product',
      description: 'KPI-driven roadmaps and instrumentation',
      icon: Lightbulb,
      currentLevel: 0,
      totalLevels: 5,
      progressPercentage: 0,
      isLocked: true
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Value-aligned campaigns and content',
      icon: Rocket,
      currentLevel: 0,
      totalLevels: 5,
      progressPercentage: 0,
      isLocked: true
    },
    {
      id: 'leadership',
      name: 'Leadership',
      description: 'Cross-functional alignment and culture',
      icon: Crown,
      currentLevel: 0,
      totalLevels: 5,
      progressPercentage: 0,
      isLocked: true
    }
  ];

  const pillarProgress: PillarProgress[] = [
    { id: '1', name: 'Unified Value Language', progress: 80, status: 'completed' },
    { id: '2', name: 'Value Data Model Mastery', progress: 60, status: 'in-progress' },
    { id: '3', name: 'Discovery Excellence', progress: 45, status: 'in-progress' },
    { id: '4', name: 'Business Case Development', progress: 30, status: 'in-progress' },
    { id: '5', name: 'Lifecycle Handoffs', progress: 0, status: 'not-started' },
    { id: '6', name: 'Realization Tracking', progress: 0, status: 'not-started' },
    { id: '7', name: 'Expansion Strategy', progress: 0, status: 'not-started' },
    { id: '8', name: 'Cross-Functional Collaboration', progress: 0, status: 'not-started' },
    { id: '9', name: 'AI-Augmented Workflows', progress: 0, status: 'not-started' },
    { id: '10', name: 'Leadership & Culture', progress: 0, status: 'not-started' }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Academy Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">Academy</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Dashboard
            </Link>
            <Link href="/academy/maturity-assessment" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Assessment
            </Link>
            <Link href="/academy/library/prompts" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Prompt Library
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Exit Academy
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to VOS Academy</h1>
            <p className="text-muted-foreground">
              Master the Value Operating System through role-specific learning tracks and hands-on simulations
            </p>
          </div>

          {/* Current Maturity Level */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Your VOS Maturity Level
              </CardTitle>
              <CardDescription>
                Track your progression through the six levels of value operating maturity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-16 w-16 rounded-full ${getMaturityLevelColor(user?.maturityLevel || 0)} flex items-center justify-center text-white font-bold text-2xl`}>
                  L{user?.maturityLevel || 0}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">
                    {getMaturityLevelLabel(user?.maturityLevel || 0)}
                  </div>
                  <Progress value={(user?.maturityLevel || 0) * 20} className="h-2" />
                </div>
                <Button onClick={() => setLocation('/academy/maturity-assessment')}>
                  Retake Assessment
                </Button>
              </div>
              {user?.vosRole ? (
                <Badge variant="secondary" className="text-sm">
                  Role: {user.vosRole}
                </Badge>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Complete your maturity assessment to unlock role-specific tracks
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue Learning */}
          {user?.vosRole && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription>
                  Pick up where you left off in your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div>
                    <div className="font-semibold">Level {user?.maturityLevel || 1}: {getMaturityLevelLabel(user?.maturityLevel || 1)}</div>
                    <div className="text-sm text-muted-foreground">{user?.vosRole} Track</div>
                  </div>
                  <Button onClick={() => setLocation(`/academy/role/${user?.vosRole?.toLowerCase()}/${user?.maturityLevel || 1}`)}>
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI-Powered Recommendations */}
          {user?.vosRole && (
            <div className="mb-8">
              <AIRecommendations
                userRole={user.vosRole}
                maturityLevel={user.maturityLevel || 1}
                completedLessons={[]}
              />
            </div>
          )}

          {/* Role Tracks */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Role-Specific Learning Tracks</h2>
            <p className="text-muted-foreground mb-6">
              Master value operations through your professional lens
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roleTracks.map((track) => {
                const Icon = track.icon;
                return (
                  <Card key={track.id} className={`hover:shadow-lg transition-shadow ${track.isLocked ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {track.isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Badge variant="outline">
                            Level {track.currentLevel}/{track.totalLevels}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{track.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {track.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{track.progressPercentage}%</span>
                          </div>
                          <Progress value={track.progressPercentage} className="h-2" />
                        </div>
                        <Button 
                          className="w-full" 
                          disabled={track.isLocked}
                          onClick={() => setLocation(`/academy/role/${track.id}`)}
                        >
                          {track.isLocked ? (
                            <>Locked</>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Enter Track
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Matrix Roadmap - Personalized Learning Path */}
          <div className="mb-8">
            <MatrixRoadmap
              userProfile={{
                role: "Sales", // TODO: Get from user context
                currentMaturity: 1, // TODO: Get from user progress
              }}
            />
          </div>

          {/* Pillar Progress */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10 VOS Pillars Progress</h2>
            <p className="text-muted-foreground mb-6">
              Track your mastery across the core VOS curriculum
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {pillarProgress.map((pillar) => (
                <Card key={pillar.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mb-2">
                      <div className="h-8 w-8 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <span className="text-sm font-bold text-primary">{pillar.id}</span>
                      </div>
                      <div className="text-sm font-medium mb-1 line-clamp-2">{pillar.name}</div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={pillar.progress} className="h-1" />
                      <Badge variant="outline" className={`text-xs ${getStatusColor(pillar.status)}`}>
                        {pillar.progress}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Prompt Library Node Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Prompt Library
              </CardTitle>
              <CardDescription>
                Access curated prompts for discovery, ROI modeling, and value workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { name: 'Discovery', count: 15, icon: Target },
                  { name: 'ROI Modeling', count: 15, icon: TrendingUp },
                  { name: 'Realization', count: 10, icon: Award },
                  { name: 'Expansion', count: 10, icon: Rocket },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setLocation('/academy/library/prompts')}>
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.count} prompts</div>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setLocation('/academy/library/prompts')} className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Explore Prompt Library
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
