export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string | null
          game: string
          id: string
          player1: string
          player1_score: number
          player2: string
          player2_score: number
          start_time: string
          status: string
          thumbnail: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game: string
          id?: string
          player1: string
          player1_score?: number
          player2: string
          player2_score?: number
          start_time: string
          status?: string
          thumbnail?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game?: string
          id?: string
          player1?: string
          player1_score?: number
          player2?: string
          player2_score?: number
          start_time?: string
          status?: string
          thumbnail?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar: string | null
          country: string | null
          created_at: string | null
          earnings: number | null
          id: string
          losses: number
          name: string
          points: number
          rank: number
          team: string | null
          tournaments_won: number | null
          updated_at: string | null
          win_rate: number | null
          wins: number
        }
        Insert: {
          avatar?: string | null
          country?: string | null
          created_at?: string | null
          earnings?: number | null
          id?: string
          losses?: number
          name: string
          points?: number
          rank: number
          team?: string | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
          wins?: number
        }
        Update: {
          avatar?: string | null
          country?: string | null
          created_at?: string | null
          earnings?: number | null
          id?: string
          losses?: number
          name?: string
          points?: number
          rank?: number
          team?: string | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
          wins?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          earnings: number | null
          email: string | null
          game_id: string | null
          game_user_id: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          earnings?: number | null
          email?: string | null
          game_id?: string | null
          game_user_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          earnings?: number | null
          email?: string | null
          game_id?: string | null
          game_user_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          created_at: string
          id: string
          payment_amount: number | null
          payment_status: string | null
          player_game_id: string
          player_name: string
          registration_date: string
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          player_game_id: string
          player_name: string
          registration_date?: string
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          player_game_id?: string
          player_name?: string
          registration_date?: string
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_rooms: {
        Row: {
          created_at: string
          id: string
          room_id: string | null
          room_password: string | null
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id?: string | null
          room_password?: string | null
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string | null
          room_password?: string | null
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_rooms_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: true
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner: string | null
          created_at: string | null
          current_participants: number
          description: string | null
          end_date: string
          end_time: string | null
          entry_fee: string | null
          format: string | null
          game: string
          highlights: string[] | null
          id: string
          image: string | null
          max_participants: number
          name: string
          organizer: string | null
          overview_content: Json | null
          prize_pool: string
          prizes: string | null
          prizes_content: Json | null
          region: string | null
          registration_closes: string | null
          registration_opens: string | null
          rules: string | null
          schedule: string | null
          schedule_content: Json | null
          start_date: string
          start_time: string | null
          status: string
          team_size: string | null
          timer_duration: number | null
          timer_is_running: boolean | null
          timer_start_time: string | null
          updated_at: string | null
          winners: string | null
        }
        Insert: {
          banner?: string | null
          created_at?: string | null
          current_participants?: number
          description?: string | null
          end_date: string
          end_time?: string | null
          entry_fee?: string | null
          format?: string | null
          game: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          max_participants?: number
          name: string
          organizer?: string | null
          overview_content?: Json | null
          prize_pool: string
          prizes?: string | null
          prizes_content?: Json | null
          region?: string | null
          registration_closes?: string | null
          registration_opens?: string | null
          rules?: string | null
          schedule?: string | null
          schedule_content?: Json | null
          start_date: string
          start_time?: string | null
          status?: string
          team_size?: string | null
          timer_duration?: number | null
          timer_is_running?: boolean | null
          timer_start_time?: string | null
          updated_at?: string | null
          winners?: string | null
        }
        Update: {
          banner?: string | null
          created_at?: string | null
          current_participants?: number
          description?: string | null
          end_date?: string
          end_time?: string | null
          entry_fee?: string | null
          format?: string | null
          game?: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          max_participants?: number
          name?: string
          organizer?: string | null
          overview_content?: Json | null
          prize_pool?: string
          prizes?: string | null
          prizes_content?: Json | null
          region?: string | null
          registration_closes?: string | null
          registration_opens?: string | null
          rules?: string | null
          schedule?: string | null
          schedule_content?: Json | null
          start_date?: string
          start_time?: string | null
          status?: string
          team_size?: string | null
          timer_duration?: number | null
          timer_is_running?: boolean | null
          timer_start_time?: string | null
          updated_at?: string | null
          winners?: string | null
        }
        Relationships: []
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
  public: {
    Enums: {},
  },
} as const
