
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isLoggedIn: boolean;
  joinDate?: string;
  lastLoginDate?: string;
  lastLogoutDate?: string;
  lastUpdated?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      fileUploads: boolean;
      storageAlerts: boolean;
    };
    privacy: {
      profileVisible: boolean;
      activityTracking: boolean;
    };
  };
}

export interface StorageService {
  id: string;
  name: string;
  type: 'google-drive' | 'dropbox' | 'onedrive' | 'box';
  isConnected: boolean;
  storageUsed: number;
  totalStorage: number;
  lastSync?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedDate: string;
  serviceId: string;
  path: string;
  thumbnailUrl?: string;
}
