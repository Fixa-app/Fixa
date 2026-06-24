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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          company_id: string
          created_at: string
          email: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          category: string | null
          city: string | null
          created_at: string
          email: string | null
          iban: string | null
          id: string
          kvk: string | null
          logo_url: string | null
          name: string
          phone: string | null
          postal: string | null
          street: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          iban?: string | null
          id?: string
          kvk?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          postal?: string | null
          street?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          iban?: string | null
          id?: string
          kvk?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal?: string | null
          street?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          last_parsed_quote_number: string | null
          next_quote_number: number | null
          quote_disclaimer: string | null
          quote_intro: string | null
          quote_number_format: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          last_parsed_quote_number?: string | null
          next_quote_number?: number | null
          quote_disclaimer?: string | null
          quote_intro?: string | null
          quote_number_format?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          last_parsed_quote_number?: string | null
          next_quote_number?: number | null
          quote_disclaimer?: string | null
          quote_intro?: string | null
          quote_number_format?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string | null
          company_id: string
          created_at: string
          created_by_user_id: string
          due_date: string | null
          id: string
          intro_text: string | null
          paid_at: string | null
          quote_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          company_id: string
          created_at?: string
          created_by_user_id: string
          due_date?: string | null
          id?: string
          intro_text?: string | null
          paid_at?: string | null
          quote_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          company_id?: string
          created_at?: string
          created_by_user_id?: string
          due_date?: string | null
          id?: string
          intro_text?: string | null
          paid_at?: string | null
          quote_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          item_type: Database["public"]["Enums"]["line_item_type"]
          margin_amount: number | null
          margin_percentage: number | null
          quantity: number
          quote_id: string
          rate: number
          sort_order: number
          tax_percentage: number
          title: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          item_type?: Database["public"]["Enums"]["line_item_type"]
          margin_amount?: number | null
          margin_percentage?: number | null
          quantity?: number
          quote_id: string
          rate: number
          sort_order?: number
          tax_percentage?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          item_type?: Database["public"]["Enums"]["line_item_type"]
          margin_amount?: number | null
          margin_percentage?: number | null
          quantity?: number
          quote_id?: string
          rate?: number
          sort_order?: number
          tax_percentage?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          item_type: string | null
          rate: number
          title: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          item_type?: string | null
          rate: number
          title: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          item_type?: string | null
          rate?: number
          title?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          created_at: string
          email: string
          is_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          created_at?: string
          email: string
          is_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          created_at?: string
          email?: string
          is_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_activity: {
        Row: {
          activity_type: Database["public"]["Enums"]["quote_activity_type"]
          created_at: string
          id: string
          metadata: Json | null
          note: string | null
          quote_id: string
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["quote_activity_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
          note?: string | null
          quote_id: string
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["quote_activity_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
          note?: string | null
          quote_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_activity_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_photos: {
        Row: {
          created_at: string
          id: string
          line_item_id: string | null
          quote_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_item_id?: string | null
          quote_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          line_item_id?: string | null
          quote_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_photos_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_photos_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          approved_at: string | null
          client_id: string
          company_id: string
          converted_to_job_id: string | null
          created_at: string
          created_by_user_id: string
          disclaimer: string | null
          id: string
          intro_text: string | null
          job_title: string | null
          quote_number: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          client_id: string
          company_id: string
          converted_to_job_id?: string | null
          created_at?: string
          created_by_user_id: string
          disclaimer?: string | null
          id?: string
          intro_text?: string | null
          job_title?: string | null
          quote_number?: string | null
          sent_at?: string | null
          status: Database["public"]["Enums"]["quote_status"]
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          client_id?: string
          company_id?: string
          converted_to_job_id?: string | null
          created_at?: string
          created_by_user_id?: string
          disclaimer?: string | null
          id?: string
          intro_text?: string | null
          job_title?: string | null
          quote_number?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      request_item_photos: {
        Row: {
          created_at: string | null
          id: string
          request_item_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_item_id: string
          storage_path: string
        }
        Update: {
          created_at?: string | null
          id?: string
          request_item_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_item_photos_request_item_id_fkey"
            columns: ["request_item_id"]
            isOneToOne: false
            referencedRelation: "request_items"
            referencedColumns: ["id"]
          },
        ]
      }
      request_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          request_id: string
          sort_order: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          request_id: string
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          request_id?: string
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          client_id: string | null
          company_id: string
          converted_to_quote_id: string | null
          created_at: string | null
          created_by_user_id: string
          id: string
          status: Database["public"]["Enums"]["request_status"]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          company_id: string
          converted_to_quote_id?: string | null
          created_at?: string | null
          created_by_user_id: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string
          converted_to_quote_id?: string | null
          created_at?: string | null
          created_by_user_id?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_converted_to_quote_id_fkey"
            columns: ["converted_to_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_companies: {
        Args: { p_user_id: string }
        Returns: {
          company_id: string
          company_name: string
          joined_at: string
          user_role: Database["public"]["Enums"]["company_role"]
        }[]
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      is_company_admin: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: boolean
      }
      is_company_member: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      company_role: "owner" | "admin" | "member"
      invoice_status:
        | "draft"
        | "awaiting_payment"
        | "past_due"
        | "paid"
        | "archived"
      line_item_type: "labor" | "material" | "other" | "transport"
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
        | "awaiting_response"
        | "changes_requested"
        | "ready_to_schedule"
        | "declined"
        | "archived"
      request_status: "created" | "converted" | "archived"
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
      company_role: ["owner", "admin", "member"],
      invoice_status: [
        "draft",
        "awaiting_payment",
        "past_due",
        "paid",
        "archived",
      ],
      line_item_type: ["labor", "material", "other", "transport"],
      quote_activity_type: [
        "created",
        "updated",
        "sent",
        "viewed",
        "approved",
        "declined",
        "changes_requested",
        "archived",
      ],
      quote_status: [
        "draft",
        "awaiting_response",
        "changes_requested",
        "ready_to_schedule",
        "declined",
        "archived",
      ],
      request_status: ["created", "converted", "archived"],
    },
  },
} as const
