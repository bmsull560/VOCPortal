import type { ContentBlock } from "../types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizEngine } from "../components/QuizEngine";
import { SimulationEngine } from "../components/SimulationEngine";
import { AICoachSimulation } from "../components/AICoachSimulation";

interface BlockRendererProps {
  block: ContentBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  if (block.type === "text") {
    return (
      <Card className="mb-4">
        {block.title && (
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {block.title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {block.body}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (block.type === "video") {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {block.title || "Lesson video"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="aspect-video w-full bg-muted flex items-center justify-center text-xs text-muted-foreground rounded-md">
            Video placeholder
          </div>
          {block.description && (
            <p className="text-xs text-muted-foreground">{block.description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (block.type === "download") {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {block.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          {block.description && (
            <p className="text-xs text-muted-foreground flex-1">
              {block.description}
            </p>
          )}
          <Button asChild size="sm" variant="outline">
            <a href={block.url} target="_blank" rel="noreferrer">
              Download
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (block.type === "quiz") {
    return (
      <div className="mb-4">
        <QuizEngine quizId={block.quizId} />
      </div>
    );
  }

  if (block.type === "simulation") {
    return (
      <div className="mb-4">
        <SimulationEngine simulationId={block.simulationId} />
      </div>
    );
  }

  if (block.type === "ai-coach") {
    return (
      <div className="mb-4">
        <AICoachSimulation
          lessonId="current-lesson" // TODO: Pass from parent context
          userRole="Sales" // TODO: Get from user context
          maturityLevel={1} // TODO: Get from user context
        />
      </div>
    );
  }

  return null;
}
