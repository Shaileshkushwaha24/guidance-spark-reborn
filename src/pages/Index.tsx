import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, BookOpen, CheckSquare, TrendingUp, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Compass,
      title: "Career Path Recommendations",
      description: "Discover career paths that match your skills, interests, and goals with our advanced recommendation system.",
      link: "/careers"
    },
    {
      icon: BookOpen,
      title: "Study Materials Library",
      description: "Access a comprehensive library of study materials, guides, and resources to help you prepare for your dream career.",
      link: "/materials"
    },
    {
      icon: CheckSquare,
      title: "Skill-Building Quizzes",
      description: "Test your knowledge and build essential skills with our interactive quizzes designed for various career paths.",
      link: "/quizzes"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress dashboards that help you stay on track toward your goals.",
      link: "/dashboard"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-accent to-primary/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Career Path</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover, explore and prepare for the career that matches your skills and passions with personalized guidance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Sign In</Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground">
              Our platform provides all the tools and resources you need to discover and prepare for your ideal career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}>
                      <Button variant="link" className="p-0">Learn more →</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Career Journey Today</h2>
            <p className="text-muted-foreground mb-8">
              Take the first step toward your dream career by exploring our platform's resources and tools.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Discover career paths that match your unique profile",
              "Access quality study materials curated by experts",
              "Test your knowledge with skill-building quizzes",
              "Track your progress and achieve your goals"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/auth?tab=signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
