import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
