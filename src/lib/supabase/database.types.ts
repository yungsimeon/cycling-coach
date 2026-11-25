export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      profiles: {
        Row: {
          ftp: number | null
          id: string
          lthr: number | null
          max_hr: number | null
        }
        Insert: {
          ftp?: number | null
          id: string
          lthr?: number | null
          max_hr?: number | null
        }
        Update: {
          ftp?: number | null
          id?: string
          lthr?: number | null
          max_hr?: number | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          avg_cadence: number | null
          avg_hr: number | null
          avg_power: number | null
          created_at: string
          description: string | null
          distance_m: number | null
          elevation_gain_m: number | null
          fit_file_path: string
          ftp: number | null
          hr_tss: number | null
          id: string
          intensity_factor: number | null
          lthr: number | null
          lthr_estimated: boolean | null
          moving_time_s: number
          name: string | null
          normalized_power: number | null
          peak_hr: number | null
          peak_power: number | null
          peak_speed_mps: number | null
          sport: string
          started_at: string
          time_in_hr_zones: Json | null
          time_in_zones: Json | null
          total_time_s: number
          tss: number | null
          user_id: string
          utc_offset_min: number | null
        }
        Insert: {
          avg_cadence?: number | null
          avg_hr?: number | null
          avg_power?: number | null
          created_at?: string
          description?: string | null
          distance_m?: number | null
          elevation_gain_m?: number | null
          fit_file_path: string
          ftp?: number | null
          hr_tss?: number | null
          id?: string
          intensity_factor?: number | null
          lthr?: number | null
          lthr_estimated?: boolean | null
          moving_time_s: number
          name?: string | null
          normalized_power?: number | null
          peak_hr?: number | null
          peak_power?: number | null
          peak_speed_mps?: number | null
          sport: string
          started_at: string
          time_in_hr_zones?: Json | null
          time_in_zones?: Json | null
          total_time_s: number
          tss?: number | null
          user_id: string
          utc_offset_min?: number | null
        }
        Update: {
          avg_cadence?: number | null
          avg_hr?: number | null
          avg_power?: number | null
          created_at?: string
          description?: string | null
          distance_m?: number | null
          elevation_gain_m?: number | null
          fit_file_path?: string
          ftp?: number | null
          hr_tss?: number | null
          id?: string
          intensity_factor?: number | null
          lthr?: number | null
          lthr_estimated?: boolean | null
          moving_time_s?: number
          name?: string | null
          normalized_power?: number | null
          peak_hr?: number | null
          peak_power?: number | null
          peak_speed_mps?: number | null
          sport?: string
          started_at?: string
          time_in_hr_zones?: Json | null
          time_in_zones?: Json | null
          total_time_s?: number
          tss?: number | null
          user_id?: string
          utc_offset_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_user_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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

