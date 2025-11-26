import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowRight, BookOpen, TrendingUp, Users, Award, Brain, Target } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button>Demo Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="vos-gradient text-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master the Value Operating System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Transform from feature-focused operations to quantifiable value outcomes through our comprehensive 10-pillar training program
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Continue Learning <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Demo Login <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why VOS Education Hub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive learning platform designed to elevate your value delivery capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>10 Comprehensive Pillars</CardTitle>
                <CardDescription>
                  Structured learning path from foundational value language to advanced AI-powered execution
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Maturity-Based Progression</CardTitle>
                <CardDescription>
                  Adaptive content that evolves with your skill level from Level 0 (Chaos) to Level 5 (Orchestration)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Role-Specific Tracks</CardTitle>
                <CardDescription>
                  Customized curriculum for Sales, CS, Marketing, Product, Executive Leadership, and Value Engineering
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Certification System</CardTitle>
                <CardDescription>
                  Earn role-specific badges with 80%+ pass rate and demonstrate your value expertise
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Tutor</CardTitle>
                <CardDescription>
                  Personalized guidance and adaptive learning powered by advanced generative UI technology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Practical Application</CardTitle>
                <CardDescription>
                  Interactive quizzes, simulations, and real-world scenarios to reinforce learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Maturity Model Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">VOS Maturity Model</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Progress through six levels of value operating maturity
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <img 
              src="/assets/VOSMaturityModelProgressionChart.jpeg" 
              alt="VOS Maturity Model Progression" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="maturity-0">
              <CardHeader>
                <CardTitle>Level 0: Value Chaos</CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300">
                  Reactive problem solving, inconsistent metrics, no standards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="maturity-2">
              <CardHeader>
                <CardTitle>Level 2: Value Alignment</CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  Performance measurement, documented procedures, data-driven decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="maturity-5">
              <CardHeader>
                <CardTitle>Level 5: Value Orchestration</CardTitle>
                <CardDescription className="text-teal-700 dark:text-teal-300">
                  Autonomous value flow, AI-driven orchestration, self-optimizing systems
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 vos-gradient text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Value Delivery?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join professionals from leading organizations who are mastering the Value Operating System
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Go to Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Demo Login <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 VOS Education Hub. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground">
                Resources
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About VOS</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
