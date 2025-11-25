import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { User, Briefcase, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const [selectedRole, setSelectedRole] = useState<string>(user?.vosRole || "");
  const [selectedLevel, setSelectedLevel] = useState<number>(user?.maturityLevel || 0);

  const updateRoleMutation = trpc.user.updateVosRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully!");
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  const updateMaturityMutation = trpc.user.updateMaturityLevel.useMutation({
    onSuccess: () => {
      toast.success("Maturity level updated successfully!");
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update maturity level: ${error.message}`);
    }
  });

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleRoleUpdate = () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    updateRoleMutation.mutate({ 
      vosRole: selectedRole as "Sales" | "CS" | "Marketing" | "Product" | "Executive" | "VE"
    });
  };

  const handleMaturityUpdate = () => {
    updateMaturityMutation.mutate({ level: selectedLevel });
  };

  const roleDescriptions = {
    Sales: "Focus on value discovery, business case development, and deal progression",
    CS: "Emphasize value realization, expansion opportunities, and customer success metrics",
    Marketing: "Learn value messaging, campaign ROI, and market positioning",
    Product: "Master product-value alignment, feature prioritization, and roadmap planning",
    Executive: "Develop strategic value leadership, culture building, and organizational transformation",
    VE: "Comprehensive value engineering across all lifecycle stages and functions"
  };

  const maturityLevels = [
    {
      level: 0,
      label: "L0: Value Chaos",
      description: "Reactive problem-solving, inconsistent metrics, no standards",
      color: "bg-red-500"
    },
    {
      level: 1,
      label: "L1: Ad-hoc/Manual",
      description: "Basic data collection, ad-hoc reporting, inconsistent metrics",
      color: "bg-orange-500"
    },
    {
      level: 2,
      label: "L2: Performance Measurement",
      description: "Documented procedures, data-driven decisions, KPI tracking",
      color: "bg-yellow-500"
    },
    {
      level: 3,
      label: "L3: Managed/Optimizing",
      description: "Proactive analytics, proactive optimization, AI/ML experimentation",
      color: "bg-lime-500"
    },
    {
      level: 4,
      label: "L4: Predictive Analytics",
      description: "Autonomous value flow, self-optimizing systems, AI-driven orchestration",
      color: "bg-green-500"
    },
    {
      level: 5,
      label: "L5: Value Orchestration",
      description: "Autonomous value flow, self-optimizing systems, AI-driven orchestration",
      color: "bg-teal-600"
    }
  ];

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
        <div className="container max-w-4xl">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your role, maturity level, and learning preferences
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Account Type</Label>
                <Badge variant="secondary" className="mt-1">
                  {user?.role === "admin" ? "Administrator" : "Learner"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Your VOS Role
              </CardTitle>
              <CardDescription>
                Select your primary role to receive customized learning paths and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-select">Role</Label>
                <Select 
                  value={selectedRole} 
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="CS">Customer Success</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Executive">Executive Leadership</SelectItem>
                    <SelectItem value="VE">Value Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedRole && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {roleDescriptions[selectedRole as keyof typeof roleDescriptions]}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleRoleUpdate}
                disabled={updateRoleMutation.isPending || !selectedRole || selectedRole === user?.vosRole}
              >
                {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
              </Button>
            </CardContent>
          </Card>

          {/* Maturity Level Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                VOS Maturity Level
              </CardTitle>
              <CardDescription>
                Assess your current maturity level to track your progression
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maturity-select">Current Maturity Level</Label>
                <Select 
                  value={selectedLevel.toString()} 
                  onValueChange={(val) => setSelectedLevel(parseInt(val))}
                >
                  <SelectTrigger id="maturity-select">
                    <SelectValue placeholder="Select your maturity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {maturityLevels.map((level) => (
                      <SelectItem key={level.level} value={level.level.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Maturity Level Details */}
              <div className="space-y-3">
                {maturityLevels.map((level) => (
                  <div 
                    key={level.level}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedLevel === level.level 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-8 w-8 rounded-full ${level.color} flex items-center justify-center text-white font-bold text-sm`}>
                        L{level.level}
                      </div>
                      <div className="font-semibold">{level.label}</div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      {level.description}
                    </p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleMaturityUpdate}
                disabled={updateMaturityMutation.isPending || selectedLevel === user?.maturityLevel}
              >
                {updateMaturityMutation.isPending ? "Updating..." : "Update Maturity Level"}
              </Button>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Certifications
              </CardTitle>
              <CardDescription>
                Track your VOS certification progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No certifications earned yet</p>
                <p className="text-sm mt-2">Complete pillar quizzes to earn certifications</p>
                <Link href="/dashboard">
                  <Button variant="outline" className="mt-4">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
              <Link href="/resources">
                <Button variant="link" className="h-auto p-0">Resources</Button>
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
