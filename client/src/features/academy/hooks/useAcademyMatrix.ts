import { useMemo } from "react";
import { ACADEMY_LESSONS } from "../data/lessons";
import type { AcademyLesson, UserAcademyProfile } from "../types/schema";

/**
 * Matrix Filter Hook
 * 
 * Filters the full curriculum to show only lessons that:
 * 1. Match the user's role (or are marked "All")
 * 2. Are at or below their current maturity level + 1 (to show "next step")
 * 
 * This creates a personalized learning path from the same source data.
 */
export function useAcademyMatrix(userProfile: UserAcademyProfile) {
  const filteredLessons = useMemo(() => {
    const lessons = Object.values(ACADEMY_LESSONS);

    return lessons.filter((lesson) => {
      // 1. Check Role Match
      const roleMatch =
        lesson.targetRoles.includes("All") ||
        lesson.targetRoles.includes(userProfile.role);

      // 2. Check Maturity (show current level and one level ahead as "locked preview")
      const levelVisible = lesson.minMaturity <= userProfile.currentMaturity + 1;

      return roleMatch && levelVisible;
    });
  }, [userProfile.role, userProfile.currentMaturity]);

  // Group by maturity level for roadmap visualization
  const lessonsByLevel = useMemo(() => {
    const grouped: Record<number, AcademyLesson[]> = {};
    filteredLessons.forEach((lesson) => {
      if (!grouped[lesson.minMaturity]) {
        grouped[lesson.minMaturity] = [];
      }
      grouped[lesson.minMaturity].push(lesson);
    });
    return grouped;
  }, [filteredLessons]);

  // Determine lesson status
  const getLessonStatus = (lesson: AcademyLesson) => {
    if (lesson.minMaturity > userProfile.currentMaturity) {
      return "locked";
    }
    // TODO: Connect to progress tracking
    return "available";
  };

  return {
    filteredLessons,
    lessonsByLevel,
    getLessonStatus,
    userProfile,
  };
}
