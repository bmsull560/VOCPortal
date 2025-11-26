import { useParams } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Lock,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  Clock
} from "lucide-react";
import { Link } from "wouter";

interface LevelData {
  level: number;
  title: string;
  description: string;
  objectives: string[];
  modules: number;
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  levels: LevelData[];
}

const roleData: Record<string, RoleData> = {
  sales: {
    id: 'sales',
    name: 'Sales',
    description: 'Master value-guided selling from feature pitching to agentic execution',
    icon: TrendingUp,
    color: 'text-blue-600',
    levels: [
      {
        level: 0,
        title: 'Value Awareness',
        description: 'Transition from feature-focused to outcome-oriented discussions',
        objectives: [
          'Apply Revenue/Cost/Risk framework',
          'Identify customer pains without quantification',
          'Use basic value language in pitches'
        ],
        modules: 3,
        duration: '4 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 1,
        title: 'Value-Guided Selling',
        description: 'Build preliminary Value Trees and ROI models',
        objectives: [
          'Construct basic Value Trees',
          'Integrate discovery into pitches',
          'Facilitate CS handoffs with artifacts'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 2,
        title: 'Lifecycle-Aligned Selling',
        description: 'Integrate full lifecycle elements with benchmarks',
        objectives: [
          'Use benchmarks for deal strength',
          'Conduct end-to-end opportunity management',
          'Collaborate cross-functionally'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 3,
        title: 'AI-Augmented Value Selling',
        description: 'Leverage AI agents for discovery and ROI drafting',
        objectives: [
          'Use AI for discovery prep',
          'Integrate predictive signals',
          'Govern AI outputs'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 4,
        title: 'Agentic Sales Execution',
        description: 'Master agentic orchestration and strategic negotiation',
        objectives: [
          'Orchestrate multi-agent workflows',
          'Use real-time value feeds',
          'Lead value-first culture'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      }
    ]
  },
  cs: {
    id: 'cs',
    name: 'Customer Success',
    description: 'Evolve from activity-based support to autonomous value realization',
    icon: Users,
    color: 'text-green-600',
    levels: [
      {
        level: 0,
        title: 'Early Value Focus',
        description: 'Shift from task focus to basic outcome tracking',
        objectives: [
          'Use unified value language',
          'Identify customer pains manually',
          'Build basic success plans'
        ],
        modules: 3,
        duration: '4 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 1,
        title: 'Structured Realization',
        description: 'Develop structured plans with basic KPIs',
        objectives: [
          'Build Value Trees for plans',
          'Track outcomes manually',
          'Integrate Sales Commits'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 2,
        title: 'Lifecycle Value Ownership',
        description: 'Own full realization with dashboards and QBRs',
        objectives: [
          'Set up dashboards',
          'Perform variance analysis',
          'Model renewal risks'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 3,
        title: 'Predictive & AI-Enhanced CS',
        description: 'Use AI for churn flags and QBR insights',
        objectives: [
          'Implement predictive health scoring',
          'Use AI for QBR preparation',
          'Integrate Fabric alerts'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 4,
        title: 'Autonomous Value Realization',
        description: 'Deploy agentic systems and transition to advisory role',
        objectives: [
          'Orchestrate agent-led telemetry',
          'Build self-updating plans',
          'Foster outcome culture'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      }
    ]
  },
  ve: {
    id: 've',
    name: 'Value Engineer',
    description: 'Advance from basic modeling to agentic system orchestration',
    icon: Brain,
    color: 'text-purple-600',
    levels: [
      {
        level: 0,
        title: 'KPI Awareness',
        description: 'Define measurable outcomes and introduce instrumentation',
        objectives: [
          'Identify outcome metrics',
          'Link features to KPIs',
          'Discuss instrumentation needs'
        ],
        modules: 3,
        duration: '4 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 1,
        title: 'Value-Guided Roadmapping',
        description: 'Tie roadmaps to Value Trees and measure impact',
        objectives: [
          'Construct Value Trees',
          'Measure feature impact',
          'Align roadmaps'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: false,
        isCompleted: false,
        progress: 0
      },
      {
        level: 2,
        title: 'Advanced Modeling & Governance',
        description: 'Implement governance and advanced modeling techniques',
        objectives: [
          'Apply advanced modeling',
          'Implement governance reviews',
          'Ensure model integrity'
        ],
        modules: 4,
        duration: '5 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 3,
        title: 'AI-Enhanced Modeling',
        description: 'Use AI for modeling automation and validation',
        objectives: [
          'Deploy AI modeling agents',
          'Automate validation',
          'Enhance explainability'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      },
      {
        level: 4,
        title: 'Agentic System Architecture',
        description: 'Master multi-agent orchestration and system ownership',
        objectives: [
          'Orchestrate multi-agent systems',
          'Maintain system integrity',
          'Drive continuous improvement'
        ],
        modules: 5,
        duration: '6 hours',
        isLocked: true,
        isCompleted: false,
        progress: 0
      }
    ]
  }
};

export default function RoleTrack() {
  const { user } = useAuth();
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();

  const currentRole = roleData[role || ''];
  
  if (!currentRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Role Track Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested role track does not exist.</p>
          <Link href="/academy/dashboard">
            <Button>Back to Academy</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = currentRole.icon;
  const userLevel = user?.vosRole === currentRole.name ? (user?.maturityLevel || 0) : 0;

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
            <Icon className={`h-5 w-5 ${currentRole.color}`} />
            <span className="font-semibold">{currentRole.name} Track</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Back to Academy
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Role Header */}
          <div className="mb-8">
            <Link href="/academy/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className={`h-8 w-8 ${currentRole.color}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentRole.name} Track</h1>
                <p className="text-muted-foreground text-lg">{currentRole.description}</p>
              </div>
            </div>
            {user?.vosRole === currentRole.name && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  Your Current Level: {userLevel}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {userLevel === 0 ? 'Just Getting Started' : 
                   userLevel === 1 ? 'Building Foundations' :
                   userLevel === 2 ? 'Advancing Skills' :
                   userLevel === 3 ? 'Intermediate Level' :
                   userLevel === 4 ? 'Advanced Practitioner' : 'Expert Level'}
                </Badge>
              </div>
            )}
          </div>

          {/* Levels Ladder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            <p className="text-muted-foreground">
              Progress through each level to master {currentRole.name} capabilities
            </p>
            
            {currentRole.levels.map((levelData, index) => {
              const isActive = userLevel >= levelData.level;
              const isCurrentLevel = userLevel === levelData.level;
              const isNextLevel = userLevel + 1 === levelData.level;
              
              return (
                <Card key={levelData.level} className={`transition-all ${isCurrentLevel ? 'ring-2 ring-primary' : ''} ${!isActive && !isNextLevel ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${
                          levelData.isCompleted ? 'bg-green-500' :
                          isCurrentLevel ? 'bg-blue-500' :
                          isActive ? 'bg-gray-500' :
                          'bg-gray-300'
                        }`}>
                          {levelData.isCompleted ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            `L${levelData.level}`
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {levelData.title}
                            {isCurrentLevel && <Badge variant="secondary">Current</Badge>}
                            {levelData.isCompleted && <Badge variant="default">Completed</Badge>}
                          </CardTitle>
                          <CardDescription className="text-base mt-2">
                            {levelData.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <BookOpen className="h-4 w-4" />
                          {levelData.modules} modules
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {levelData.duration}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Learning Objectives */}
                      <div>
                        <h4 className="font-medium mb-2">Learning Objectives</h4>
                        <ul className="space-y-1">
                          {levelData.objectives.map((objective, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-primary" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Progress */}
                      {isActive && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{levelData.progress}%</span>
                          </div>
                          <Progress value={levelData.progress} className="h-2" />
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex gap-2 pt-2">
                        {levelData.isCompleted ? (
                          <Button variant="outline" className="flex-1" onClick={() => setLocation(`/academy/role/${role}/${levelData.level}`)}>
                            <Award className="h-4 w-4 mr-2" />
                            Review Level
                          </Button>
                        ) : isCurrentLevel || isNextLevel ? (
                          <Button className="flex-1" onClick={() => setLocation(`/academy/role/${role}/${levelData.level}`)}>
                            <Play className="h-4 w-4 mr-2" />
                            {isCurrentLevel ? 'Continue Learning' : 'Start Level'}
                          </Button>
                        ) : (
                          <Button variant="outline" className="flex-1" disabled>
                            <Lock className="h-4 w-4 mr-2" />
                            Locked - Complete Previous Level
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Track Overview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Track Overview</CardTitle>
              <CardDescription>
                Complete all {currentRole.levels.length} levels to become a VOS {currentRole.name} expert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {currentRole.levels.reduce((sum, level) => sum + level.modules, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {currentRole.levels.reduce((sum, level) => {
                      const hours = parseInt(level.duration.split(' ')[0]);
                      return sum + hours;
                    }, 0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {currentRole.levels.filter(level => level.isCompleted).length}/{currentRole.levels.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Levels Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
