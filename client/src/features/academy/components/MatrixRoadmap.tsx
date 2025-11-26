import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, PlayCircle, Clock } from "lucide-react";
import { useAcademyMatrix } from "../hooks/useAcademyMatrix";
import type { UserAcademyProfile, AcademyLesson } from "../types/schema";
import { useLocation } from "wouter";

interface MatrixRoadmapProps {
  userProfile: UserAcademyProfile;
}

export function MatrixRoadmap({ userProfile }: MatrixRoadmapProps) {
  const { lessonsByLevel, getLessonStatus, userProfile: profile } = useAcademyMatrix(userProfile);
  const [, setLocation] = useLocation();

  const levels = Object.keys(lessonsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Learning Path</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Track: <span className="font-semibold text-primary">{profile.role}</span>
            </span>
            <span className="text-muted-foreground">•</span>
            <span>
              Current Level:{" "}
              <span className="font-semibold text-primary">Level {profile.currentMaturity}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap by Level */}
      <div className="space-y-6">
        {levels.map((level) => {
          const lessons = lessonsByLevel[level];
          const isCurrentLevel = level === profile.currentMaturity;
          const isNextLevel = level === profile.currentMaturity + 1;
          const isPastLevel = level < profile.currentMaturity;

          return (
            <div key={level} className="relative">
              {/* Level Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isCurrentLevel
                      ? "bg-primary text-primary-foreground"
                      : isNextLevel
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : isPastLevel
                      ? "bg-green-100 text-green-900"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Level {level}
                </div>
                {isCurrentLevel && (
                  <Badge variant="default" className="text-xs">
                    Current
                  </Badge>
                )}
                {isNextLevel && (
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                    Next Up
                  </Badge>
                )}
              </div>

              {/* Lessons Grid */}
              <div className="grid gap-3">
                {lessons.map((lesson) => {
                  const status = getLessonStatus(lesson);
                  const isLocked = status === "locked";

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isLocked={isLocked}
                      onStart={() => setLocation(`/academy/lesson/${lesson.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {levels.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No lessons available for your current role and maturity level.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface LessonCardProps {
  lesson: AcademyLesson;
  isLocked: boolean;
  onStart: () => void;
}

function LessonCard({ lesson, isLocked, onStart }: LessonCardProps) {
  const isCompleted = false; // TODO: Connect to progress tracking

  return (
    <Card
      className={`transition-all ${
        isLocked
          ? "bg-muted/30 border-dashed opacity-75"
          : "hover:shadow-md hover:border-primary/50 cursor-pointer"
      }`}
      onClick={!isLocked ? onStart : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div
            className={`p-2 rounded-full flex-shrink-0 ${
              isLocked
                ? "bg-muted"
                : isCompleted
                ? "bg-green-100"
                : "bg-primary/10"
            }`}
          >
            {isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <PlayCircle className="h-4 w-4 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1 line-clamp-1">{lesson.title}</h4>
            {lesson.summary && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{lesson.summary}</p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2">
              {lesson.targetRoles.map((role) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
              {lesson.estimatedMinutes && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.estimatedMinutes} min
                </Badge>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="flex-shrink-0">
            {isLocked ? (
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Level {lesson.minMaturity}
              </span>
            ) : (
              <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                {isCompleted ? "Review" : "Start"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
