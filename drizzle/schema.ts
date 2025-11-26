import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with VOS-specific fields for role and maturity tracking.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // VOS-specific fields
  vosRole: mysqlEnum("vosRole", ["Sales", "CS", "Marketing", "Product", "Executive", "VE"]),
  maturityLevel: int("maturityLevel").default(0).notNull(), // 0-5
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * VOS Pillars - 10 core training modules
 */
export const pillars = mysqlTable("pillars", {
  id: int("id").autoincrement().primaryKey(),
  pillarNumber: int("pillarNumber").notNull().unique(), // 1-10
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  targetMaturityLevel: int("targetMaturityLevel").notNull(), // 0-5
  duration: varchar("duration", { length: 50 }), // e.g., "30-45 minutes"
  content: json("content").$type<{
    overview: string;
    learningObjectives: string[];
    keyTakeaways: string[];
    resources: Array<{ title: string; url: string; type: string }>;
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pillar = typeof pillars.$inferSelect;
export type InsertPillar = typeof pillars.$inferInsert;

/**
 * User progress through pillars
 */
export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pillarId: int("pillarId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  completionPercentage: int("completionPercentage").default(0).notNull(), // 0-100
  lastAccessed: timestamp("lastAccessed").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

/**
 * Quiz questions for each pillar
 */
export const quizQuestions = mysqlTable("quizQuestions", {
  id: int("id").autoincrement().primaryKey(),
  pillarId: int("pillarId").notNull(),
  questionNumber: int("questionNumber").notNull(),
  questionType: mysqlEnum("questionType", ["multiple_choice", "scenario_based"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Value Definitions", "KPI Taxonomy"
  questionText: text("questionText").notNull(),
  options: json("options").$type<Array<{ id: string; text: string }>>(),
  correctAnswer: varchar("correctAnswer", { length: 10 }).notNull(),
  points: int("points").default(4).notNull(),
  
  // Maturity-based feedback
  feedback: json("feedback").$type<{
    correct: string;
    incorrect: string;
    maturityTips: {
      level0_1: string;
      level2: string;
      level3plus: string;
    };
  }>(),
  
  // Role-specific adaptations
  roleAdaptations: json("roleAdaptations").$type<{
    Sales?: string;
    CS?: string;
    Marketing?: string;
    Product?: string;
    Executive?: string;
    VE?: string;
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * Quiz results and submissions
 */
export const quizResults = mysqlTable("quizResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pillarId: int("pillarId").notNull(),
  score: int("score").notNull(), // 0-100
  
  // Category scores
  categoryScores: json("categoryScores").$type<{
    valueDefinitions?: number;
    kpiTaxonomy?: number;
    roiFrameworks?: number;
    overallApplication?: number;
  }>(),
  
  // User answers
  answers: json("answers").$type<Array<{
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>>(),
  
  // Feedback received
  feedback: json("feedback").$type<{
    overall: string;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  }>(),
  
  passed: boolean("passed").default(false).notNull(), // 80%+ threshold
  attemptNumber: int("attemptNumber").default(1).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;

/**
 * Certifications awarded to users
 */
export const certifications = mysqlTable("certifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeName: varchar("badgeName", { length: 255 }).notNull(),
  pillarId: int("pillarId").notNull(),
  vosRole: varchar("vosRole", { length: 50 }).notNull(),
  certificateUrl: text("certificateUrl"),
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

/**
 * Maturity assessments over time
 */
export const maturityAssessments = mysqlTable("maturityAssessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  level: int("level").notNull(), // 0-5
  
  // Assessment data
  assessmentData: json("assessmentData").$type<{
    selfAssessment: number;
    quizAverage: number;
    pillarsCompleted: number;
    behaviorIndicators: string[];
    recommendations: string[];
  }>(),
  
  assessedAt: timestamp("assessedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MaturityAssessment = typeof maturityAssessments.$inferSelect;
export type InsertMaturityAssessment = typeof maturityAssessments.$inferInsert;

/**
 * Resources library (KPI sheets, templates, frameworks)
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  resourceType: mysqlEnum("resourceType", ["kpi_sheet", "template", "framework", "guide", "playbook"]).notNull(),
  fileUrl: text("fileUrl").notNull(),
  pillarId: int("pillarId"), // null means available for all pillars
  vosRole: varchar("vosRole", { length: 50 }), // null means available for all roles
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Academy Progress - Detailed tracking for VOS Academy learning
 */
export const academyProgress = mysqlTable("academyProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Role and level tracking
  role: mysqlEnum("role", ["Sales", "CS", "Marketing", "Product", "Executive", "VE"]).notNull(),
  currentLevel: int("currentLevel").default(0).notNull(), // 0-5
  
  // Module progress
  modulesCompleted: json("modulesCompleted").$type<{
    [moduleId: string]: {
      status: 'not_started' | 'in_progress' | 'completed';
      score?: number;
      completedAt?: string;
      timeSpent?: number;
    };
  }>(),
  
  // Quiz performance
  quizzes: json("quizzes").$type<{
    [quizId: string]: {
      attempts: number;
      bestScore: number;
      lastAttempt: string;
      passed: boolean;
    };
  }>(),
  
  // Badge collection
  badges: json("badges").$type<{
    [badgeId: string]: {
      earnedAt: string;
      level: number;
      category: string;
    };
  }>(),
  
  // Overall maturity score (calculated)
  maturityScore: int("maturityScore").default(0).notNull(), // 0-100
  
  // Learning analytics
  totalTimeSpent: int("totalTimeSpent").default(0).notNull(), // minutes
  streakDays: int("streakDays").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AcademyProgress = typeof academyProgress.$inferSelect;
export type InsertAcademyProgress = typeof academyProgress.$inferInsert;

/**
 * Academy Modules - Individual learning modules within role tracks
 */
export const academyModules = mysqlTable("academyModules", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: varchar("moduleId", { length: 64 }).notNull().unique(),
  
  // Module metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  role: mysqlEnum("role", ["Sales", "CS", "Marketing", "Product", "Executive", "VE", "All"]).notNull(),
  level: int("level").notNull(), // 0-5
  
  // Content structure (JSON-driven)
  content: json("content").$type<{
    type: 'page';
    sections: Array<{
      component: string;
      props: Record<string, any>;
    }>;
  }>(),
  
  // Learning outcomes
  learningObjectives: json("learningObjectives").$type<string[]>(),
  requiredCompetencies: json("requiredCompetencies").$type<string[]>(),
  
  // Assessment
  quizId: varchar("quizId", { length: 64 }),
  simulationId: varchar("simulationId", { length: 64 }),
  passingScore: int("passingScore").default(80).notNull(),
  
  // Prerequisites
  prerequisites: json("prerequisites").$type<string[]>(),
  estimatedDuration: int("estimatedDuration").notNull(), // minutes
  
  // Status
  isPublished: boolean("isPublished").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AcademyModule = typeof academyModules.$inferSelect;
export type InsertAcademyModule = typeof academyModules.$inferInsert;

/**
 * AI Prompts Library - Curated prompts for VOS workflows
 */
export const aiPrompts = mysqlTable("aiPrompts", {
  id: int("id").autoincrement().primaryKey(),
  promptId: varchar("promptId", { length: 64 }).notNull().unique(),
  
  // Categorization
  category: mysqlEnum("category", [
    "discovery", "roi_modeling", "realization", "expansion", "governance"
  ]).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  
  // Prompt content
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  promptText: text("promptText").notNull(),
  
  // Usage guidelines
  usageGuidelines: json("usageGuidelines").$type<{
    inputs: string[];
    outputs: string;
    maturityLevel: number;
    examples: Array<{
      input: string;
      output: string;
    }>;
  }>(),
  
  // Role and level targeting
  targetRoles: json("targetRoles").$type<string[]>(),
  targetMaturityLevel: int("targetMaturityLevel").notNull(), // 0-5
  
  // Metadata
  tags: json("tags").$type<string[]>(),
  version: varchar("version", { length: 20 }).default("1.0").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AIPrompt = typeof aiPrompts.$inferSelect;
export type InsertAIPrompt = typeof aiPrompts.$inferInsert;

/**
 * Simulation Workflows - Interactive learning simulations
 */
export const simulations = mysqlTable("simulations", {
  id: int("id").autoincrement().primaryKey(),
  simulationId: varchar("simulationId", { length: 64 }).notNull().unique(),
  
  // Simulation metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("type", [
    "handoff", "decision_tree", "drag_drop", "role_play", "case_study"
  ]).notNull(),
  
  // Targeting
  targetRoles: json("targetRoles").$type<string[]>(),
  targetLevel: int("targetLevel").notNull(), // 0-5
  pillar: int("pillar").notNull(), // 1-10
  
  // Simulation flow
  flow: json("flow").$type<{
    steps: Array<{
      id: string;
      type: string;
      content: any;
      interactions: any;
      scoring: any;
    }>;
  }>(),
  
  // Scoring logic
  maxScore: int("maxScore").default(100).notNull(),
  passingScore: int("passingScore").default(80).notNull(),
  timeLimit: int("timeLimit"), // minutes, null for no limit
  
  // Status
  isPublished: boolean("isPublished").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = typeof simulations.$inferInsert;
