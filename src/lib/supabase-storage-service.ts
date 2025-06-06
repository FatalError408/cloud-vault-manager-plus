
import { supabase } from "./supabase";
import { CloudService, CloudFile, FileCategory } from "./types";

// Real cloud storage service implementation
class SupabaseStorageService {
  
  // Get user's cloud connections from database
  async getCloudServices(userId: string): Promise<CloudService[]> {
    const { data: connections, error } = await supabase
      .from('cloud_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching cloud connections:', error);
      return [];
    }

    return connections.map(conn => ({
      id: conn.id,
      name: conn.service_name,
      type: conn.service_type as any,
      icon: this.getServiceIcon(conn.service_type),
      totalStorage: conn.total_storage / (1024 * 1024 * 1024), // Convert bytes to GB
      usedStorage: conn.used_storage / (1024 * 1024 * 1024), // Convert bytes to GB
      isLinked: conn.is_active,
      signUpUrl: this.getSignUpUrl(conn.service_type),
      color: this.getServiceColor(conn.service_type)
    }));
  }

  // Get file categories with files from database
  async getCategories(userId: string): Promise<FileCategory[]> {
    const { data: files, error } = await supabase
      .from('file_metadata')
      .select(`
        *,
        cloud_connections!inner(service_name, service_type)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching files:', error);
      return [];
    }

    // Group files by category
    const categoryMap = new Map<string, FileCategory>();
    
    files?.forEach(file => {
      if (!categoryMap.has(file.category)) {
        categoryMap.set(file.category, {
          id: file.category.toLowerCase().replace(/\s+/g, '-'),
          name: file.category,
          files: [],
          totalSize: 0,
          color: this.getCategoryColor(file.category)
        });
      }

      const category = categoryMap.get(file.category)!;
      category.files.push({
        id: file.id,
        name: file.file_name,
        size: file.file_size,
        type: file.file_type as 'file' | 'folder',
        modifiedDate: file.updated_at,
        serviceId: file.cloud_connection_id,
        path: file.cloud_path
      });
      category.totalSize += file.file_size;
    });

    return Array.from(categoryMap.values());
  }

  // Link a new cloud service
  async linkService(userId: string, serviceType: string, accessToken: string, refreshToken?: string): Promise<void> {
    const serviceInfo = await this.getServiceInfo(serviceType, accessToken);
    
    const { error } = await supabase
      .from('cloud_connections')
      .insert({
        user_id: userId,
        service_type: serviceType as any,
        service_name: this.getServiceDisplayName(serviceType),
        access_token: accessToken,
        refresh_token: refreshToken,
        total_storage: serviceInfo.totalStorage,
        used_storage: serviceInfo.usedStorage,
        is_active: true
      });

    if (error) {
      throw new Error(`Failed to link ${serviceType}: ${error.message}`);
    }
  }

  // Unlink a cloud service
  async unlinkService(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('cloud_connections')
      .update({ is_active: false })
      .eq('id', connectionId);

    if (error) {
      throw new Error(`Failed to unlink service: ${error.message}`);
    }
  }

  // Upload file metadata to database
  async addFile(userId: string, file: File, category: string, cloudConnectionId: string, cloudFileId: string, cloudPath: string): Promise<void> {
    const { error } = await supabase
      .from('file_metadata')
      .insert({
        user_id: userId,
        cloud_connection_id: cloudConnectionId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        category: category,
        cloud_file_id: cloudFileId,
        cloud_path: cloudPath
      });

    if (error) {
      throw new Error(`Failed to save file metadata: ${error.message}`);
    }

    // Update used storage for the connection
    await this.updateUsedStorage(cloudConnectionId, file.size);
  }

  // Remove file from database
  async removeFile(fileId: string): Promise<void> {
    // Get file info first to update storage
    const { data: fileData, error: fetchError } = await supabase
      .from('file_metadata')
      .select('file_size, cloud_connection_id')
      .eq('id', fileId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch file data: ${fetchError.message}`);
    }

    // Delete file metadata
    const { error: deleteError } = await supabase
      .from('file_metadata')
      .delete()
      .eq('id', fileId);

    if (deleteError) {
      throw new Error(`Failed to delete file: ${deleteError.message}`);
    }

    // Update used storage
    await this.updateUsedStorage(fileData.cloud_connection_id, -fileData.file_size);
  }

  // Helper methods
  private async updateUsedStorage(connectionId: string, sizeChange: number): Promise<void> {
    const { error } = await supabase.rpc('update_used_storage', {
      connection_id: connectionId,
      size_change: sizeChange
    });

    if (error) {
      console.error('Error updating used storage:', error);
    }
  }

  private async getServiceInfo(serviceType: string, accessToken: string): Promise<{ totalStorage: number; usedStorage: number }> {
    // This would make actual API calls to each service
    // For now, returning mock data based on service type
    const defaultStorages: Record<string, { total: number; used: number }> = {
      'google-drive': { total: 15 * 1024 * 1024 * 1024, used: 0 }, // 15GB
      'dropbox': { total: 2 * 1024 * 1024 * 1024, used: 0 }, // 2GB
      'onedrive': { total: 5 * 1024 * 1024 * 1024, used: 0 }, // 5GB
      'box': { total: 10 * 1024 * 1024 * 1024, used: 0 }, // 10GB
      'mega': { total: 50 * 1024 * 1024 * 1024, used: 0 } // 50GB
    };

    return defaultStorages[serviceType] || { total: 0, used: 0 };
  }

  private getServiceIcon(serviceType: string): 'cloud' | 'archive' | 'database' | 'hard-drive' {
    const iconMap: Record<string, any> = {
      'google-drive': 'cloud',
      'dropbox': 'archive',
      'onedrive': 'hard-drive',
      'box': 'database',
      'mega': 'database'
    };
    return iconMap[serviceType] || 'cloud';
  }

  private getServiceColor(serviceType: string): string {
    const colorMap: Record<string, string> = {
      'google-drive': '#0077C2',
      'dropbox': '#0061FF',
      'onedrive': '#0078D4',
      'box': '#0061D5',
      'mega': '#D9272E'
    };
    return colorMap[serviceType] || '#666666';
  }

  private getSignUpUrl(serviceType: string): string {
    const urlMap: Record<string, string> = {
      'google-drive': 'https://www.google.com/drive/',
      'dropbox': 'https://www.dropbox.com',
      'onedrive': 'https://onedrive.live.com',
      'box': 'https://www.box.com',
      'mega': 'https://mega.nz'
    };
    return urlMap[serviceType] || '#';
  }

  private getServiceDisplayName(serviceType: string): string {
    const nameMap: Record<string, string> = {
      'google-drive': 'Google Drive',
      'dropbox': 'Dropbox',
      'onedrive': 'OneDrive',
      'box': 'Box',
      'mega': 'Mega'
    };
    return nameMap[serviceType] || serviceType;
  }

  private getCategoryColor(category: string): string {
    const colors = ['#0077C2', '#0061FF', '#D9272E', '#0078D4', '#4CB3FF', '#FF6B6B'];
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }
}

export const supabaseStorageService = new SupabaseStorageService();
