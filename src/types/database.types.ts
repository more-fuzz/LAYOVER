export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'traveler' | 'admin';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type RedemptionStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          description: string;
          difficulty: number;
          latitude: number;
          longitude: number;
          base_points: number;
          estimated_cost: number | null;
          requirements: string[];
          safety_info: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category: string;
          description: string;
          difficulty: number;
          latitude: number;
          longitude: number;
          base_points: number;
          estimated_cost?: number | null;
          requirements?: string[];
          safety_info: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string;
          description?: string;
          difficulty?: number;
          latitude?: number;
          longitude?: number;
          base_points?: number;
          estimated_cost?: number | null;
          requirements?: string[];
          safety_info?: string;
          is_published?: boolean;
          created_at?: string;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          historical_context: string | null;
          source_url: string | null;
          latitude: number;
          longitude: number;
          access_notes: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description: string;
          historical_context?: string | null;
          source_url?: string | null;
          latitude: number;
          longitude: number;
          access_notes?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string;
          historical_context?: string | null;
          source_url?: string | null;
          latitude?: number;
          longitude?: number;
          access_notes?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          activity_id: string;
          evidence_path: string;
          claimed_latitude: number | null;
          claimed_longitude: number | null;
          status: SubmissionStatus;
          reviewer_id: string | null;
          review_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_id: string;
          evidence_path: string;
          claimed_latitude?: number | null;
          claimed_longitude?: number | null;
          status?: SubmissionStatus;
          reviewer_id?: string | null;
          review_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_id?: string;
          evidence_path?: string;
          claimed_latitude?: number | null;
          claimed_longitude?: number | null;
          status?: SubmissionStatus;
          reviewer_id?: string | null;
          review_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
      };
      point_ledger: {
        Row: {
          id: string;
          user_id: string;
          submission_id: string | null;
          reason: string;
          points_delta: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          submission_id?: string | null;
          reason: string;
          points_delta: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          submission_id?: string | null;
          reason?: string;
          points_delta?: number;
          created_at?: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string;
          cost_points: number;
          stock: number | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          cost_points: number;
          stock?: number | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          cost_points?: number;
          stock?: number | null;
          is_active?: boolean;
        };
      };
      redemptions: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          points_spent: number;
          status: RedemptionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_id: string;
          points_spent: number;
          status?: RedemptionStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reward_id?: string;
          points_spent?: number;
          status?: RedemptionStatus;
          created_at?: string;
        };
      };
      consent_records: {
        Row: {
          id: string;
          user_id: string;
          terms_version: string;
          accepted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          terms_version: string;
          accepted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          terms_version?: string;
          accepted_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      submission_status: SubmissionStatus;
      redemption_status: RedemptionStatus;
    };
  };
}
