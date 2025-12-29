import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuizSummary as QuizSummaryType, QuizDifficulty } from "@/types/quiz";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, MinusCircle, Clock, Trophy, Target, ArrowLeft } from "lucide-react";

interface QuizSummaryProps {
  summary: QuizSummaryType;
  quizTitle: string;
}

const getLevelColor = (level: QuizDifficulty) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "advanced":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatLevel = (level: QuizDifficulty) => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export function QuizSummaryCard({ summary, quizTitle }: QuizSummaryProps) {
  const navigate = useNavigate();
  const scorePercentage = (summary.correct / summary.total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            summary.passed 
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-red-100 dark:bg-red-900/30"
          }`}>
            {summary.passed ? (
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <Target className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {summary.passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
          </CardTitle>
          <p className="text-muted-foreground">
            {quizTitle}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="space-y-2">
            <div className="text-5xl font-bold text-primary">
              {summary.accuracy}
            </div>
            <p className="text-muted-foreground">Accuracy</p>
            <Progress value={scorePercentage} className="h-3 max-w-xs mx-auto" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-2xl font-bold">{summary.correct}</span>
              </div>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{summary.wrong}</span>
              </div>
              <p className="text-sm text-muted-foreground">Wrong</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <MinusCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{summary.skipped}</span>
              </div>
              <p className="text-sm text-muted-foreground">Skipped</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{summary.timeTaken}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Recommended Level:</span>
              <Badge className={getLevelColor(summary.recommendedLevel)}>
                {formatLevel(summary.recommendedLevel)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
        <Button onClick={() => window.location.reload()}>
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}
