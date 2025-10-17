import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, BookOpen, Target } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Courses Completed", value: "12", icon: BookOpen, color: "text-blue-500" },
    { label: "Quizzes Passed", value: "24", icon: Target, color: "text-green-500" },
    { label: "Certificates Earned", value: "5", icon: Award, color: "text-purple-500" },
    { label: "Learning Streak", value: "15 days", icon: TrendingUp, color: "text-orange-500" }
  ];

  const learningTracks = [
    {
      title: "Full Stack Web Development",
      progress: 65,
      courses: 8,
      completed: 5,
      status: "In Progress"
    },
    {
      title: "Data Science & Analytics",
      progress: 30,
      courses: 10,
      completed: 3,
      status: "In Progress"
    },
    {
      title: "UX/UI Design Mastery",
      progress: 85,
      courses: 6,
      completed: 5,
      status: "Almost Done"
    },
    {
      title: "Product Management",
      progress: 45,
      courses: 7,
      completed: 3,
      status: "In Progress"
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Learning Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and monitor your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Learning Tracks</h2>
          <div className="grid gap-6">
            {learningTracks.map((track) => (
              <Card key={track.title}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{track.title}</CardTitle>
                      <CardDescription>
                        {track.completed} of {track.courses} courses completed
                      </CardDescription>
                    </div>
                    <Badge variant={track.progress >= 80 ? "default" : "secondary"}>
                      {track.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{track.progress}%</span>
                  </div>
                  <Progress value={track.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
