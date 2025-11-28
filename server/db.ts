import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  users,
  pillars,
  progress,
  quizQuestions,
  quizResults,
  certifications,
  maturityAssessments,
  resources,
  InsertPillar,
  InsertProgress,
  InsertQuizQuestion,
  InsertQuizResult,
  InsertCertification,
  InsertMaturityAssessment,
  InsertResource,
  AcademyProgress,
  academyProgress,
  AcademyModule,
  academyModules,
  AIPrompt,
  aiPrompts,
  Simulation,
  simulations,
  InsertAcademyProgress,
  InsertAcademyModule,
  InsertAIPrompt,
  InsertSimulation,
  learningPaths,
  userLearningProgress,
  userOnboarding,
  roleLearningTracks,
  userRoleHistory,
  achievements,
  userAchievements,
  InsertLearningPath,
  InsertUserLearningProgress,
  InsertUserOnboarding,
  InsertRoleLearningTrack,
  InsertUserRoleHistory,
  InsertAchievement,
  InsertUserAchievement,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// User Management
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.vosRole !== undefined) {
      values.vosRole = user.vosRole;
      updateSet.vosRole = user.vosRole;
    }
    if (user.maturityLevel !== undefined) {
      values.maturityLevel = user.maturityLevel;
      updateSet.maturityLevel = user.maturityLevel;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserVosRole(userId: number, vosRole: string) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ vosRole: vosRole as any }).where(eq(users.id, userId));
}

export async function updateUserMaturityLevel(userId: number, level: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ maturityLevel: level }).where(eq(users.id, userId));
}

// ============================================================================
// Pillars
// ============================================================================

export async function getAllPillars() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(pillars).orderBy(pillars.pillarNumber);
}

export async function getPillarById(pillarId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(pillars).where(eq(pillars.id, pillarId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPillarByNumber(pillarNumber: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(pillars).where(eq(pillars.pillarNumber, pillarNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPillar(pillar: InsertPillar) {
  const db = await getDb();
  if (!db) return;

  await db.insert(pillars).values(pillar);
}

// ============================================================================
// Progress Tracking
// ============================================================================

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(progress).where(eq(progress.userId, userId));
}

export async function getUserPillarProgress(userId: number, pillarId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.pillarId, pillarId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProgress(progressData: InsertProgress) {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserPillarProgress(progressData.userId, progressData.pillarId);

  if (existing) {
    await db
      .update(progress)
      .set({
        status: progressData.status,
        completionPercentage: progressData.completionPercentage,
        lastAccessed: new Date(),
        completedAt: progressData.completedAt,
      })
      .where(eq(progress.id, existing.id));
  } else {
    await db.insert(progress).values(progressData);
  }
}

// ============================================================================
// Quiz Questions
// ============================================================================

export async function getQuizQuestionsByPillar(pillarId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.pillarId, pillarId))
    .orderBy(quizQuestions.questionNumber);
}

export async function createQuizQuestion(question: InsertQuizQuestion) {
  const db = await getDb();
  if (!db) return;

  await db.insert(quizQuestions).values(question);
}

export async function createQuizQuestions(questions: InsertQuizQuestion[]) {
  const db = await getDb();
  if (!db) return;

  await db.insert(quizQuestions).values(questions);
}

// ============================================================================
// Quiz Results
// ============================================================================

export async function getUserQuizResults(userId: number, pillarId?: number) {
  const db = await getDb();
  if (!db) return [];

  const conditions = pillarId
    ? and(eq(quizResults.userId, userId), eq(quizResults.pillarId, pillarId))
    : eq(quizResults.userId, userId);

  return await db.select().from(quizResults).where(conditions).orderBy(desc(quizResults.completedAt));
}

export async function getLatestQuizResult(userId: number, pillarId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(quizResults)
    .where(and(eq(quizResults.userId, userId), eq(quizResults.pillarId, pillarId)))
    .orderBy(desc(quizResults.completedAt))
    .limit(1);

  return results.length > 0 ? results[0] : undefined;
}

export async function createQuizResult(result: InsertQuizResult) {
  const db = await getDb();
  if (!db) return;

  await db.insert(quizResults).values(result);
}

// ============================================================================
// Certifications
// ============================================================================

export async function getUserCertifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(certifications).where(eq(certifications.userId, userId)).orderBy(desc(certifications.awardedAt));
}

export async function createCertification(cert: InsertCertification) {
  const db = await getDb();
  if (!db) return;

  await db.insert(certifications).values(cert);
}

export async function hasCertification(userId: number, pillarId: number, vosRole: string) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(certifications)
    .where(
      and(
        eq(certifications.userId, userId),
        eq(certifications.pillarId, pillarId),
        eq(certifications.vosRole, vosRole)
      )
    )
    .limit(1);

  return result.length > 0;
}

// ============================================================================
// Maturity Assessments
// ============================================================================

export async function getUserMaturityAssessments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(maturityAssessments)
    .where(eq(maturityAssessments.userId, userId))
    .orderBy(desc(maturityAssessments.assessedAt));
}

export async function getLatestMaturityAssessment(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(maturityAssessments)
    .where(eq(maturityAssessments.userId, userId))
    .orderBy(desc(maturityAssessments.assessedAt))
    .limit(1);

  return results.length > 0 ? results[0] : undefined;
}

export async function createMaturityAssessment(assessment: InsertMaturityAssessment) {
  const db = await getDb();
  if (!db) return;

  await db.insert(maturityAssessments).values(assessment);
}

// ============================================================================
// Resources
// ============================================================================

export async function getAllResources() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(resources);
}

export async function getResourcesByPillar(pillarId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(resources).where(eq(resources.pillarId, pillarId));
}

export async function getResourcesByRole(vosRole: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(resources).where(eq(resources.vosRole, vosRole));
}

export async function createResource(resource: InsertResource) {
  const db = await getDb();
  if (!db) return;

  await db.insert(resources).values(resource);
}

export async function deleteResource(id: number) {
  const db = await getDb();
  const result = await db.delete(resources).where(eq(resources.id, id));
  return result;
}

// ============================================================================
// Academy Progress
// ============================================================================

export async function getAcademyProgress(userId: number) {
  const db = await getDb();
  const result = await db.select().from(academyProgress).where(eq(academyProgress.userId, userId));
  return result[0] || null;
}

export async function createAcademyProgress(data: InsertAcademyProgress) {
  const db = await getDb();
  const result = await db.insert(academyProgress).values(data);
  return result;
}

export async function updateAcademyProgress(userId: number, data: Partial<InsertAcademyProgress>) {
  const db = await getDb();
  const result = await db
    .update(academyProgress)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(academyProgress.userId, userId));
  return result;
}

export async function updateModuleProgress(userId: number, moduleId: string, progressData: {
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: string;
  timeSpent?: number;
}) {
  const db = await getDb();
  const currentProgress = await getAcademyProgress(userId);
  
  if (!currentProgress) {
    throw new Error('Academy progress not found for user');
  }

  const updatedModules = {
    ...currentProgress.modulesCompleted,
    [moduleId]: progressData
  };

  return await updateAcademyProgress(userId, {
    modulesCompleted: updatedModules,
    lastActivityDate: new Date()
  });
}

export async function updateQuizProgress(userId: number, quizId: string, quizData: {
  attempts: number;
  bestScore: number;
  lastAttempt: string;
  passed: boolean;
}) {
  const db = await getDb();
  const currentProgress = await getAcademyProgress(userId);
  
  if (!currentProgress) {
    throw new Error('Academy progress not found for user');
  }

  const updatedQuizzes = {
    ...currentProgress.quizzes,
    [quizId]: quizData
  };

  return await updateAcademyProgress(userId, {
    quizzes: updatedQuizzes,
    lastActivityDate: new Date()
  });
}

// ============================================================================
// Academy Modules
// ============================================================================

export async function getAcademyModules(filters?: {
  role?: string;
  level?: number;
  isPublished?: boolean;
}) {
  const db = await getDb();
  let query = db.select().from(academyModules);

  if (filters?.role) {
    query = query.where(eq(academyModules.role, filters.role as any));
  }
  if (filters?.level) {
    query = query.where(eq(academyModules.level, filters.level));
  }
  if (filters?.isPublished !== undefined) {
    query = query.where(eq(academyModules.isPublished, filters.isPublished));
  }

  return await query.orderBy(academyModules.sortOrder);
}

export async function getAcademyModule(moduleId: string) {
  const db = await getDb();
  const result = await db.select().from(academyModules).where(eq(academyModules.moduleId, moduleId));
  return result[0] || null;
}

export async function createAcademyModule(data: InsertAcademyModule) {
  const db = await getDb();
  const result = await db.insert(academyModules).values(data);
  return result;
}

export async function updateAcademyModule(moduleId: string, data: Partial<InsertAcademyModule>) {
  const db = await getDb();
  const result = await db
    .update(academyModules)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(academyModules.moduleId, moduleId));
  return result;
}

// ============================================================================
// AI Prompts
// ============================================================================

export async function getAIPrompts(filters?: {
  category?: string;
  targetRoles?: string[];
  targetMaturityLevel?: number;
  isActive?: boolean;
}) {
  const db = await getDb();
  let query = db.select().from(aiPrompts);

  if (filters?.category) {
    query = query.where(eq(aiPrompts.category, filters.category as any));
  }
  if (filters?.targetMaturityLevel) {
    query = query.where(eq(aiPrompts.targetMaturityLevel, filters.targetMaturityLevel));
  }
  if (filters?.isActive !== undefined) {
    query = query.where(eq(aiPrompts.isActive, filters.isActive));
  }

  const results = await query.orderBy(aiPrompts.title);
  
  // Filter by target roles if specified
  if (filters?.targetRoles && filters.targetRoles.length > 0) {
    return results.filter((prompt: any) => 
      prompt.targetRoles.some((role: string) => filters.targetRoles!.includes(role))
    );
  }

  return results;
}

export async function getAIPrompt(promptId: string) {
  const db = await getDb();
  const result = await db.select().from(aiPrompts).where(eq(aiPrompts.promptId, promptId));
  return result[0] || null;
}

export async function createAIPrompt(data: InsertAIPrompt) {
  const db = await getDb();
  const result = await db.insert(aiPrompts).values(data);
  return result;
}

export async function updateAIPrompt(promptId: string, data: Partial<InsertAIPrompt>) {
  const db = await getDb();
  const result = await db
    .update(aiPrompts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(aiPrompts.promptId, promptId));
  return result;
}

// ============================================================================
// Simulations
// ============================================================================

export async function getSimulations(filters?: {
  targetRoles?: string[];
  targetLevel?: number;
  pillar?: number;
  isPublished?: boolean;
}) {
  const db = await getDb();
  let query = db.select().from(simulations);

  if (filters?.targetLevel) {
    query = query.where(eq(simulations.targetLevel, filters.targetLevel));
  }
  if (filters?.pillar) {
    query = query.where(eq(simulations.pillar, filters.pillar));
  }
  if (filters?.isPublished !== undefined) {
    query = query.where(eq(simulations.isPublished, filters.isPublished));
  }

  const results = await query.orderBy(simulations.title);
  
  // Filter by target roles if specified
  if (filters?.targetRoles && filters.targetRoles.length > 0) {
    return results.filter((simulation: any) => 
      simulation.targetRoles.some((role: string) => filters.targetRoles!.includes(role))
    );
  }

  return results;
}

export async function getSimulation(simulationId: string) {
  const db = await getDb();
  const result = await db.select().from(simulations).where(eq(simulations.simulationId, simulationId));
  return result[0] || null;
}

export async function createSimulation(data: InsertSimulation) {
  const db = await getDb();
  const result = await db.insert(simulations).values(data);
  return result;
}

export async function updateSimulation(simulationId: string, data: Partial<InsertSimulation>) {
  const db = await getDb();
  const result = await db
    .update(simulations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(simulations.simulationId, simulationId));
  return result;
}

// ============================================================================
// Onboarding
// ============================================================================

export async function getUserOnboarding(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userOnboarding).where(eq(userOnboarding.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createUserOnboarding(data: InsertUserOnboarding) {
  const db = await getDb();
  if (!db) return;

  await db.insert(userOnboarding).values(data);
}

export async function updateUserOnboardingStatus(userId: number, completed: boolean, step: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(users)
    .set({ onboardingCompleted: completed, onboardingStep: step })
    .where(eq(users.id, userId));
}

// ============================================================================
// Learning Paths
// ============================================================================

export async function getLearningPaths(type?: string, role?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(learningPaths).where(eq(learningPaths.isActive, true));

  if (type) {
    query = query.where(eq(learningPaths.type, type as any));
  }
  if (role) {
    query = query.where(eq(learningPaths.targetRole, role as any));
  }

  return await query;
}

export async function getLearningPath(pathId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(learningPaths).where(eq(learningPaths.pathId, pathId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLearningPath(data: InsertLearningPath) {
  const db = await getDb();
  if (!db) return;

  await db.insert(learningPaths).values(data);
}

// ============================================================================
// User Learning Progress
// ============================================================================

export async function getUserLearningProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userLearningProgress).where(eq(userLearningProgress.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createUserLearningProgress(data: InsertUserLearningProgress) {
  const db = await getDb();
  if (!db) return;

  await db.insert(userLearningProgress).values(data);
}

export async function updateUserLearningProgress(userId: number, data: Partial<InsertUserLearningProgress>) {
  const db = await getDb();
  if (!db) return;

  await db.update(userLearningProgress)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userLearningProgress.userId, userId));
}

// ============================================================================
// Role Learning Tracks
// ============================================================================

export async function getRoleLearningTrack(role: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(roleLearningTracks)
    .where(eq(roleLearningTracks.role, role as any))
    .orderBy(roleLearningTracks.priorityOrder);
}

export async function createRoleLearningTrack(data: InsertRoleLearningTrack) {
  const db = await getDb();
  if (!db) return;

  await db.insert(roleLearningTracks).values(data);
}

// ============================================================================
// Role History
// ============================================================================

export async function createRoleHistoryEntry(userId: number, role: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(userRoleHistory).values({
    userId,
    role: role as any,
  });
}

export async function getUserRoleHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userRoleHistory)
    .where(eq(userRoleHistory.userId, userId))
    .orderBy(desc(userRoleHistory.changedAt));
}

// ============================================================================
// Achievements
// ============================================================================

export async function getAllAchievements() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(achievements).where(eq(achievements.isActive, true));
}

export async function getAchievement(achievementId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(achievements).where(eq(achievements.achievementId, achievementId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAchievement(data: InsertAchievement) {
  const db = await getDb();
  if (!db) return;

  await db.insert(achievements).values(data);
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))
    .orderBy(desc(userAchievements.earnedAt));
}

export async function awardAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.select()
    .from(userAchievements)
    .where(and(
      eq(userAchievements.userId, userId),
      eq(userAchievements.achievementId, achievementId)
    ))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userAchievements).values({
      userId,
      achievementId,
    });
  }
}

export async function markAchievementNotified(userAchievementId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(userAchievements)
    .set({ notified: true })
    .where(eq(userAchievements.id, userAchievementId));
}
