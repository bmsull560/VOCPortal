export type RoleTrackId = "Sales" | "CS" | "Marketing" | "Product" | "Executive" | "VE";
export type AcademyRole = RoleTrackId | "All";

export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type TextBlock = {
  id: string;
  type: "text";
  title?: string;
  body: string;
};

export type VideoBlock = {
  id: string;
  type: "video";
  title?: string;
  url: string;
  description?: string;
};

export type QuizBlock = {
  id: string;
  type: "quiz";
  title: string;
  quizId: string;
};

export type DownloadBlock = {
  id: string;
  type: "download";
  title: string;
  description?: string;
  url: string;
};

export type SimulationBlock = {
  id: string;
  type: "simulation";
  title: string;
  simulationId: string;
};

export type AICoachBlock = {
  id: string;
  type: "ai-coach";
  title: string;
  description?: string;
};

export type ContentBlock = TextBlock | VideoBlock | QuizBlock | DownloadBlock | SimulationBlock | AICoachBlock;

export interface AcademyLesson {
  id: string;
  title: string;
  summary?: string;
  targetRoles: AcademyRole[]; // Array allows multi-role targeting
  minMaturity: MaturityLevel; // Minimum maturity level required
  estimatedMinutes?: number;
  blocks: ContentBlock[];
}

// User profile for matrix filtering
export interface UserAcademyProfile {
  role: RoleTrackId;
  currentMaturity: MaturityLevel;
}
