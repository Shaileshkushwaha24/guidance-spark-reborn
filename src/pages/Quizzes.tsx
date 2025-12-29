import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Target, Loader2 } from "lucide-react";
import { useQuizzes } from "@/hooks/useQuizzes";
import { QuizDifficulty } from "@/types/quiz";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Quizzes() {
  const { data: quizzes, isLoading, error } = useQuizzes();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const handleStartQuiz = (quizId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to take quizzes");
      navigate("/auth");
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-destructive">Failed to load quizzes</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Skill-Building Quizzes</h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge and build essential skills with interactive quizzes
          </p>
        </div>

        {quizzes && quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No quizzes available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span>Multiple questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{quiz.duration_minutes} min</span>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {formatDifficulty(quiz.difficulty)}
                  </Badge>
                  <Button 
                    className="w-full" 
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
