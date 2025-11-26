import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link, useParams } from "wouter";
import { LessonPlayer } from "../../features/academy/engine/LessonPlayer";
import { ACADEMY_LESSONS } from "../../features/academy/data/lessons";

export default function LessonView() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const lessonId = params.id;

  const lesson = lessonId ? ACADEMY_LESSONS[lessonId] : null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">Academy</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {lesson ? (
            <LessonPlayer lessonId={lessonId!} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Lesson Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The lesson you're looking for doesn't exist.
              </p>
              <Link href="/academy/dashboard">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
