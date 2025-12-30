import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCareer } from "@/hooks/useCareers";
import { 
  Code, BarChart3, Palette, Briefcase, Server, TrendingUp, 
  Shield, Brain, GraduationCap, Heart, DollarSign, Megaphone,
  BookOpen, Wrench, Target, Loader2
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, BarChart3, Palette, Briefcase, Server, TrendingUp, 
  Shield, Brain, GraduationCap, Heart, DollarSign, Megaphone,
};

interface CareerDetailModalProps {
  careerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CareerDetailModal = ({ careerId, open, onOpenChange }: CareerDetailModalProps) => {
  const { data: career, isLoading } = useCareer(careerId || "");

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const IconComponent = career?.icon ? iconMap[career.icon] : Briefcase;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : career ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                  {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{career.title}</DialogTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {career.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {career.growth_rate}
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">About This Career</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {career.full_description || career.short_description}
                </p>
              </div>

              <Separator />

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Salary Range</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatSalary(career.salary_min)} - {formatSalary(career.salary_max)}/year
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Demand Score</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {career.demand_score}/10
                  </p>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Education Required</span>
                  </div>
                  <p className="text-foreground text-sm">
                    {career.education_required || "Not specified"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm font-medium">Experience Level</span>
                  </div>
                  <p className="text-foreground text-sm">
                    {career.experience_level || "Not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Key Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              {career.tools_technologies && career.tools_technologies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">Tools & Technologies</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {career.tools_technologies.map((tool, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* CTA */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  Start Learning Path
                </Button>
                <Button variant="outline" className="flex-1">
                  Take Career Assessment
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Career not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
