import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download } from "lucide-react";

export default function Materials() {
  const materials = [
    {
      title: "Introduction to Programming",
      type: "PDF Guide",
      category: "Software Development",
      icon: FileText,
      description: "Comprehensive guide covering programming fundamentals, syntax, and best practices for beginners.",
      pages: "120 pages"
    },
    {
      title: "Data Science Fundamentals",
      type: "Video Course",
      category: "Data Science",
      icon: Video,
      description: "Video series covering statistics, Python programming, and machine learning basics.",
      duration: "8 hours"
    },
    {
      title: "UX Design Principles",
      type: "eBook",
      category: "Design",
      icon: BookOpen,
      description: "Learn the core principles of user experience design and how to create intuitive interfaces.",
      pages: "85 pages"
    },
    {
      title: "Product Management Guide",
      type: "PDF Guide",
      category: "Management",
      icon: FileText,
      description: "Essential guide for aspiring product managers covering strategy, roadmaps, and stakeholder management.",
      pages: "95 pages"
    },
    {
      title: "Web Development Bootcamp",
      type: "Video Course",
      category: "Software Development",
      icon: Video,
      description: "Complete bootcamp covering HTML, CSS, JavaScript, and modern web frameworks.",
      duration: "12 hours"
    },
    {
      title: "Career Planning Workbook",
      type: "eBook",
      category: "Career Development",
      icon: BookOpen,
      description: "Interactive workbook to help you plan and navigate your career journey effectively.",
      pages: "60 pages"
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Study Materials Library</h1>
          <p className="text-muted-foreground text-lg">
            Access curated learning resources to enhance your skills and knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const Icon = material.icon;
            return (
              <Card key={material.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{material.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{material.category}</Badge>
                    <span className="text-muted-foreground">
                      {material.pages || material.duration}
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Access Material
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
