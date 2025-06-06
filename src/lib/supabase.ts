
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hpqqzsjcjfhjqxtkcdul.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcXF6c2pjamZoanF4dGtjZHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjEwNjgsImV4cCI6MjA2NDY5NzA2OH0.ISJdWurRwut7T_oYrtnWKHDf-IIp_nXUeUPjxEWS9Uo'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          updated_at?: string
        }
      }
      cloud_connections: {
        Row: {
          id: string
          user_id: string
          service_type: 'google-drive' | 'dropbox' | 'onedrive' | 'box' | 'mega'
          service_name: string
          access_token: string
          refresh_token?: string
          expires_at?: string
          total_storage: number
          used_storage: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_type: 'google-drive' | 'dropbox' | 'onedrive' | 'box' | 'mega'
          service_name: string
          access_token: string
          refresh_token?: string
          expires_at?: string
          total_storage: number
          used_storage: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          refresh_token?: string
          expires_at?: string
          total_storage?: number
          used_storage?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      file_metadata: {
        Row: {
          id: string
          user_id: string
          cloud_connection_id: string
          file_name: string
          file_size: number
          file_type: string
          category: string
          cloud_file_id: string
          cloud_path: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cloud_connection_id: string
          file_name: string
          file_size: number
          file_type: string
          category: string
          cloud_file_id: string
          cloud_path: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          file_name?: string
          file_size?: number
          category?: string
          cloud_path?: string
          updated_at?: string
        }
      }
    }
  }
}
