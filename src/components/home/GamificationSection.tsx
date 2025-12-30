import { Trophy, Flame, Target, Zap, Star, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";

const badges = [
  { icon: Flame, label: "7 Day Streak", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Target, label: "Quiz Master", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Trophy, label: "Career Explorer", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Zap, label: "Fast Learner", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Star, label: "Top Performer", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Medal, label: "Achiever", color: "text-pink-500", bg: "bg-pink-500/10" },
];

export const GamificationSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-warning mb-6">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Gamified Learning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Motivated with{" "}
              <span className="gradient-text">Achievements</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Earn badges, maintain streaks, and track your progress as you explore careers 
              and build new skills. Learning becomes an adventure!
            </p>

            {/* Progress example */}
            <Card className="p-6 bg-card border-2">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Your Progress</span>
                <span className="text-primary font-bold">Level 5</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-1000"
                  style={{ width: "65%" }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>650 XP</span>
                <span>1000 XP to Level 6</span>
              </div>
            </Card>
          </div>

          {/* Right side - Badges grid */}
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="group p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-soft transition-all duration-300 text-center cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${badge.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${badge.color}`} />
                  </div>
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
