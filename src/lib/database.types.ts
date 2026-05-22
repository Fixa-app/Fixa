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
      clients: {
        Row: {
          id: string
          company_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          gps_lat: number | null
          gps_lng: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          vat_number: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          vat_number?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          vat_number?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_members: {
        Row: {
          id: string
          company_id: string
          user_id: string
          role: Database["public"]["Enums"]["company_role"]
          invited_by: string | null
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          role?: Database["public"]["Enums"]["company_role"]
          invited_by?: string | null
          invited_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["company_role"]
          invited_by?: string | null
          invited_at?: string
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      line_items: {
        Row: {
          id: string
          quote_id: string
          description: string
          quantity: number
          rate: number
          tax_percentage: number
          item_type: Database["public"]["Enums"]["line_item_type"]
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          description: string
          quantity?: number
          rate: number
          tax_percentage?: number
          item_type?: Database["public"]["Enums"]["line_item_type"]
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          description?: string
          quantity?: number
          rate?: number
          tax_percentage?: number
          item_type?: Database["public"]["Enums"]["line_item_type"]
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          user_id: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quote_activity: {
        Row: {
          id: string
          quote_id: string
          user_id: string | null
          activity_type: Database["public"]["Enums"]["quote_activity_type"]
          note: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          user_id?: string | null
          activity_type: Database["public"]["Enums"]["quote_activity_type"]
          note?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          user_id?: string | null
          activity_type?: Database["public"]["Enums"]["quote_activity_type"]
          note?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_activity_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quote_photos: {
        Row: {
          id: string
          quote_id: string
          storage_path: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          storage_path: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          storage_path?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_photos_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          id: string
          company_id: string
          client_id: string
          created_by_user_id: string
          status: Database["public"]["Enums"]["quote_status"]
          intro_text: string | null
          disclaimer: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          created_at: string
          updated_at: string
          sent_at: string | null
          approved_at: string | null
          converted_to_job_id: string | null
        }
        Insert: {
          id?: string
          company_id: string
          client_id: string
          created_by_user_id: string
          status?: Database["public"]["Enums"]["quote_status"]
          intro_text?: string | null
          disclaimer?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          approved_at?: string | null
          converted_to_job_id?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          client_id?: string
          created_by_user_id?: string
          status?: Database["public"]["Enums"]["quote_status"]
          intro_text?: string | null
          disclaimer?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          approved_at?: string | null
          converted_to_job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_companies: {
        Args: {
          p_user_id: string
        }
        Returns: {
          company_id: string
          company_name: string
          user_role: Database["public"]["Enums"]["company_role"]
          joined_at: string
        }[]
      }
      is_admin: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      is_company_admin: {
        Args: {
          p_company_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      is_company_member: {
        Args: {
          p_company_id: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      company_role: "owner" | "admin" | "member"
      line_item_type: "labor" | "material" | "other"
      quote_activity_type: 
        | "created"
        | "updated"
        | "sent"
        | "viewed"
        | "approved"
        | "declined"
        | "changes_requested"
        | "archived"
      quote_status:
        | "draft"
        | "ready_to_send"
        | "awaiting_response"
        | "changes_requested"
        | "approved"
        | "declined"
        | "archived"
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never