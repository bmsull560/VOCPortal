import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardWithOnboarding from "./pages/DashboardWithOnboarding";
import PillarOverview from "./pages/PillarOverview";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import BeforeAfterPreview from "./components/BeforeAfterPreview";
// Academy imports
import AcademyDashboard from "./pages/academy/Dashboard";
import AcademyMaturityAssessment from "./pages/academy/MaturityAssessment";
import RoleTrack from "./pages/academy/RoleTrack";
import RoleLevel from "./pages/academy/RoleLevel";
import AcademyQuiz from "./pages/academy/Quiz";
import AcademySimulation from "./pages/academy/Simulation";
import PromptLibrary from "./pages/academy/PromptLibrary";
import LessonView from "./pages/academy/LessonView";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={DashboardWithOnboarding} />
      <Route path={"/dashboard-legacy"} component={Dashboard} />
      <Route path={"/pillar/:pillarNumber"} component={PillarOverview} />
      <Route path={"/quiz/:pillarNumber"} component={Quiz} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/preview"} component={BeforeAfterPreview} />
      {/* Academy Routes - Redirect to unified dashboard tabs */}
      <Route path={"/academy"} component={DashboardWithOnboarding} />
      <Route path={"/academy/dashboard"} component={DashboardWithOnboarding} />
      <Route path={"/academy/lesson/:id"} component={LessonView} />
      <Route path={"/academy/maturity-assessment"} component={AcademyMaturityAssessment} />
      <Route path={"/academy/role/:role"} component={RoleTrack} />
      <Route path={"/academy/role/:role/:level"} component={RoleLevel} />
      <Route path={"/academy/quiz/:pillar"} component={AcademyQuiz} />
      <Route path={"/academy/simulation/:workflow"} component={AcademySimulation} />
      <Route path={"/academy/library/prompts"} component={PromptLibrary} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
