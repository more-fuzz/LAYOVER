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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          base_points: number
          category: string
          created_at: string
          description: string
          difficulty: number
          estimated_cost: number | null
          id: string
          is_published: boolean
          latitude: number
          longitude: number
          name: string
          requirements: string[]
          safety_info: string
          slug: string
        }
        Insert: {
          base_points: number
          category: string
          created_at?: string
          description: string
          difficulty: number
          estimated_cost?: number | null
          id?: string
          is_published?: boolean
          latitude: number
          longitude: number
          name: string
          requirements?: string[]
          safety_info: string
          slug: string
        }
        Update: {
          base_points?: number
          category?: string
          created_at?: string
          description?: string
          difficulty?: number
          estimated_cost?: number | null
          id?: string
          is_published?: boolean
          latitude?: number
          longitude?: number
          name?: string
          requirements?: string[]
          safety_info?: string
          slug?: string
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          accepted_at: string
          id: string
          terms_version: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          terms_version: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          terms_version?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          access_notes: string | null
          category: string
          created_at: string
          description: string
          historical_context: string | null
          id: string
          is_published: boolean
          latitude: number
          longitude: number
          name: string
          source_url: string | null
        }
        Insert: {
          access_notes?: string | null
          category: string
          created_at?: string
          description: string
          historical_context?: string | null
          id?: string
          is_published?: boolean
          latitude: number
          longitude: number
          name: string
          source_url?: string | null
        }
        Update: {
          access_notes?: string | null
          category?: string
          created_at?: string
          description?: string
          historical_context?: string | null
          id?: string
          is_published?: boolean
          latitude?: number
          longitude?: number
          name?: string
          source_url?: string | null
        }
        Relationships: []
      }
      point_ledger: {
        Row: {
          created_at: string
          id: string
          points_delta: number
          reason: string
          submission_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_delta: number
          reason: string
          submission_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_delta?: number
          reason?: string
          submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_ledger_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          role: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
          role?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          reward_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent: number
          reward_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          reward_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          cost_points: number
          description: string
          id: string
          is_active: boolean
          name: string
          stock: number | null
        }
        Insert: {
          cost_points: number
          description: string
          id?: string
          is_active?: boolean
          name: string
          stock?: number | null
        }
        Update: {
          cost_points?: number
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          stock?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          activity_id: string
          claimed_latitude: number | null
          claimed_longitude: number | null
          evidence_path: string
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          claimed_latitude?: number | null
          claimed_longitude?: number | null
          evidence_path: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          claimed_latitude?: number | null
          claimed_longitude?: number | null
          evidence_path?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
