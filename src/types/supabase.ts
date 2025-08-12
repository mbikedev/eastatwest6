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
      reservations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          reservation_date: string
          start_time: string
          end_time: string
          number_of_guests: number
          special_requests: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          reservation_date: string
          start_time: string
          end_time: string
          number_of_guests: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          reservation_date?: string
          start_time?: string
          end_time?: string
          number_of_guests?: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
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

// Type helper for the reservations table
export type Reservation = Database['public']['Tables']['reservations']['Row']
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert']
export type ReservationUpdate = Database['public']['Tables']['reservations']['Update']
