# VOS Education Hub - Developer Quick Start Guide

## Overview
This guide helps developers understand the new UX improvements and how to work with them.

## Architecture at a Glance

```
User Journey:
Home → Get Started → Onboarding (4 steps) → Unified Dashboard → Learning

Key Components:
- OnboardingWizard: First-time user flow
- UnifiedDashboard: Main learning hub (4 tabs)
- MaturityLevelExplainer: Progress tracking UI
- LevelUpCelebration: Achievement notifications
```

## Database Schema Quick Reference

### Core User Fields
```typescript
user {
  vosRole?: "Sales" | "CS" | "Marketing" | "Product" | "Executive" | "VE"
  maturityLevel: 0-5
  onboardingCompleted: boolean
  onboardingStep: 0-4
  learningPathPreference?: "guided" | "self_paced" | "role_specific"
}
```

### New Tables
1. **learningPaths** - Curriculum definitions
2. **userLearningProgress** - User's position in curriculum
3. **userOnboarding** - Onboarding responses
4. **roleLearningTracks** - Role-specific pillar priorities
5. **userRoleHistory** - Role change audit log
6. **achievements** - Badge definitions
7. **userAchievements** - Earned badges

## API Endpoints

### User Management
```typescript
// General update (use this for onboarding completion)
trpc.user.update.mutate({
  vosRole: "Sales",
  learningPathPreference: "guided",
  maturityLevel: 0,
  onboardingCompleted: true,
  onboardingStep: 4
});

// Role update with history
trpc.user.updateVosRole.mutate({ vosRole: "Sales" });

// Maturity level update
trpc.user.updateMaturityLevel.mutate({ level: 2 });
```

### Learning Progress
```typescript
// Get user's learning progress
const progress = await trpc.progress.getUserProgress.useQuery();

// Update pillar progress
trpc.progress.updateProgress.mutate({
  pillarId: 1,
  status: "in_progress",
  completionPercentage: 50
});
```

## Component Usage Examples

### Using OnboardingWizard
```tsx
import OnboardingWizard from "@/components/OnboardingWizard";

function MyComponent() {
  const handleComplete = async (data) => {
    // data contains: role, learningPathPreference, selfAssessedMaturity, goals
    await updateUser(data);
  };

  return (
    <OnboardingWizard
      onComplete={handleComplete}
      initialData={{ role: "Sales", ... }}
    />
  );
}
```

### Using MaturityLevelExplainer
```tsx
import MaturityLevelExplainer from "@/components/MaturityLevelExplainer";

<MaturityLevelExplainer
  currentLevel={user.maturityLevel}
  completedLessons={5}
  requiredLessons={10}
  nextLevelUnlocks={["Advanced quizzes", "Simulations"]}
/>
```

### Triggering LevelUpCelebration
```tsx
import LevelUpCelebration from "@/components/LevelUpCelebration";

const [showCelebration, setShowCelebration] = useState(false);

// After user levels up
useEffect(() => {
  if (userLeveledUp) {
    setShowCelebration(true);
  }
}, [userLeveledUp]);

<LevelUpCelebration
  newLevel={3}
  previousLevel={2}
  badgeEarned="Performance Measurement Master"
  unlockedContent={["L3 content", "New simulations"]}
  onClose={() => setShowCelebration(false)}
  onShare={() => shareToSocial()}
/>
```

## Routing Structure

```
/ (Home)
/dashboard → DashboardWithOnboarding → UnifiedDashboard
/dashboard-legacy (deprecated)
/pillar/:number
/quiz/:number
/profile
/resources

/academy/* → Redirects to /dashboard with appropriate tab
```

## Adding New Features

### Adding a New Achievement
```typescript
// 1. Define achievement in achievements table
await db.createAchievement({
  achievementId: "first-quiz-pass",
  name: "Quiz Master",
  description: "Passed your first quiz",
  category: "quiz_mastery",
  requirement: { type: "quiz_passed", value: 1 },
  points: 100,
  rarity: "common"
});

// 2. Award to user when condition is met
await db.awardAchievement(userId, achievementId);

// 3. Trigger celebration
setShowCelebration(true);
```

### Adding a New Learning Path
```typescript
await db.createLearningPath({
  pathId: "executive-fast-track",
  name: "Executive Fast Track",
  type: "role_specific",
  targetRole: "Executive",
  pillarSequence: [1, 4, 8, 9, 10],
  estimatedDuration: "4 weeks"
});
```

### Customizing Role-Specific Content
```typescript
// In roleLearningTracks table
await db.createRoleLearningTrack({
  role: "Sales",
  pillarNumber: 3,
  priorityOrder: 1, // Shows first for Sales
  recommendedDuration: "2 weeks",
  roleSpecificObjectives: [
    "Master discovery questioning",
    "Build value hypotheses",
    "Document customer pain points"
  ]
});
```

## Common Tasks

### Check if User Completed Onboarding
```typescript
const { user } = useAuth();
if (!user.onboardingCompleted) {
  // Show onboarding or redirect
}
```

### Get User's Next Recommended Lesson
```typescript
const learningProgress = await db.getUserLearningProgress(userId);
const nextLesson = learningProgress.nextRecommendedLessonId;
```

### Update User's Maturity Level with Celebration
```typescript
const newLevel = currentLevel + 1;
await updateUserMaturityLevel(userId, newLevel);

// Show celebration
setLevelUpData({
  newLevel,
  previousLevel: currentLevel,
  badgeEarned: `Level ${newLevel} Achievement`,
  unlockedContent: getUnlocksForLevel(newLevel)
});
setShowCelebration(true);
```

## Testing Checklist

### Testing Onboarding Flow
1. Create new user account
2. Verify OnboardingWizard appears automatically
3. Complete all 4 steps
4. Verify user.onboardingCompleted = true
5. Verify redirect to UnifiedDashboard
6. Verify role and preferences saved

### Testing Dashboard Navigation
1. Navigate to /dashboard
2. Verify 4 tabs render correctly
3. Click between tabs
4. Verify content updates appropriately
5. Test responsive layout on mobile

### Testing Maturity Progression
1. Complete lessons/quizzes
2. Verify progress bar updates
3. Trigger level-up
4. Verify LevelUpCelebration appears
5. Verify new content unlocks

## Debugging Tips

### User Not Seeing Onboarding
```typescript
// Check database
const user = await db.getUserById(userId);
console.log('Onboarding status:', {
  completed: user.onboardingCompleted,
  step: user.onboardingStep
});

// Reset onboarding for testing
await db.update(users)
  .set({ onboardingCompleted: false, onboardingStep: 0 })
  .where(eq(users.id, userId));
```

### Dashboard Not Loading
```typescript
// Check user authentication
const { user, isAuthenticated } = useAuth();
console.log('Auth status:', { user, isAuthenticated });

// Check tRPC connection
const { data, isLoading, error } = trpc.pillars.list.useQuery();
console.log('Pillars:', { data, isLoading, error });
```

### Role Changes Not Applying
```typescript
// Verify mutation succeeded
const updateRoleMutation = trpc.user.updateVosRole.useMutation({
  onSuccess: (data) => console.log('Role updated:', data),
  onError: (error) => console.error('Update failed:', error)
});

// Check role history
const history = await db.getUserRoleHistory(userId);
console.log('Role history:', history);
```

## Performance Optimization

### Bundle Size
Current: 729kb (can be optimized)

Recommendations:
```typescript
// Use dynamic imports for large components
const OnboardingWizard = lazy(() => import('@/components/OnboardingWizard'));
const LevelUpCelebration = lazy(() => import('@/components/LevelUpCelebration'));

// Code split by route
const UnifiedDashboard = lazy(() => import('@/pages/UnifiedDashboard'));
```

### Database Queries
```typescript
// Batch requests when possible
const [user, progress, achievements] = await Promise.all([
  db.getUserById(userId),
  db.getUserLearningProgress(userId),
  db.getUserAchievements(userId)
]);

// Use indexes on frequently queried columns
// Already indexed: userId, pillarNumber, achievementId
```

## Security Considerations

### Always Validate on Server
```typescript
// ❌ Never trust client-side validation alone
// ✅ Always validate in tRPC procedures
updateProgress: protectedProcedure
  .input(z.object({
    pillarId: z.number(),
    completionPercentage: z.number().min(0).max(100)
  }))
  .mutation(async ({ ctx, input }) => {
    // Server-side validation ensures data integrity
  });
```

### Protect Sensitive Routes
```typescript
// All routes use protectedProcedure or check isAuthenticated
if (!isAuthenticated) {
  window.location.href = getLoginUrl();
  return null;
}
```

## Getting Help

### Resources
- Main Implementation Doc: `UX_IMPROVEMENT_SUMMARY.md`
- Database Schema: `drizzle/schema.ts`
- API Reference: `server/routers.ts`
- Component Library: `client/src/components/ui/`

### Common Issues
1. **Build Errors**: Check zod version (must be v3.23.8)
2. **Type Errors**: Run `npm run check` to verify TypeScript
3. **Database Issues**: Verify migrations with `npm run db:push`
4. **Route Not Found**: Check App.tsx routing configuration

### Making Changes
1. Always read existing code first to understand patterns
2. Follow TypeScript types strictly
3. Update tests when modifying logic
4. Run `npm run build` before committing
5. Document significant changes in commit messages
