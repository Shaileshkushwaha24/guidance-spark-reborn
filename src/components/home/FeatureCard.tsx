import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  stats?: string;
  color?: string;
  delay?: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  link,
  stats,
  color = "primary",
  delay = 0,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={link}>
      <Card
        className="group relative h-full overflow-hidden border-2 bg-card card-hover cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

        <CardHeader className="relative">
          {/* Icon with animation */}
          <div
            className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 ${
              isHovered ? "scale-110 bg-primary shadow-glow" : ""
            }`}
          >
            <Icon
              className={`w-7 h-7 transition-colors duration-300 ${
                isHovered ? "text-primary-foreground" : "text-primary"
              }`}
            />
          </div>

          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          {stats && (
            <div className="mb-4 text-sm font-medium text-primary/80 bg-primary/5 rounded-lg px-3 py-1.5 inline-block">
              {stats}
            </div>
          )}

          <Button
            variant="ghost"
            className="p-0 h-auto font-medium text-primary group-hover:gap-3 gap-2 transition-all"
          >
            Explore now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
