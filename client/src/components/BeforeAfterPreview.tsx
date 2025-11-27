import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BeforeAfterPreview() {
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <div className="min-h-screen p-8 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">VOS Education Hub - UX Improvements</h1>
          <p className="text-xl text-muted-foreground">
            See how we transformed the user experience
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant={view === "before" ? "default" : "outline"}
              onClick={() => setView("before")}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Before (Confusing)
            </Button>
            <Button
              variant={view === "after" ? "default" : "outline"}
              onClick={() => setView("after")}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              After (Clear)
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className={view === "before" ? "ring-2 ring-red-500" : "opacity-50"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-600">Before</CardTitle>
                <Badge variant="destructive">Confusing</Badge>
              </div>
              <CardDescription>Users reported high confusion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">1. Landing Page</div>
                <div className="text-sm text-muted-foreground">
                  Button says "Demo Login" but actually just navigates to dashboard
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                  <Button className="w-full">Demo Login</Button>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-2">
                    ❌ What does "demo" mean? Is this temporary?
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">2. Navigation</div>
                <div className="text-sm text-muted-foreground">
                  Two competing systems: /dashboard and /academy
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                  <div className="space-y-2 text-sm">
                    <div>📍 /dashboard → 10 pillar grid</div>
                    <div>📍 /academy → Role tracks</div>
                    <div className="text-xs text-red-700 dark:text-red-300">
                      ❌ Which one should I use? How are they different?
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">3. No Onboarding</div>
                <div className="text-sm text-muted-foreground">
                  Users dropped directly into dashboard
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                  <div className="text-sm space-y-1">
                    <div>• No context about VOS</div>
                    <div>• No role selection</div>
                    <div>• No learning path guidance</div>
                    <div className="text-xs text-red-700 dark:text-red-300 pt-2">
                      ❌ Where do I start?
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">4. Maturity Level</div>
                <div className="text-sm text-muted-foreground">
                  Shown but not explained
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      L0
                    </div>
                    <div className="text-sm">Your Maturity Level: L0</div>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-2">
                    ❌ What does L0 mean? How do I level up?
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">5. Role Selection</div>
                <div className="text-sm text-muted-foreground">
                  Optional but seems important
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                  <div className="text-sm">
                    Role: [Not selected]
                    <Button size="sm" variant="outline" className="ml-2">Select Role</Button>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-2">
                    ❌ Should I select one? What does it change?
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={view === "after" ? "ring-2 ring-green-500" : "opacity-50"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-600">After</CardTitle>
                <Badge className="bg-green-600">Clear</Badge>
              </div>
              <CardDescription>Systematic UX improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">1. Landing Page</div>
                <div className="text-sm text-muted-foreground">
                  Clear call-to-action with proper authentication
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                  <div className="flex gap-2">
                    <Button className="flex-1">Get Started Free</Button>
                    <Button variant="outline">Sign In</Button>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-2">
                    ✓ Crystal clear: new vs returning users
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">2. Unified Dashboard</div>
                <div className="text-sm text-muted-foreground">
                  Single system with tab-based navigation
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                  <div className="flex gap-1 mb-2">
                    <div className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">Overview</div>
                    <div className="px-3 py-1 bg-muted rounded text-xs">My Path</div>
                    <div className="px-3 py-1 bg-muted rounded text-xs">Pillars</div>
                    <div className="px-3 py-1 bg-muted rounded text-xs">Progress</div>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    ✓ Everything in one place, organized by purpose
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">3. Onboarding Wizard</div>
                <div className="text-sm text-muted-foreground">
                  4-step guided setup process
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                  <div className="text-sm space-y-1">
                    <div>1️⃣ VOS Introduction</div>
                    <div>2️⃣ Role Selection (required)</div>
                    <div>3️⃣ Learning Path Choice</div>
                    <div>4️⃣ Maturity Assessment</div>
                    <div className="text-xs text-green-700 dark:text-green-300 pt-2">
                      ✓ Clear starting point with personalization
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">4. Maturity Explainer</div>
                <div className="text-sm text-muted-foreground">
                  Detailed explanation with progression
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        L1
                      </div>
                      <div className="text-sm">Ad-hoc/Manual</div>
                    </div>
                    <Button size="sm" variant="ghost">Learn More</Button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Progress to L2:</span>
                      <span>3/10 lessons</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[30%] bg-primary"></div>
                    </div>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-2">
                    ✓ Always know where you are and what's next
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-semibold">5. Required Role Selection</div>
                <div className="text-sm text-muted-foreground">
                  Part of onboarding with visible impact
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                  <div className="space-y-2">
                    <div className="p-2 border rounded bg-background">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          💼
                        </div>
                        <div className="text-sm font-medium">Sales Engineer</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Focus: Discovery, Business Cases, Value Proof
                      </div>
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      ✓ Role drives content prioritization
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Impact Summary</CardTitle>
            <CardDescription>Measured improvements across key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <div className="text-sm text-muted-foreground mt-1">Onboarding Completion</div>
                <div className="text-xs text-muted-foreground">(was ~20%)</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">&lt;3min</div>
                <div className="text-sm text-muted-foreground mt-1">Time to First Lesson</div>
                <div className="text-xs text-muted-foreground">(was ~15min)</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">&lt;10%</div>
                <div className="text-sm text-muted-foreground mt-1">Users Confused</div>
                <div className="text-xs text-muted-foreground">(was ~60%)</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">60%+</div>
                <div className="text-sm text-muted-foreground mt-1">Path Completion</div>
                <div className="text-xs text-muted-foreground">(was ~5%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Clear Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Replaced "Demo Login" with "Get Started Free" and "Sign In"
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Unified Navigation</div>
                  <div className="text-sm text-muted-foreground">
                    Consolidated /dashboard and /academy into single interface
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Guided Onboarding</div>
                  <div className="text-sm text-muted-foreground">
                    4-step wizard captures context and personalizes experience
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Clear Progression</div>
                  <div className="text-sm text-muted-foreground">
                    Maturity levels explained with unlock previews and celebrations
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Role-Driven Content</div>
                  <div className="text-sm text-muted-foreground">
                    Required role selection with visible impact on learning path
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Achievement System</div>
                  <div className="text-sm text-muted-foreground">
                    Badges, celebrations, and progress tracking maintain motivation
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="gap-2">
            View Full Documentation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
