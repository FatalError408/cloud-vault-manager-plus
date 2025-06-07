
import { supabase } from "@/integrations/supabase/client";

export interface CloudStorageConnection {
  id: string;
  service_name: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  storage_quota: number;
  storage_used: number;
  is_active: boolean;
}

export class CloudStorageService {
  // Get user's cloud connections
  async getConnections(): Promise<CloudStorageConnection[]> {
    const { data, error } = await supabase
      .from('cloud_connections')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching connections:', error);
      return [];
    }

    return data || [];
  }

  // Initiate Google Drive connection
  async connectGoogleDrive(): Promise<void> {
    const clientId = '212192605206-hgfped85t9rtu2ek0g731utottvedjt4.apps.googleusercontent.com';
    const redirectUri = `${window.location.origin}/auth/callback/google-drive`;
    const scope = 'https://www.googleapis.com/auth/drive';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Store service name in localStorage to identify the connection after redirect
    localStorage.setItem('pending_cloud_connection', 'google-drive');
    window.location.href = authUrl;
  }

  // Handle OAuth callback and store tokens
  async handleOAuthCallback(service: string, code: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Exchange code for tokens (this would typically be done in an edge function)
    // For now, we'll simulate storing the connection
    const { error } = await supabase
      .from('cloud_connections')
      .upsert({
        user_id: user.id,
        service_name: service,
        access_token: 'simulated_token_' + Date.now(),
        storage_quota: service === 'google-drive' ? 15 * 1024 * 1024 * 1024 : 2 * 1024 * 1024 * 1024, // 15GB for Google Drive, 2GB for others
        storage_used: 0,
        is_active: true
      });

    if (error) throw error;
  }

  // Disconnect a service
  async disconnectService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('cloud_connections')
      .update({ is_active: false })
      .eq('id', serviceId);

    if (error) throw error;
  }

  // Get files from all connected services
  async getFiles(): Promise<any[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      return [];
    }

    return data || [];
  }
}

export const cloudStorageService = new CloudStorageService();
