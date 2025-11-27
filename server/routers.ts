import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User profile management
  user: router({
    update: protectedProcedure
      .input(z.object({
        vosRole: z.enum(["Sales", "CS", "Marketing", "Product", "Executive", "VE"]).optional(),
        learningPathPreference: z.enum(["guided", "self_paced", "role_specific"]).optional(),
        maturityLevel: z.number().min(0).max(5).optional(),
        onboardingCompleted: z.boolean().optional(),
        onboardingStep: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");

        const updateData: any = {};
        if (input.vosRole !== undefined) updateData.vosRole = input.vosRole;
        if (input.learningPathPreference !== undefined) updateData.learningPathPreference = input.learningPathPreference;
        if (input.maturityLevel !== undefined) updateData.maturityLevel = input.maturityLevel;
        if (input.onboardingCompleted !== undefined) updateData.onboardingCompleted = input.onboardingCompleted;
        if (input.onboardingStep !== undefined) updateData.onboardingStep = input.onboardingStep;

        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db.update(users).set(updateData).where(eq(users.id, ctx.user.id));

        if (input.vosRole) {
          await import("./db").then(m => m.createRoleHistoryEntry(ctx.user.id, input.vosRole!));
        }

        return { success: true };
      }),

    updateVosRole: protectedProcedure
      .input(z.object({
        vosRole: z.enum(["Sales", "CS", "Marketing", "Product", "Executive", "VE"])
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserVosRole(ctx.user.id, input.vosRole);
        await db.createRoleHistoryEntry(ctx.user.id, input.vosRole);
        return { success: true };
      }),

    updateMaturityLevel: protectedProcedure
      .input(z.object({
        level: z.number().min(0).max(5)
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserMaturityLevel(ctx.user.id, input.level);
        return { success: true };
      }),
  }),

  // Pillars
  pillars: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPillars();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPillarById(input.id);
      }),
    
    getByNumber: publicProcedure
      .input(z.object({ pillarNumber: z.number() }))
      .query(async ({ input }) => {
        return await db.getPillarByNumber(input.pillarNumber);
      }),
  }),

  // Progress tracking
  progress: router({
    getUserProgress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProgress(ctx.user.id);
    }),
    
    getPillarProgress: protectedProcedure
      .input(z.object({ pillarId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserPillarProgress(ctx.user.id, input.pillarId);
      }),
    
    updateProgress: protectedProcedure
      .input(z.object({
        pillarId: z.number(),
        status: z.enum(["not_started", "in_progress", "completed"]),
        completionPercentage: z.number().min(0).max(100),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertProgress({
          userId: ctx.user.id,
          pillarId: input.pillarId,
          status: input.status,
          completionPercentage: input.completionPercentage,
          lastAccessed: new Date(),
          completedAt: input.completedAt,
        });
        return { success: true };
      }),
  }),

  // Quiz management
  quiz: router({
    getQuestions: protectedProcedure
      .input(z.object({ pillarId: z.number() }))
      .query(async ({ input }) => {
        return await db.getQuizQuestionsByPillar(input.pillarId);
      }),
    
    submitQuiz: protectedProcedure
      .input(z.object({
        pillarId: z.number(),
        answers: z.array(z.object({
          questionId: z.number(),
          selectedAnswer: z.string(),
          isCorrect: z.boolean(),
          pointsEarned: z.number(),
        })),
        score: z.number(),
        categoryScores: z.record(z.string(), z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const passed = input.score >= 80;
        
        // Get attempt number
        const previousResults = await db.getUserQuizResults(ctx.user.id, input.pillarId);
        const attemptNumber = previousResults.length + 1;
        
        // Generate feedback based on score and maturity level
        const maturityLevel = ctx.user.maturityLevel ?? 0;
        const feedback = generateQuizFeedback(input.score, maturityLevel, input.categoryScores);
        
        // Save quiz result
        await db.createQuizResult({
          userId: ctx.user.id,
          pillarId: input.pillarId,
          score: input.score,
          categoryScores: input.categoryScores,
          answers: input.answers,
          feedback,
          passed,
          attemptNumber,
          completedAt: new Date(),
        });
        
        // If passed, award certification
        if (passed && ctx.user.vosRole) {
          const pillar = await db.getPillarById(input.pillarId);
          const badgeName = `${pillar?.title} - ${ctx.user.vosRole} Certified`;
          
          const alreadyCertified = await db.hasCertification(
            ctx.user.id,
            input.pillarId,
            ctx.user.vosRole
          );
          
          if (!alreadyCertified) {
            await db.createCertification({
              userId: ctx.user.id,
              badgeName,
              pillarId: input.pillarId,
              vosRole: ctx.user.vosRole,
              awardedAt: new Date(),
            });
          }
          
          // Update progress to completed
          await db.upsertProgress({
            userId: ctx.user.id,
            pillarId: input.pillarId,
            status: "completed",
            completionPercentage: 100,
            lastAccessed: new Date(),
            completedAt: new Date(),
          });
        }
        
        return {
          success: true,
          passed,
          feedback,
          attemptNumber,
        };
      }),
    
    getResults: protectedProcedure
      .input(z.object({ pillarId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserQuizResults(ctx.user.id, input.pillarId);
      }),
  }),

  // Certifications
  certifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCertifications(ctx.user.id);
    }),
  }),

  // Maturity assessments
  maturity: router({
    getAssessments: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserMaturityAssessments(ctx.user.id);
    }),
    
    createAssessment: protectedProcedure
      .input(z.object({
        level: z.number().min(0).max(5),
        assessmentData: z.object({
          selfAssessment: z.number(),
          quizAverage: z.number(),
          pillarsCompleted: z.number(),
          behaviorIndicators: z.array(z.string()),
          recommendations: z.array(z.string()),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createMaturityAssessment({
          userId: ctx.user.id,
          level: input.level,
          assessmentData: input.assessmentData,
          assessedAt: new Date(),
        });
        
        // Update user's maturity level
        await db.updateUserMaturityLevel(ctx.user.id, input.level);
        
        return { success: true };
      }),
  }),

  // Resources
  resources: router({
    list: publicProcedure.query(async () => {
      return await db.getAllResources();
    }),
    
    getByPillar: publicProcedure
      .input(z.object({ pillarId: z.number() }))
      .query(async ({ input }) => {
        return await db.getResourcesByPillar(input.pillarId);
      }),
    
    getByRole: publicProcedure
      .input(z.object({ vosRole: z.string() }))
      .query(async ({ input }) => {
        return await db.getResourcesByRole(input.vosRole);
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to generate quiz feedback
function generateQuizFeedback(
  score: number,
  maturityLevel: number,
  categoryScores?: Record<string, number>
) {
  const feedback: {
    overall: string;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  } = {
    overall: "",
    strengths: [],
    improvements: [],
    nextSteps: [],
  };

  // Overall feedback based on score
  if (score >= 90) {
    feedback.overall = "Excellent work! You've demonstrated strong mastery of this pillar's concepts.";
  } else if (score >= 80) {
    feedback.overall = "Good job! You've passed and shown solid understanding of the core concepts.";
  } else if (score >= 70) {
    feedback.overall = "You're close! Review the feedback below and retake the quiz to achieve certification.";
  } else {
    feedback.overall = "Keep learning! Focus on the improvement areas below and revisit the pillar content.";
  }

  // Maturity-based guidance
  if (maturityLevel <= 1) {
    feedback.nextSteps.push("Focus on building foundational knowledge through the pillar content");
    feedback.nextSteps.push("Review the KPI Definition Sheet and practice mapping pain to value");
  } else if (maturityLevel === 2) {
    feedback.nextSteps.push("Apply these concepts in cross-functional scenarios");
    feedback.nextSteps.push("Practice structured value realization tracking");
  } else {
    feedback.nextSteps.push("Integrate these concepts into automated workflows");
    feedback.nextSteps.push("Mentor others on value language and frameworks");
  }

  // Category-specific feedback
  if (categoryScores) {
    const categories = Object.entries(categoryScores);
    const strongCategories = categories.filter(([_, score]) => score >= 80);
    const weakCategories = categories.filter(([_, score]) => score < 70);

    strongCategories.forEach(([category]) => {
      feedback.strengths.push(`Strong performance in ${category}`);
    });

    weakCategories.forEach(([category]) => {
      feedback.improvements.push(`Review ${category} concepts and examples`);
    });
  }

  return feedback;
}
