import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import OnboardingWizard from "@/components/OnboardingWizard";
import UnifiedDashboard from "./UnifiedDashboard";
import { getLoginUrl } from "@/const";

export default function DashboardWithOnboarding() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const updateUserMutation = trpc.user.update.useMutation();

  useEffect(() => {
    if (user && !user.onboardingCompleted && isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [user, isAuthenticated]);

  if (!loading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleOnboardingComplete = async (data: any) => {
    try {
      await updateUserMutation.mutateAsync({
        vosRole: data.role,
        learningPathPreference: data.learningPathPreference,
        maturityLevel: data.selfAssessedMaturity,
        onboardingCompleted: true,
        onboardingStep: 4
      });

      setShowOnboarding(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  if (showOnboarding && user) {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        initialData={{
          role: user.vosRole || "",
          learningPathPreference: user.learningPathPreference || "",
          selfAssessedMaturity: user.maturityLevel || 0,
          goals: []
        }}
      />
    );
  }

  return <UnifiedDashboard />;
}
