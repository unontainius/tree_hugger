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
      celebration: {
        Row: {
          created_at: string
          event_date: string | null
          event_type: string | null
          event_with: string | null
          id: number
          ordering: number | null
          owner: string | null
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          event_with?: string | null
          id?: number
          ordering?: number | null
          owner?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          event_with?: string | null
          id?: number
          ordering?: number | null
          owner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event_type"
            referencedColumns: ["event_name"]
          },
          {
            foreignKeyName: "event_event_with_fkey"
            columns: ["event_with"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      club: {
        Row: {
          club_name: string
          created_at: string
          id: number
        }
        Insert: {
          club_name: string
          created_at?: string
          id?: number
        }
        Update: {
          club_name?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      club_members: {
        Row: {
          club: number
          created_at: string
          id: number
          member: string
        }
        Insert: {
          club: number
          created_at?: string
          id?: number
          member: string
        }
        Update: {
          club?: number
          created_at?: string
          id?: number
          member?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_fkey"
            columns: ["club"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_member_fkey"
            columns: ["member"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      event_type: {
        Row: {
          created_at: string
          event_name: string
          ordering: number | null
        }
        Insert: {
          created_at?: string
          event_name: string
          ordering?: number | null
        }
        Update: {
          created_at?: string
          event_name?: string
          ordering?: number | null
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string
          id: number
          title: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      person: {
        Row: {
          alias: string | null
          born: string | null
          created_at: string
          died: string | null
          email: string | null
          first_name: string
          id: string
          image_url: string | null
          last_edited_by: string | null
          last_name: string
          maiden_name: string | null
          middle_name: string | null
          phone_number: string | null
          sex: Database["public"]["Enums"]["sexes"]
        }
        Insert: {
          alias?: string | null
          born?: string | null
          created_at?: string
          died?: string | null
          email?: string | null
          first_name: string
          id?: string
          image_url?: string | null
          last_edited_by?: string | null
          last_name: string
          maiden_name?: string | null
          middle_name?: string | null
          phone_number?: string | null
          sex?: Database["public"]["Enums"]["sexes"]
        }
        Update: {
          alias?: string | null
          born?: string | null
          created_at?: string
          died?: string | null
          email?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          last_edited_by?: string | null
          last_name?: string
          maiden_name?: string | null
          middle_name?: string | null
          phone_number?: string | null
          sex?: Database["public"]["Enums"]["sexes"]
        }
        Relationships: []
      }
      tie: {
        Row: {
          created_at: string
          id: number
          name_a: string
          name_b: string
          name_c: string | null
          person_a: string
          person_b: string
          person_c: string | null
          tie_relation: string
          tie_type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name_a: string
          name_b: string
          name_c?: string | null
          person_a: string
          person_b: string
          person_c?: string | null
          tie_relation: string
          tie_type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name_a?: string
          name_b?: string
          name_c?: string | null
          person_a?: string
          person_b?: string
          person_c?: string | null
          tie_relation?: string
          tie_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tie_person_a_fkey"
            columns: ["person_a"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tie_person_b_fkey"
            columns: ["person_b"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tie_person_c_fkey"
            columns: ["person_c"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tie_tie_relation_fkey"
            columns: ["tie_relation"]
            isOneToOne: false
            referencedRelation: "tie_relation"
            referencedColumns: ["tie_relation"]
          },
          {
            foreignKeyName: "tie_tie_type_fkey"
            columns: ["tie_type"]
            isOneToOne: false
            referencedRelation: "tie_type"
            referencedColumns: ["tie_type"]
          },
        ]
      }
      tie_relation: {
        Row: {
          created_at: string
          removeable: boolean | null
          tie_relation: string
        }
        Insert: {
          created_at?: string
          removeable?: boolean | null
          tie_relation: string
        }
        Update: {
          created_at?: string
          removeable?: boolean | null
          tie_relation?: string
        }
        Relationships: []
      }
      tie_type: {
        Row: {
          created_at: string
          tie_type: string
        }
        Insert: {
          created_at?: string
          tie_type: string
        }
        Update: {
          created_at?: string
          tie_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_couple_by_child: {
        Args: {
          child_id: string
        }
        Returns: string
      }
      get_partner_details: {
        Args: {
          partner_id: string
        }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      sexes: "Male" | "Female" | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

// Define and export types for each table's row structure
export type CelebrationRow = Database['public']['Tables']['celebration']['Row'];
export type ClubRow = Database['public']['Tables']['club']['Row'];
export type ClubMembersRow = Database['public']['Tables']['club_members']['Row'];
export type EventTypeRow = Database['public']['Tables']['event_type']['Row'];
export type ImagesRow = Database['public']['Tables']['images']['Row'];
export type PersonRow = Database['public']['Tables']['person']['Row'];
export type TieRow = Database['public']['Tables']['tie']['Row'];
export type TieRelationRow = Database['public']['Tables']['tie_relation']['Row'];
export type TieTypeRow = Database['public']['Tables']['tie_type']['Row'];

// You can also export Insert and Update types if needed
export type CelebrationInsert = Database['public']['Tables']['celebration']['Insert'];
export type ClubInsert = Database['public']['Tables']['club']['Insert'];
export type ClubMembersInsert = Database['public']['Tables']['club_members']['Insert'];
export type EventTypeInsert = Database['public']['Tables']['event_type']['Insert'];
export type ImagesInsert = Database['public']['Tables']['images']['Insert'];
export type PersonInsert = Database['public']['Tables']['person']['Insert'];
export type TieInsert = Database['public']['Tables']['tie']['Insert'];
export type TieRelationInsert = Database['public']['Tables']['tie_relation']['Insert'];
export type TieTypeInsert = Database['public']['Tables']['tie_type']['Insert'];

export type CelebrationUpdate = Database['public']['Tables']['celebration']['Update'];
export type ClubUpdate = Database['public']['Tables']['club']['Update'];
export type ClubMembersUpdate = Database['public']['Tables']['club_members']['Update'];
export type EventTypeUpdate = Database['public']['Tables']['event_type']['Update'];
export type ImagesUpdate = Database['public']['Tables']['images']['Update'];
export type PersonUpdate = Database['public']['Tables']['person']['Update'];
export type TieUpdate = Database['public']['Tables']['tie']['Update'];
export type TieRelationUpdate = Database['public']['Tables']['tie_relation']['Update'];
export type TieTypeUpdate = Database['public']['Tables']['tie_type']['Update'];
