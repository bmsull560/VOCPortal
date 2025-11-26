import { ACADEMY_LESSONS } from "../data/lessons";
import { BlockRenderer } from "./BlockRenderer";

interface LessonPlayerProps {
  lessonId: string;
}

export function LessonPlayer({ lessonId }: LessonPlayerProps) {
  const lesson = ACADEMY_LESSONS[lessonId];

  if (!lesson) {
    return (
      <div className="text-sm text-red-600">
        Lesson not found: <span className="font-mono">{lessonId}</span>
      </div>
    );
  }

  return (
    <section className="border rounded-lg bg-background p-4 md:p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold mb-1">{lesson.title}</h2>
        {lesson.summary && (
          <p className="text-sm text-muted-foreground mb-2">{lesson.summary}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center rounded-full border px-2 py-0.5">
            Track: {lesson.roleTrack}
          </span>
          <span className="inline-flex items-center rounded-full border px-2 py-0.5">
            Level L{lesson.maturityLevel}
          </span>
          {lesson.estimatedMinutes && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5">
              ~{lesson.estimatedMinutes} min
            </span>
          )}
        </div>
      </header>

      <div>
        {lesson.blocks.map(block => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}
