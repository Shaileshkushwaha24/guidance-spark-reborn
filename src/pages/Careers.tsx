import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, DollarSign } from "lucide-react";

export default function Careers() {
  const careers = [
    {
      title: "Software Engineer",
      category: "Technology",
      salary: "$80k - $150k",
      growth: "High",
      description: "Design, develop, and maintain software applications. Work with cutting-edge technologies to solve complex problems.",
      skills: ["Programming", "Problem Solving", "Algorithms", "Teamwork"]
    },
    {
      title: "Data Scientist",
      category: "Analytics",
      salary: "$90k - $160k",
      growth: "Very High",
      description: "Analyze complex data sets to help organizations make better decisions using statistical methods and machine learning.",
      skills: ["Statistics", "Python", "Machine Learning", "Communication"]
    },
    {
      title: "UX Designer",
      category: "Design",
      salary: "$70k - $130k",
      growth: "High",
      description: "Create intuitive and engaging user experiences for digital products through research and design.",
      skills: ["Design Thinking", "User Research", "Prototyping", "Empathy"]
    },
    {
      title: "Product Manager",
      category: "Management",
      salary: "$85k - $145k",
      growth: "High",
      description: "Lead product development from conception to launch, working with cross-functional teams to deliver value.",
      skills: ["Strategy", "Leadership", "Communication", "Analysis"]
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Career Paths</h1>
          <p className="text-muted-foreground text-lg">
            Explore diverse career opportunities tailored to your skills and interests
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <Card key={career.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{career.category}</Badge>
                </div>
                <CardTitle className="text-2xl">{career.title}</CardTitle>
                <CardDescription className="text-base">{career.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{career.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{career.growth} Growth</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
