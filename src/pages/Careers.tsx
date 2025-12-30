import { useState } from "react";
import { useCareers } from "@/hooks/useCareers";
import { CareerCard } from "@/components/careers/CareerCard";
import { CareerFilters } from "@/components/careers/CareerFilters";
import { CareerDetailModal } from "@/components/careers/CareerDetailModal";
import { CareerFilters as FilterType } from "@/types/career";
import { Loader2, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Careers() {
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: careers, isLoading, error } = useCareers(filters);

  const handleLearnMore = (id: string) => {
    setSelectedCareerId(id);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Compass className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Explore Career Paths
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Discover your perfect career match from {careers?.length || 0}+ opportunities
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Take Career Assessment
            </Button>
            <Button variant="outline">
              Browse All Categories
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Filters */}
        <CareerFilters filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading careers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load careers. Please try again.</p>
            </div>
          ) : careers && careers.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{careers.length}</span> career paths
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careers.map((career) => (
                  <CareerCard 
                    key={career.id} 
                    career={career} 
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No careers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <CareerDetailModal 
        careerId={selectedCareerId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
