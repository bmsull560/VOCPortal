import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Sparkles, TrendingUp, Share2, X } from "lucide-react";

interface LevelUpCelebrationProps {
  newLevel: number;
  previousLevel: number;
  badgeEarned?: string;
  unlockedContent?: string[];
  onClose: () => void;
  onShare?: () => void;
}

const LEVEL_NAMES = [
  "Value Chaos",
  "Ad-hoc/Manual",
  "Performance Measurement",
  "Managed/Optimizing",
  "Predictive Analytics",
  "Value Orchestration"
];

const LEVEL_COLORS = [
  "from-red-500 to-red-600",
  "from-orange-500 to-orange-600",
  "from-yellow-500 to-yellow-600",
  "from-lime-500 to-lime-600",
  "from-green-500 to-green-600",
  "from-teal-500 to-teal-600"
];

export default function LevelUpCelebration({
  newLevel,
  previousLevel,
  badgeEarned,
  unlockedContent = [],
  onClose,
  onShare
}: LevelUpCelebrationProps) {
  const [show, setShow] = useState(true);
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfettiActive(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const defaultUnlockedContent = [
    `Level ${newLevel} lessons and content`,
    "Advanced quiz questions",
    "New role-specific simulations",
    `${LEVEL_NAMES[newLevel]} certification track`
  ];

  const unlocks = unlockedContent.length > 0 ? unlockedContent : defaultUnlockedContent;

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl overflow-hidden">
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <div className="relative inline-block">
                <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${LEVEL_COLORS[newLevel]} flex items-center justify-center text-white font-bold text-4xl shadow-lg animate-bounce`}>
                  L{newLevel}
                </div>
                <div className="absolute -top-2 -right-2 animate-spin-slow">
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold">Level Up!</DialogTitle>
            <DialogDescription className="text-lg">
              You've reached <strong>Level {newLevel}: {LEVEL_NAMES[newLevel]}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Achievement Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">
                      {badgeEarned || `${LEVEL_NAMES[newLevel]} Master`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Progressed from L{previousLevel} to L{newLevel}
                    </p>
                  </div>
                  <Badge className="text-lg px-4 py-2">
                    L{previousLevel} → L{newLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  New Content Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {unlocks.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {newLevel < 5 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Next goal: Reach <strong>Level {newLevel + 1}</strong>
                    </p>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {LEVEL_NAMES[newLevel + 1]}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Continue learning to unlock even more advanced content
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {newLevel === 5 && (
              <Card className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 border-teal-500/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-teal-600" />
                    <p className="font-bold text-lg text-teal-900 dark:text-teal-100 mb-2">
                      Maximum Level Achieved!
                    </p>
                    <p className="text-sm text-teal-700 dark:text-teal-300">
                      You've mastered the Value Operating System. You're now among the elite VOS practitioners.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              {onShare && (
                <Button variant="outline" onClick={onShare} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              )}
              <Button onClick={handleClose} className="flex-1">
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <style>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            top: -10%;
            transform: translateX(0) rotateZ(0deg);
          }
          100% {
            top: 110%;
            transform: translateX(${Math.random() * 100 - 50}px) rotateZ(360deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </Dialog>
  );
}
