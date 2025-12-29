import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Target } from "lucide-react";
import { Quiz, QuizDifficulty } from "@/types/quiz";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  quiz: Quiz & { skills?: { name: string; category?: string } };
  questionCount?: number;
}

const getDifficultyColor = (difficulty: QuizDifficulty) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatDifficulty = (difficulty: QuizDifficulty) => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

export function QuizCard({ quiz, questionCount }: QuizCardProps) {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          {quiz.skills && (
            <Badge variant="secondary">{quiz.skills.name}</Badge>
          )}
        </div>
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {questionCount !== undefined && (
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span>{questionCount} questions</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{quiz.duration_minutes} min</span>
          </div>
        </div>
        <Badge className={getDifficultyColor(quiz.difficulty)}>
          {formatDifficulty(quiz.difficulty)}
        </Badge>
        <Button className="w-full" onClick={handleStartQuiz}>
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
