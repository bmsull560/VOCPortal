import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User, CheckCircle } from "lucide-react";
import { ACADEMY_SIMULATIONS, type Simulation, type SimulationPrompt } from "../data/simulations";

interface SimulationEngineProps {
  simulationId: string;
  onComplete?: () => void;
}

export function SimulationEngine({ simulationId, onComplete }: SimulationEngineProps) {
  const simulation = ACADEMY_SIMULATIONS[simulationId];
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [conversation, setConversation] = useState<Array<{ speaker: string; text: string }>>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!simulation) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">
            Simulation not found: <span className="font-mono">{simulationId}</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentPrompt = simulation.prompts[currentPromptIndex];
  const isComplete = currentPromptIndex >= simulation.prompts.length;

  const handleSelectPrompt = () => {
    const newConversation = [
      ...conversation,
      { speaker: "You", text: currentPrompt.text },
      { speaker: simulation.persona.name, text: currentPrompt.response },
    ];
    setConversation(newConversation);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentPromptIndex < simulation.prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      onComplete?.();
    }
  };

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Simulation Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Great work! You've completed the discovery simulation. You successfully:
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Anchored the conversation in role-owned KPIs</li>
            <li>Quantified the baseline and gap vs. benchmark</li>
            <li>Uncovered pain points preventing KPI progress</li>
            <li>Built a quantified value hypothesis</li>
            <li>Identified cross-functional impact</li>
          </ul>
          <Button onClick={onComplete} className="w-full">
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{simulation.title}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <Badge variant="outline">
            {simulation.persona.name} - {simulation.persona.role}
          </Badge>
          <span>at {simulation.persona.company}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{simulation.description}</p>

        {/* Conversation History */}
        <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
          {conversation.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-4">
              Start the conversation by selecting a question below
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.speaker === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.speaker === "You"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">{msg.speaker}</div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Current Prompt */}
        {!showFeedback && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Step {currentPromptIndex + 1} of {simulation.prompts.length}
            </div>
            <Button onClick={handleSelectPrompt} variant="outline" className="w-full justify-start text-left h-auto py-3">
              <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{currentPrompt.text}</span>
            </Button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && currentPrompt.feedback && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-900">
              <CheckCircle className="h-4 w-4" />
              Feedback
            </div>
            <p className="text-sm text-green-800">{currentPrompt.feedback}</p>
            <Button onClick={handleNext} size="sm" className="w-full">
              {currentPromptIndex < simulation.prompts.length - 1 ? "Next Question" : "Complete"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
