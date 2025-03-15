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
      customers: {
        Row: {
          allergies: string[] | null
          created_at: string
          email: string | null
          id: number
          last_visit: string | null
          name: string
          phone: string | null
          preferences: string[] | null
          restaurant_id: string
          updated_at: string
          visits: number
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          email?: string | null
          id?: number
          last_visit?: string | null
          name: string
          phone?: string | null
          preferences?: string[] | null
          restaurant_id: string
          updated_at?: string
          visits?: number
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          email?: string | null
          id?: number
          last_visit?: string | null
          name?: string
          phone?: string | null
          preferences?: string[] | null
          restaurant_id?: string
          updated_at?: string
          visits?: number
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          available: boolean
          category: string
          course_type: string
          created_at: string
          description: string | null
          id: number
          name: string
          preparation_time: number
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          category: string
          course_type: string
          created_at?: string
          description?: string | null
          id?: number
          name: string
          preparation_time: number
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          category?: string
          course_type?: string
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          preparation_time?: number
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          completed_at: string | null
          course_type: string
          created_at: string
          id: number
          menu_item_id: number | null
          order_id: number
          quantity: number
          special_requests: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_type: string
          created_at?: string
          id?: number
          menu_item_id?: number | null
          order_id: number
          quantity: number
          special_requests?: string | null
          started_at?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_type?: string
          created_at?: string
          id?: number
          menu_item_id?: number | null
          order_id?: number
          quantity?: number
          special_requests?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          is_high_priority: boolean
          restaurant_id: string
          server_id: string | null
          special_notes: string | null
          status: string
          table_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_high_priority?: boolean
          restaurant_id: string
          server_id?: string | null
          special_notes?: string | null
          status: string
          table_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_high_priority?: boolean
          restaurant_id?: string
          server_id?: string | null
          special_notes?: string | null
          status?: string
          table_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          restaurant_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          restaurant_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          restaurant_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          customer_id: number | null
          customer_name: string
          date: string
          id: number
          party_size: number
          restaurant_id: string
          special_requests: string | null
          status: string
          table_ids: number[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: number | null
          customer_name: string
          date: string
          id?: number
          party_size: number
          restaurant_id: string
          special_requests?: string | null
          status: string
          table_ids?: number[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          customer_name?: string
          date?: string
          id?: number
          party_size?: number
          restaurant_id?: string
          special_requests?: string | null
          status?: string
          table_ids?: number[] | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          active_orders: number[] | null
          assigned_tables: number[] | null
          created_at: string
          id: string
          name: string
          restaurant_id: string
          role: string
          updated_at: string
        }
        Insert: {
          active_orders?: number[] | null
          assigned_tables?: number[] | null
          created_at?: string
          id?: string
          name: string
          restaurant_id: string
          role: string
          updated_at?: string
        }
        Update: {
          active_orders?: number[] | null
          assigned_tables?: number[] | null
          created_at?: string
          id?: string
          name?: string
          restaurant_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          assigned_server: string | null
          capacity: number
          combined_with: number[] | null
          created_at: string
          current_order: number | null
          id: number
          name: string
          restaurant_id: string
          size: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_server?: string | null
          capacity: number
          combined_with?: number[] | null
          created_at?: string
          current_order?: number | null
          id?: number
          name: string
          restaurant_id: string
          size: string
          status: string
          updated_at?: string
        }
        Update: {
          assigned_server?: string | null
          capacity?: number
          combined_with?: number[] | null
          created_at?: string
          current_order?: number | null
          id?: number
          name?: string
          restaurant_id?: string
          size?: string
          status?: string
          updated_at?: string
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
