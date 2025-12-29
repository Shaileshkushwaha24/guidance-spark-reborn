export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      counseling_sessions: {
        Row: {
          counselor_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          counselor_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          counselor_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counseling_sessions_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counseling_sessions_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "public_counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counseling_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      counselor_availability: {
        Row: {
          counselor_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          counselor_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          counselor_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_availability_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counselor_availability_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "public_counselor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      counselor_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          email: string
          experience_years: number | null
          full_name: string
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          languages: string[] | null
          phone: string | null
          profile_completion: number | null
          profile_picture_url: string | null
          qualifications: string | null
          rating: number | null
          specialization: string[] | null
          total_reviews: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string
          verification_document_url: string | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          phone?: string | null
          profile_completion?: number | null
          profile_picture_url?: string | null
          qualifications?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id: string
          verification_document_url?: string | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          phone?: string | null
          profile_completion?: number | null
          profile_picture_url?: string | null
          qualifications?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string
          verification_document_url?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          counselor_id: string
          created_at: string | null
          id: string
          rating: number
          session_id: string
          student_id: string
        }
        Insert: {
          comment?: string | null
          counselor_id: string
          created_at?: string | null
          id?: string
          rating: number
          session_id: string
          student_id: string
        }
        Update: {
          comment?: string | null
          counselor_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "public_counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "counseling_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          career_goals: string | null
          created_at: string | null
          date_of_birth: string | null
          education_level: string | null
          email: string
          full_name: string
          gender: string | null
          grade: string | null
          id: string
          interests: string[] | null
          learning_preferences: string[] | null
          phone: string | null
          preferred_countries: string[] | null
          preferred_courses: string[] | null
          profile_completion: number | null
          profile_picture_url: string | null
          school: string | null
          skills: string[] | null
          stream: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          career_goals?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email: string
          full_name: string
          gender?: string | null
          grade?: string | null
          id?: string
          interests?: string[] | null
          learning_preferences?: string[] | null
          phone?: string | null
          preferred_countries?: string[] | null
          preferred_courses?: string[] | null
          profile_completion?: number | null
          profile_picture_url?: string | null
          school?: string | null
          skills?: string[] | null
          stream?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          career_goals?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          grade?: string | null
          id?: string
          interests?: string[] | null
          learning_preferences?: string[] | null
          phone?: string | null
          preferred_countries?: string[] | null
          preferred_courses?: string[] | null
          profile_completion?: number | null
          profile_picture_url?: string | null
          school?: string | null
          skills?: string[] | null
          stream?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_counselor_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          experience_years: number | null
          full_name: string | null
          hourly_rate: number | null
          id: string | null
          is_available: boolean | null
          languages: string[] | null
          profile_picture_url: string | null
          qualifications: string | null
          rating: number | null
          specialization: string[] | null
          total_reviews: number | null
          total_sessions: number | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          experience_years?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_available?: boolean | null
          languages?: string[] | null
          profile_picture_url?: string | null
          qualifications?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          total_sessions?: number | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          experience_years?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_available?: boolean | null
          languages?: string[] | null
          profile_picture_url?: string | null
          qualifications?: string | null
          rating?: number | null
          specialization?: string[] | null
          total_reviews?: number | null
          total_sessions?: number | null
          verification_status?: string | null
        }
        Relationships: []
      }
      public_reviews: {
        Row: {
          comment: string | null
          counselor_id: string | null
          created_at: string | null
          id: string | null
          rating: number | null
          session_id: string | null
        }
        Insert: {
          comment?: string | null
          counselor_id?: string | null
          created_at?: string | null
          id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Update: {
          comment?: string | null
          counselor_id?: string | null
          created_at?: string | null
          id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "public_counselor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "counseling_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "counselor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "counselor", "admin"],
    },
  },
} as const
