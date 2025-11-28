import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Target,
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  Package,
  Crown,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

interface OnboardingData {
  role: string;
  learningPathPreference: string;
  selfAssessedMaturity: number;
  goals: string[];
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  initialData?: Partial<OnboardingData>;
}

const ROLES = [
  {
    id: "Sales",
    name: "Sales Engineer",
    icon: Briefcase,
    description: "Focus on value-based selling, ROI modeling, and customer outcomes",
    pillars: [1, 3, 4, 6, 7]
  },
  {
    id: "CS",
    name: "Customer Success",
    icon: Users,
    description: "Drive adoption, retention, and expansion through value realization",
    pillars: [1, 5, 6, 7, 8]
  },
  {
    id: "Marketing",
    name: "Marketing",
    icon: Target,
    description: "Create value-driven messaging and data-backed campaigns",
    pillars: [1, 2, 4, 7, 10]
  },
  {
    id: "Product",
    name: "Product Manager",
    icon: Package,
    description: "Build products that deliver measurable customer value",
    pillars: [1, 2, 4, 6, 8]
  },
  {
    id: "Executive",
    name: "Executive Leadership",
    icon: Crown,
    description: "Lead value transformation and build a culture of outcomes",
    pillars: [1, 4, 8, 9, 10]
  },
  {
    id: "VE",
    name: "Value Engineer",
    icon: Wrench,
    description: "Master all aspects of value engineering and VOS implementation",
    pillars: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
];

const LEARNING_PATHS = [
  {
    id: "guided",
    name: "Guided Path",
    description: "Follow a structured curriculum from L0 → L5",
    recommended: true,
    duration: "8-12 weeks"
  },
  {
    id: "role_specific",
    name: "Role-Specific Track",
    description: "Focus on pillars most relevant to your role",
    recommended: false,
    duration: "6-8 weeks"
  },
  {
    id: "self_paced",
    name: "Self-Paced Explorer",
    description: "Choose pillars based on your interests",
    recommended: false,
    duration: "Flexible"
  }
];

const MATURITY_LEVELS = [
  {
    level: 0,
    name: "Value Chaos",
    description: "Reactive problem solving, inconsistent metrics",
    color: "bg-red-500"
  },
  {
    level: 1,
    name: "Ad-hoc/Manual",
    description: "Basic value tracking, manual processes",
    color: "bg-orange-500"
  },
  {
    level: 2,
    name: "Performance Measurement",
    description: "Documented procedures, data-driven decisions",
    color: "bg-yellow-500"
  },
  {
    level: 3,
    name: "Managed/Optimizing",
    description: "Optimized workflows, proactive value management",
    color: "bg-lime-500"
  },
  {
    level: 4,
    name: "Predictive Analytics",
    description: "AI-assisted insights, predictive modeling",
    color: "bg-green-500"
  },
  {
    level: 5,
    name: "Value Orchestration",
    description: "Autonomous value flow, self-optimizing systems",
    color: "bg-teal-600"
  }
];

const GOALS = [
  "Build better business cases",
  "Improve discovery process",
  "Track value realization",
  "Drive customer expansion",
  "Lead value transformation",
  "Certify in VOS methodology"
];

export default function OnboardingWizard({ onComplete, initialData }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Partial<OnboardingData>>({
    role: initialData?.role || "",
    learningPathPreference: initialData?.learningPathPreference || "",
    selfAssessedMaturity: initialData?.selfAssessedMaturity ?? 0,
    goals: initialData?.goals || []
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await onComplete(data as OnboardingData);
      } catch (error) {
        console.error("Onboarding completion error:", error);
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return !!data.role;
      case 3:
        return !!data.learningPathPreference;
      case 4:
        return data.selfAssessedMaturity !== undefined;
      default:
        return false;
    }
  };

  const selectedRole = ROLES.find(r => r.id === data.role);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Welcome to VOS Education Hub</CardTitle>
            <CardDescription>
              Let's personalize your learning journey
            </CardDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">What is VOS?</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    The <strong>Value Operating System</strong> transforms how organizations operate -
                    moving from feature-focused activities to quantifiable value outcomes through 10 comprehensive pillars.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">10 Pillars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive learning path from value language to AI-powered execution
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">6 Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Progress from L0 (Chaos) to L5 (Orchestration) with adaptive content
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <User className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Role-Specific</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Customized curriculum for Sales, CS, Marketing, Product, and more
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">What's your role?</h3>
                <p className="text-muted-foreground">
                  We'll customize your learning experience based on your role
                </p>
              </div>

              <RadioGroup
                value={data.role}
                onValueChange={(value) => setData({ ...data, role: value })}
                className="grid md:grid-cols-2 gap-4"
              >
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Label
                      key={role.id}
                      htmlFor={role.id}
                      className={`flex flex-col cursor-pointer rounded-lg border-2 p-4 hover:bg-accent transition-colors ${
                        data.role === role.id ? 'border-primary bg-accent' : 'border-muted'
                      }`}
                    >
                      <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">{role.name}</div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex gap-1 mt-2">
                            {role.pillars.map(p => (
                              <Badge key={p} variant="secondary" className="text-xs">
                                P{p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Choose your learning path</h3>
                <p className="text-muted-foreground">
                  {selectedRole && `Optimized for ${selectedRole.name}s`}
                </p>
              </div>

              <RadioGroup
                value={data.learningPathPreference}
                onValueChange={(value) => setData({ ...data, learningPathPreference: value })}
                className="space-y-4"
              >
                {LEARNING_PATHS.map((path) => (
                  <Label
                    key={path.id}
                    htmlFor={path.id}
                    className={`flex cursor-pointer rounded-lg border-2 p-4 hover:bg-accent transition-colors ${
                      data.learningPathPreference === path.id ? 'border-primary bg-accent' : 'border-muted'
                    }`}
                  >
                    <RadioGroupItem value={path.id} id={path.id} className="sr-only" />
                    <div className="flex-1 flex items-start gap-4">
                      <div className="mt-1">
                        {data.learningPathPreference === path.id ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{path.name}</span>
                          {path.recommended && (
                            <Badge variant="default" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Estimated: {path.duration}
                        </div>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Current maturity level</h3>
                <p className="text-muted-foreground">
                  Help us understand where you're starting from
                </p>
              </div>

              <RadioGroup
                value={data.selfAssessedMaturity?.toString()}
                onValueChange={(value) => setData({ ...data, selfAssessedMaturity: parseInt(value) })}
                className="space-y-3"
              >
                {MATURITY_LEVELS.map((level) => (
                  <Label
                    key={level.level}
                    htmlFor={`level-${level.level}`}
                    className={`flex cursor-pointer rounded-lg border-2 p-4 hover:bg-accent transition-colors ${
                      data.selfAssessedMaturity === level.level ? 'border-primary bg-accent' : 'border-muted'
                    }`}
                  >
                    <RadioGroupItem value={level.level.toString()} id={`level-${level.level}`} className="sr-only" />
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-full ${level.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                        L{level.level}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{level.name}</div>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {data.selfAssessedMaturity === level.level && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-semibold">What are your primary goals? (Optional)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {GOALS.map((goal) => (
                    <Label
                      key={goal}
                      className="flex items-center gap-2 cursor-pointer rounded-md border p-3 hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={data.goals?.includes(goal)}
                        onCheckedChange={(checked) => {
                          const goals = data.goals || [];
                          if (checked) {
                            setData({ ...data, goals: [...goals, goal] });
                          } else {
                            setData({ ...data, goals: goals.filter(g => g !== goal) });
                          }
                        }}
                      />
                      <span className="text-sm">{goal}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
            >
              {step === totalSteps ? (
                <>{isSubmitting ? "Saving..." : "Start Learning"}</>
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
  );
}
