import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
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
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  Trophy,
  Zap
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function UnifiedDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: pillars, isLoading: pillarsLoading } = trpc.pillars.list.useQuery();

  if (!loading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (loading || pillarsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  const pillarIcons = [
    BookOpen, Target, Lightbulb, TrendingUp, RefreshCw,
    Award, Rocket, Users, Brain, Crown
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
      "L1: Ad-hoc/Manual",
      "L2: Performance Measurement",
      "L3: Managed/Optimizing",
      "L4: Predictive Analytics",
      "L5: Value Orchestration"
    ];
    return labels[level] || "Unknown";
  };

  const nextLesson = pillars?.[0];
  const completedPillars: number[] = [];
  const currentPillar = 1;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/resources">
              <Button variant="ghost">Resources</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Continue your Value Operating System learning journey
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learning-path">My Path</TabsTrigger>
              <TabsTrigger value="all-pillars">All Pillars</TabsTrigger>
              <TabsTrigger value="achievements">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-16 w-16 rounded-full ${getMaturityLevelColor(user?.maturityLevel || 0)} flex items-center justify-center text-white font-bold text-2xl`}>
                        L{user?.maturityLevel || 0}
                      </div>
                      <div>
                        <CardTitle>Your VOS Maturity Level</CardTitle>
                        <CardDescription>
                          {getMaturityLevelLabel(user?.maturityLevel || 0)}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={(user?.maturityLevel || 0) * 20} className="h-2 mb-4" />
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{completedPillars.length}/10 Pillars completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>15 hours learning time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span>3 certifications earned</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Next Steps
                  </CardTitle>
                  <CardDescription>
                    Recommended actions to continue your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Continue: {nextLesson?.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {nextLesson?.description}
                          </p>
                          <Badge variant="secondary">Pillar {nextLesson?.pillarNumber}</Badge>
                        </div>
                      </div>
                      <Link href={`/pillar/${nextLesson?.pillarNumber}`}>
                        <Button>
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">Take Maturity Assessment</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Update your maturity level based on recent learning
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">Earn Your First Badge</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Complete Pillar 1 quiz with 80%+ to earn certification
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-muted-foreground">2 hours ago</span>
                      <span>Completed lesson: Value Language Fundamentals</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">1 day ago</span>
                      <span>Started Pillar 1: Unified Value Language</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span className="text-muted-foreground">2 days ago</span>
                      <span>Completed onboarding as Sales Engineer</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learning-path" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Path</CardTitle>
                  <CardDescription>
                    {user?.vosRole ? `${user.vosRole}-focused curriculum` : 'Guided sequential path'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pillars?.slice(0, 5).map((pillar, index) => {
                      const Icon = pillarIcons[index];
                      const isCompleted = completedPillars.includes(pillar.pillarNumber);
                      const isCurrent = currentPillar === pillar.pillarNumber;
                      const isLocked = pillar.pillarNumber > currentPillar + 1;

                      return (
                        <div
                          key={pillar.id}
                          className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                            isCurrent ? 'border-primary bg-primary/5' :
                            isCompleted ? 'border-green-500/50 bg-green-500/5' :
                            isLocked ? 'border-muted bg-muted/30 opacity-60' :
                            'border-muted hover:border-muted-foreground'
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isCurrent ? 'bg-primary text-primary-foreground' :
                            isLocked ? 'bg-muted' :
                            'bg-muted'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : isLocked ? (
                              <Lock className="h-6 w-6" />
                            ) : (
                              <Icon className="h-6 w-6" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{pillar.title}</h3>
                              {isCurrent && <Badge>Current</Badge>}
                              {isCompleted && <Badge variant="secondary">Completed</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {pillar.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Target: L{pillar.targetMaturityLevel}</span>
                              <span>{pillar.duration}</span>
                            </div>
                          </div>

                          {!isLocked && (
                            <Link href={`/pillar/${pillar.pillarNumber}`}>
                              <Button variant={isCurrent ? "default" : "outline"} size="sm">
                                {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                              </Button>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {user?.vosRole && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            {user.vosRole} Focus
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            This learning path is optimized for {user.vosRole} professionals,
                            prioritizing pillars most relevant to your role.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all-pillars" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars?.map((pillar, index) => {
                  const Icon = pillarIcons[index] || BookOpen;

                  return (
                    <Card key={pillar.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant="outline">Pillar {pillar.pillarNumber}</Badge>
                        </div>
                        <CardTitle className="text-lg">{pillar.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {pillar.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Target Level:</span>
                            <Badge variant="secondary">L{pillar.targetMaturityLevel}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">{pillar.duration}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Link href={`/pillar/${pillar.pillarNumber}`} className="flex-1">
                              <Button variant="outline" className="w-full">Learn</Button>
                            </Link>
                            <Link href={`/quiz/${pillar.pillarNumber}`} className="flex-1">
                              <Button className="w-full">Quiz</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold">First Steps</h4>
                          <p className="text-sm text-muted-foreground">Completed onboarding</p>
                        </div>
                      </div>

                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Complete more pillars to earn achievements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Pass pillar quizzes with 80%+ to earn certifications</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {completedPillars.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Pillars Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">15</div>
                      <div className="text-sm text-muted-foreground">Hours Learning</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">85%</div>
                      <div className="text-sm text-muted-foreground">Avg Quiz Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">7</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 VOS Education Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground">
                Resources
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground">About VOS</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
