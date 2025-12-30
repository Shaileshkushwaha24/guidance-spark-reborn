import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CareerPath } from "@/types/career";
import { 
  Code, BarChart3, Palette, Briefcase, Server, TrendingUp, 
  Shield, Brain, GraduationCap, Heart, DollarSign, Megaphone,
  ArrowRight, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  BarChart3,
  Palette,
  Briefcase,
  Server,
  TrendingUp,
  Shield,
  Brain,
  GraduationCap,
  Heart,
  DollarSign,
  Megaphone,
};

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Analytics: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  Management: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Healthcare: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Finance: "bg-green-500/10 text-green-600 border-green-500/20",
  Education: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Marketing: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const growthColors: Record<string, string> = {
  "Low Growth": "bg-gray-100 text-gray-600",
  "Moderate Growth": "bg-yellow-100 text-yellow-700",
  "High Growth": "bg-green-100 text-green-700",
  "Very High Growth": "bg-emerald-100 text-emerald-700",
};

interface CareerCardProps {
  career: CareerPath;
  onLearnMore?: (id: string) => void;
}

export const CareerCard = ({ career, onLearnMore }: CareerCardProps) => {
  const IconComponent = career.icon ? iconMap[career.icon] : Briefcase;
  
  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Demand indicator */}
      {career.demand_score && career.demand_score >= 9 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
          <Sparkles className="h-3 w-3" />
          Hot Career
        </div>
      )}

      <CardHeader className="relative pb-2">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
            {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {career.title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium", categoryColors[career.category])}
              >
                {career.category}
              </Badge>
              <Badge 
                variant="secondary" 
                className={cn("text-xs", growthColors[career.growth_rate])}
              >
                {career.growth_rate}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {career.short_description}
        </p>

        {/* Salary Range */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium text-foreground">
            {formatSalary(career.salary_min)} - {formatSalary(career.salary_max)}
          </span>
          <span className="text-muted-foreground text-xs">/year</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {career.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-md bg-muted/50 text-muted-foreground border border-border/50"
            >
              {skill}
            </span>
          ))}
          {career.skills.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-muted/50 text-muted-foreground border border-border/50">
              +{career.skills.length - 4} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative pt-0">
        <Button 
          variant="ghost" 
          className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          onClick={() => onLearnMore?.(career.id)}
        >
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
};
