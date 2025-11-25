import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Crown
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch all pillars
  const { data: pillars, isLoading: pillarsLoading } = trpc.pillars.list.useQuery();

  // Redirect to login if not authenticated
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
    BookOpen,    // 1: Unified Value Language
    Target,      // 2: Value Data Model Mastery
    Lightbulb,   // 3: Discovery Excellence
    TrendingUp,  // 4: Business Case Development
    RefreshCw,   // 5: Lifecycle Handoffs & Governance
    Award,       // 6: Realization Tracking & Value Proof
    Rocket,      // 7: Expansion & Benchmarking Strategy
    Users,       // 8: Cross-Functional Collaboration Patterns
    Brain,       // 9: AI-Augmented Value Workflows
    Crown        // 10: Leadership & Culture of Value
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

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Dashboard
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Resources
            </Link>
            <Link href="/profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Continue your Value Operating System learning journey
            </p>
          </div>

          {/* Maturity Level Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
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
              </div>
              {user?.vosRole ? (
                <Badge variant="secondary" className="text-sm">
                  Role: {user.vosRole}
                </Badge>
              ) : (
                <Link href="/profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  Select Your Role
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Pillars Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">10 VOS Pillars</h2>
            <p className="text-muted-foreground mb-6">
              Master each pillar to advance your value engineering capabilities
            </p>
          </div>

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
                      <Badge variant="outline">
                        Pillar {pillar.pillarNumber}
                      </Badge>
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
                        <Badge variant="secondary">
                          L{pillar.targetMaturityLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{pillar.duration}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link href={`/pillar/${pillar.pillarNumber}`} className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                          Learn
                        </Link>
                        <Link href={`/quiz/${pillar.pillarNumber}`} className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
                          Take Quiz
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
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
              <a href="#" className="text-muted-foreground hover:text-foreground">
                About VOS
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
