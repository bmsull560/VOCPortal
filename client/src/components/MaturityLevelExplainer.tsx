import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, TrendingUp, CheckCircle2, Info } from "lucide-react";

interface MaturityLevelExplainerProps {
  currentLevel: number;
  completedLessons?: number;
  requiredLessons?: number;
  nextLevelUnlocks?: string[];
}

const MATURITY_LEVELS = [
  {
    level: 0,
    name: "Value Chaos",
    description: "Reactive problem solving, inconsistent metrics, no standards",
    color: "bg-red-500",
    skills: [
      "Basic awareness of value concepts",
      "Understanding customer pain points",
      "Initial exposure to value terminology"
    ],
    behaviors: [
      "Feature-focused conversations",
      "Inconsistent value documentation",
      "Reactive to customer requests"
    ]
  },
  {
    level: 1,
    name: "Ad-hoc/Manual",
    description: "Basic value tracking with manual processes",
    color: "bg-orange-500",
    skills: [
      "Document basic value hypotheses",
      "Create simple ROI calculations",
      "Track initial success metrics"
    ],
    behaviors: [
      "Asking value-focused questions",
      "Manual tracking of outcomes",
      "Inconsistent value language"
    ]
  },
  {
    level: 2,
    name: "Performance Measurement",
    description: "Documented procedures and data-driven decisions",
    color: "bg-yellow-500",
    skills: [
      "Build comprehensive business cases",
      "Use standardized value frameworks",
      "Track leading and lagging indicators"
    ],
    behaviors: [
      "Consistent value discovery",
      "Data-driven recommendations",
      "Cross-functional collaboration"
    ]
  },
  {
    level: 3,
    name: "Managed/Optimizing",
    description: "Optimized workflows and proactive value management",
    color: "bg-lime-500",
    skills: [
      "Optimize value delivery workflows",
      "Benchmark against industry standards",
      "Lead value transformation initiatives"
    ],
    behaviors: [
      "Proactive value monitoring",
      "Continuous process improvement",
      "Value-first culture building"
    ]
  },
  {
    level: 4,
    name: "Predictive Analytics",
    description: "AI-assisted insights and predictive modeling",
    color: "bg-green-500",
    skills: [
      "Leverage AI for value insights",
      "Build predictive value models",
      "Automate value workflows"
    ],
    behaviors: [
      "Predictive customer success",
      "AI-augmented decision making",
      "Advanced analytics utilization"
    ]
  },
  {
    level: 5,
    name: "Value Orchestration",
    description: "Autonomous value flow and self-optimizing systems",
    color: "bg-teal-600",
    skills: [
      "Design autonomous value systems",
      "Orchestrate cross-platform value",
      "Lead industry value innovation"
    ],
    behaviors: [
      "Self-optimizing value delivery",
      "Real-time value orchestration",
      "Thought leadership in VOS"
    ]
  }
];

export default function MaturityLevelExplainer({
  currentLevel,
  completedLessons = 0,
  requiredLessons = 10,
  nextLevelUnlocks = []
}: MaturityLevelExplainerProps) {
  const currentMaturity = MATURITY_LEVELS[currentLevel];
  const nextMaturity = MATURITY_LEVELS[currentLevel + 1];
  const progress = (completedLessons / requiredLessons) * 100;

  const defaultUnlocks = nextMaturity ? [
    `${nextMaturity.name} content and lessons`,
    "Advanced quiz questions",
    "Role-specific simulations",
    `Level ${currentLevel + 1} certification badge`
  ] : [];

  const unlocks = nextLevelUnlocks.length > 0 ? nextLevelUnlocks : defaultUnlocks;

  return (
    <Card className="maturity-explainer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full ${currentMaturity.color} flex items-center justify-center text-white font-bold text-2xl`}>
              L{currentLevel}
            </div>
            <div>
              <CardTitle>Current Level: L{currentLevel}</CardTitle>
              <CardDescription>{currentMaturity.name}</CardDescription>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>VOS Maturity Model</DialogTitle>
                <DialogDescription>
                  Progress through six levels of value operating maturity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {MATURITY_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`p-4 rounded-lg border-2 ${
                      level.level === currentLevel ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-full ${level.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        L{level.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{level.name}</h3>
                          {level.level === currentLevel && <Badge>Current</Badge>}
                          {level.level < currentLevel && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          {level.level > currentLevel && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Key Skills:</h4>
                            <ul className="text-sm space-y-1">
                              {level.skills.map((skill, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{skill}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Behaviors:</h4>
                            <ul className="text-sm space-y-1">
                              {level.behaviors.map((behavior, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{behavior}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Progress to next level</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lessons completed for this level:</span>
            <span className="font-medium">{completedLessons}/{requiredLessons}</span>
          </div>

          {nextMaturity && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Reach L{currentLevel + 1} to unlock:</p>
              </div>
              <ul className="text-sm space-y-2">
                {unlocks.map((unlock, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span>{unlock}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!nextMaturity && (
            <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-md border border-teal-200 dark:border-teal-900">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
                <p className="font-medium text-teal-900 dark:text-teal-100">
                  Maximum Level Achieved!
                </p>
              </div>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                You've reached the highest maturity level. Continue learning to maintain mastery.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
