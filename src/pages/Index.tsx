import { Compass, BookOpen, CheckSquare, TrendingUp } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { StatsSection } from "@/components/home/StatsSection";
import { QuickQuizPreview } from "@/components/home/QuickQuizPreview";
import { GamificationSection } from "@/components/home/GamificationSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  const features = [
    {
      icon: Compass,
      title: "Career Path Recommendations",
      description: "Discover career paths that match your skills, interests, and goals with our AI-powered recommendation system.",
      link: "/careers",
      stats: "50+ career paths",
    },
    {
      icon: BookOpen,
      title: "Study Materials Library",
      description: "Access a comprehensive library of study materials, guides, and resources curated by industry experts.",
      link: "/materials",
      stats: "500+ resources",
    },
    {
      icon: CheckSquare,
      title: "Skill-Building Quizzes",
      description: "Test your knowledge and build essential skills with interactive quizzes designed for various career paths.",
      link: "/quizzes",
      stats: "100+ quizzes",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and insights to stay on track toward your goals.",
      link: "/dashboard",
      stats: "Real-time insights",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-accent/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Our platform provides all the tools and resources you need to discover 
              and prepare for your ideal career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                stats={feature.stats}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Quiz Preview */}
      <QuickQuizPreview />

      {/* Gamification Section */}
      <GamificationSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
};

export default Index;
