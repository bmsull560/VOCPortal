/*
  # VOS Education Hub - Initial Database Schema
  
  This migration creates the complete database schema for the VOS Education Hub application,
  including all tables, enums, and relationships needed for the learning management system.
  
  ## Enums Created
  - role: User authentication roles (user, admin)
  - vos_role: VOS-specific roles (Sales, CS, Marketing, Product, Executive, VE)
  - learning_path_preference: Learning style preferences (guided, self_paced, role_specific)
  - status: Progress tracking status (not_started, in_progress, completed)
  - question_type: Quiz question types (multiple_choice, scenario_based)
  - resource_type: Resource categories (kpi_sheet, template, framework, guide, playbook)
  - simulation_type: Simulation types (handoff, decision_tree, drag_drop, role_play, case_study)
  - learning_path_type: Learning path categories (guided, role_specific, self_paced)
  - achievement_category: Achievement categories (pillar_completion, maturity_level, streak, quiz_mastery, certification)
  - rarity: Achievement rarity levels (common, rare, epic, legendary)
  - prompt_category: AI prompt categories (discovery, roi_modeling, realization, expansion, governance)
  
  ## Tables Created
  1. users - Core user authentication and profile data
  2. pillars - 10 core VOS training modules
  3. progress - User progress through pillars
  4. quizQuestions - Quiz questions for each pillar
  5. quizResults - User quiz submissions and scores
  6. certifications - Earned certifications and badges
  7. maturityAssessments - Maturity level assessments over time
  8. resources - Learning resources library
  9. academyProgress - Detailed VOS Academy progress tracking
  10. academyModules - Individual learning modules
  11. aiPrompts - Curated AI prompts for workflows
  12. simulations - Interactive learning simulations
  13. learningPaths - Predefined curriculum structures
  14. userLearningProgress - User journey through learning paths
  15. userOnboarding - Onboarding wizard responses
  16. roleLearningTracks - Role-specific pillar priorities
  17. userRoleHistory - Role change history for analytics
  18. achievements - Badge and milestone definitions
  19. userAchievements - Earned achievements tracking
*/

-- Create enums
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE vos_role AS ENUM ('Sales', 'CS', 'Marketing', 'Product', 'Executive', 'VE');
CREATE TYPE learning_path_preference AS ENUM ('guided', 'self_paced', 'role_specific');
CREATE TYPE status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'scenario_based');
CREATE TYPE resource_type AS ENUM ('kpi_sheet', 'template', 'framework', 'guide', 'playbook');
CREATE TYPE simulation_type AS ENUM ('handoff', 'decision_tree', 'drag_drop', 'role_play', 'case_study');
CREATE TYPE learning_path_type AS ENUM ('guided', 'role_specific', 'self_paced');
CREATE TYPE achievement_category AS ENUM ('pillar_completion', 'maturity_level', 'streak', 'quiz_mastery', 'certification');
CREATE TYPE rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE prompt_category AS ENUM ('discovery', 'roi_modeling', 'realization', 'expansion', 'governance');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role role NOT NULL DEFAULT 'user',
  "vosRole" vos_role,
  "maturityLevel" INTEGER NOT NULL DEFAULT 0,
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  "onboardingStep" INTEGER NOT NULL DEFAULT 0,
  "learningPathPreference" learning_path_preference,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pillars table
CREATE TABLE IF NOT EXISTS pillars (
  id SERIAL PRIMARY KEY,
  "pillarNumber" INTEGER NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "targetMaturityLevel" INTEGER NOT NULL,
  duration VARCHAR(50),
  content JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "pillarId" INTEGER NOT NULL,
  status status NOT NULL DEFAULT 'not_started',
  "completionPercentage" INTEGER NOT NULL DEFAULT 0,
  "lastAccessed" TIMESTAMP NOT NULL DEFAULT NOW(),
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS "quizQuestions" (
  id SERIAL PRIMARY KEY,
  "pillarId" INTEGER NOT NULL,
  "questionNumber" INTEGER NOT NULL,
  "questionType" question_type NOT NULL,
  category VARCHAR(100) NOT NULL,
  "questionText" TEXT NOT NULL,
  options JSONB,
  "correctAnswer" VARCHAR(10) NOT NULL,
  points INTEGER NOT NULL DEFAULT 4,
  feedback JSONB,
  "roleAdaptations" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS "quizResults" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "pillarId" INTEGER NOT NULL,
  score INTEGER NOT NULL,
  "categoryScores" JSONB,
  answers JSONB,
  feedback JSONB,
  passed BOOLEAN NOT NULL DEFAULT false,
  "attemptNumber" INTEGER NOT NULL DEFAULT 1,
  "completedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "badgeName" VARCHAR(255) NOT NULL,
  "pillarId" INTEGER NOT NULL,
  "vosRole" VARCHAR(50) NOT NULL,
  "certificateUrl" TEXT,
  "awardedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Maturity assessments table
CREATE TABLE IF NOT EXISTS "maturityAssessments" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  level INTEGER NOT NULL,
  "assessmentData" JSONB,
  "assessedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "resourceType" resource_type NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "pillarId" INTEGER,
  "vosRole" VARCHAR(50),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Academy progress table
CREATE TABLE IF NOT EXISTS "academyProgress" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  role vos_role NOT NULL,
  "currentLevel" INTEGER NOT NULL DEFAULT 0,
  "modulesCompleted" JSONB,
  quizzes JSONB,
  badges JSONB,
  "maturityScore" INTEGER NOT NULL DEFAULT 0,
  "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
  "streakDays" INTEGER NOT NULL DEFAULT 0,
  "lastActivityDate" TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Academy modules table
CREATE TABLE IF NOT EXISTS "academyModules" (
  id SERIAL PRIMARY KEY,
  "moduleId" VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  role vos_role NOT NULL,
  level INTEGER NOT NULL,
  content JSONB,
  "learningObjectives" JSONB,
  "requiredCompetencies" JSONB,
  "quizId" VARCHAR(64),
  "simulationId" VARCHAR(64),
  "passingScore" INTEGER NOT NULL DEFAULT 80,
  prerequisites JSONB,
  "estimatedDuration" INTEGER NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- AI prompts table
CREATE TABLE IF NOT EXISTS "aiPrompts" (
  id SERIAL PRIMARY KEY,
  "promptId" VARCHAR(64) NOT NULL UNIQUE,
  category prompt_category NOT NULL,
  subcategory VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "promptText" TEXT NOT NULL,
  "usageGuidelines" JSONB,
  "targetRoles" JSONB,
  "targetMaturityLevel" INTEGER NOT NULL,
  tags JSONB,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id SERIAL PRIMARY KEY,
  "simulationId" VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type simulation_type NOT NULL,
  "targetRoles" JSONB,
  "targetLevel" INTEGER NOT NULL,
  pillar INTEGER NOT NULL,
  flow JSONB,
  "maxScore" INTEGER NOT NULL DEFAULT 100,
  "passingScore" INTEGER NOT NULL DEFAULT 80,
  "timeLimit" INTEGER,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS "learningPaths" (
  id SERIAL PRIMARY KEY,
  "pathId" VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type learning_path_type NOT NULL,
  "targetRole" vos_role,
  "pillarSequence" JSONB,
  "estimatedDuration" VARCHAR(50),
  prerequisites JSONB,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User learning progress table
CREATE TABLE IF NOT EXISTS "userLearningProgress" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "learningPathId" INTEGER,
  "currentPillarNumber" INTEGER NOT NULL DEFAULT 1,
  "completedPillars" JSONB DEFAULT '[]'::jsonb,
  "nextRecommendedLessonId" VARCHAR(64),
  "totalLessonsCompleted" INTEGER NOT NULL DEFAULT 0,
  "totalTimeSpentMinutes" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User onboarding table
CREATE TABLE IF NOT EXISTS "userOnboarding" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL UNIQUE,
  role vos_role NOT NULL,
  "learningPathPreference" learning_path_preference NOT NULL,
  "selfAssessedMaturity" INTEGER NOT NULL DEFAULT 0,
  "primaryGoals" JSONB,
  "completedAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Role learning tracks table
CREATE TABLE IF NOT EXISTS "roleLearningTracks" (
  id SERIAL PRIMARY KEY,
  role vos_role NOT NULL,
  "pillarNumber" INTEGER NOT NULL,
  "priorityOrder" INTEGER NOT NULL,
  "recommendedDuration" VARCHAR(50),
  "roleSpecificObjectives" JSONB,
  "isRequired" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User role history table
CREATE TABLE IF NOT EXISTS "userRoleHistory" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  role vos_role NOT NULL,
  "changedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  "achievementId" VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category achievement_category NOT NULL,
  "iconUrl" TEXT,
  requirement JSONB,
  points INTEGER NOT NULL DEFAULT 0,
  rarity rarity NOT NULL DEFAULT 'common',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS "userAchievements" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "achievementId" INTEGER NOT NULL,
  "earnedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  notified BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_openid ON users("openId");
CREATE INDEX IF NOT EXISTS idx_progress_userid ON progress("userId");
CREATE INDEX IF NOT EXISTS idx_progress_pillarid ON progress("pillarId");
CREATE INDEX IF NOT EXISTS idx_quizresults_userid ON "quizResults"("userId");
CREATE INDEX IF NOT EXISTS idx_userachievements_userid ON "userAchievements"("userId");
