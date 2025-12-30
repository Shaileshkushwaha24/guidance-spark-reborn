import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { AnimatedText } from "./AnimatedText";
import { CareerSearchBar } from "./CareerSearchBar";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-primary/30 rounded-full blur-2xl float" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium">Join 10,000+ students exploring careers</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Find Your Perfect Path to{" "}
          <br className="hidden sm:block" />
          <AnimatedText />
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Discover careers that match your unique skills and passions. Get personalized guidance, 
          study materials, and skill-building resources.
        </p>

        {/* Search bar */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CareerSearchBar />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/auth?tab=signup">
            <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2 pulse-glow ripple group">
              Get Your Career Roadmap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg gap-2 border-2 hover:bg-primary/5">
              <Play className="w-5 h-5" />
              Take Free Assessment
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>1,000+ active students</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-warning">★</span>
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};
