import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { CareerFilters as FilterType } from "@/types/career";

interface CareerFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export const CareerFilters = ({ filters, onFiltersChange }: CareerFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search careers, skills, or keywords..."
          value={filters.searchQuery || ""}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-10 bg-background/50"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        {/* Category Filter */}
        <Select
          value={filters.category || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[160px] bg-background/50">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Analytics">Analytics</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        {/* Growth Rate Filter */}
        <Select
          value={filters.growthRate || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, growthRate: value })}
        >
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Growth Rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Growth Rates</SelectItem>
            <SelectItem value="Very High Growth">Very High Growth</SelectItem>
            <SelectItem value="High Growth">High Growth</SelectItem>
            <SelectItem value="Moderate Growth">Moderate Growth</SelectItem>
            <SelectItem value="Low Growth">Low Growth</SelectItem>
          </SelectContent>
        </Select>

        {/* Experience Level Filter */}
        <Select
          value={filters.experienceLevel || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, experienceLevel: value })}
        >
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Entry Level">Entry Level</SelectItem>
            <SelectItem value="Mid Level">Mid Level</SelectItem>
            <SelectItem value="Senior Level">Senior Level</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
