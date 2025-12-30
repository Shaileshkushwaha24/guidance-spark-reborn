export interface CareerPath {
  id: string;
  title: string;
  category: 'Technology' | 'Analytics' | 'Design' | 'Management' | 'Healthcare' | 'Finance' | 'Education' | 'Marketing';
  short_description: string;
  full_description: string | null;
  salary_min: number;
  salary_max: number;
  growth_rate: 'Low Growth' | 'Moderate Growth' | 'High Growth' | 'Very High Growth';
  skills: string[];
  education_required: string | null;
  experience_level: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Expert' | null;
  tools_technologies: string[] | null;
  demand_score: number | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerFilters {
  category?: string;
  growthRate?: string;
  experienceLevel?: string;
  searchQuery?: string;
}
