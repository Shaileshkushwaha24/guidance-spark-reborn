import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Rocket } from "lucide-react";

const benefits = [
  "Personalized career recommendations",
  "500+ study materials & resources",
  "Interactive skill-building quizzes",
  "Progress tracking & analytics",
  "Expert career counseling",
];

export const CTASection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center text-primary-foreground">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in-up">
          <Rocket className="w-4 h-4" />
          <span className="text-sm font-medium">Start Your Journey Today</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Ready to Discover Your Perfect Career?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Join thousands of students who have found their path. Get started with a free 
          career assessment and unlock your potential.
        </p>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-left animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
            >
              <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <Link to="/auth?tab=signup">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl px-8 py-6 text-lg gap-2 group ripple"
            >
              Get Your Career Roadmap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 rounded-xl px-8 py-6 text-lg"
            >
              Take Free Assessment
            </Button>
          </Link>
        </div>

        {/* Trust note */}
        <p className="text-sm text-primary-foreground/60 mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          No credit card required · Free forever plan available
        </p>
      </div>
    </section>
  );
};
