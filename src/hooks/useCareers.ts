import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CareerPath, CareerFilters } from "@/types/career";

export const useCareers = (filters?: CareerFilters) => {
  return useQuery({
    queryKey: ["careers", filters],
    queryFn: async () => {
      let query = supabase
        .from("career_paths")
        .select("*")
        .eq("is_active", true)
        .order("demand_score", { ascending: false });

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters?.growthRate && filters.growthRate !== "all") {
        query = query.eq("growth_rate", filters.growthRate);
      }

      if (filters?.experienceLevel && filters.experienceLevel !== "all") {
        query = query.eq("experience_level", filters.experienceLevel);
      }

      if (filters?.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,short_description.ilike.%${filters.searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as CareerPath[];
    },
  });
};

export const useCareer = (id: string) => {
  return useQuery({
    queryKey: ["career", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("career_paths")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CareerPath;
    },
    enabled: !!id,
  });
};
