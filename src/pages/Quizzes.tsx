import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Target } from "lucide-react";

export default function Quizzes() {
  const quizzes = [
    {
      title: "JavaScript Fundamentals",
      category: "Programming",
      questions: 25,
      duration: "20 min",
      difficulty: "Beginner",
      description: "Test your knowledge of JavaScript basics including variables, functions, and control structures."
    },
    {
      title: "Data Analysis with Python",
      category: "Data Science",
      questions: 30,
      duration: "25 min",
      difficulty: "Intermediate",
      description: "Assess your understanding of data manipulation, pandas, and basic statistical analysis."
    },
    {
      title: "UX Design Principles",
      category: "Design",
      questions: 20,
      duration: "15 min",
      difficulty: "Beginner",
      description: "Evaluate your knowledge of user experience design fundamentals and best practices."
    },
    {
      title: "Product Strategy",
      category: "Management",
      questions: 22,
      duration: "18 min",
      difficulty: "Intermediate",
      description: "Test your understanding of product roadmaps, prioritization, and stakeholder management."
    },
    {
      title: "React Development",
      category: "Programming",
      questions: 28,
      duration: "22 min",
      difficulty: "Advanced",
      description: "Challenge yourself with advanced React concepts including hooks, context, and performance optimization."
    },
    {
      title: "Machine Learning Basics",
      category: "Data Science",
      questions: 26,
      duration: "20 min",
      difficulty: "Intermediate",
      description: "Test your knowledge of ML algorithms, model evaluation, and supervised learning techniques."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Skill-Building Quizzes</h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge and build essential skills with interactive quizzes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{quiz.category}</Badge>
                </div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.duration}</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
                <Button className="w-full">Start Quiz</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
