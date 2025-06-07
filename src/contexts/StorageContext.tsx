
import React, { createContext, useContext, useState, useEffect } from "react";
import { cloudStorageService, CloudStorageConnection } from "@/lib/cloud-storage-service";
import { CloudService, FileCategory, CloudFile } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface StorageContextType {
  cloudServices: CloudService[];
  categories: FileCategory[];
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  linkService: (serviceId: string) => void;
  unlinkService: (serviceId: string) => void;
  uploadFile: (file: File, category: string) => Promise<void>;
  deleteFile: (fileId: string, categoryId: string) => void;
  isLoading: boolean;
  connections: CloudStorageConnection[];
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Default service configurations
const defaultServices: CloudService[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    icon: "cloud",
    totalStorage: 15,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://www.google.com/drive/",
    color: "#0077C2"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: "archive",
    totalStorage: 2,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://www.dropbox.com",
    color: "#0061FF"
  },
  {
    id: "mega",
    name: "Mega",
    icon: "database",
    totalStorage: 50,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://mega.nz",
    color: "#D9272E"
  },
  {
    id: "onedrive",
    name: "OneDrive",
    icon: "hard-drive",
    totalStorage: 5,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://onedrive.live.com",
    color: "#0078D4"
  }
];

const defaultCategories: FileCategory[] = [
  { id: "work", name: "Work", files: [] },
  { id: "documents", name: "Documents", files: [] },
  { id: "photos", name: "Photos", files: [] },
  { id: "videos", name: "Videos", files: [] }
];

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cloudServices, setCloudServices] = useState<CloudService[]>(defaultServices);
  const [categories, setCategories] = useState<FileCategory[]>(defaultCategories);
  const [connections, setConnections] = useState<CloudStorageConnection[]>([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load connections and update services when user logs in
  useEffect(() => {
    if (user) {
      loadConnections();
      loadFiles();
    } else {
      // Reset to default state when user logs out
      setCloudServices(defaultServices);
      setConnections([]);
      setCategories(defaultCategories);
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const userConnections = await cloudStorageService.getConnections();
      setConnections(userConnections);
      
      // Update services with connection status
      const updatedServices = defaultServices.map(service => {
        const connection = userConnections.find(conn => conn.service_name === service.id);
        if (connection) {
          return {
            ...service,
            isLinked: connection.is_active,
            totalStorage: Math.round(connection.storage_quota / (1024 * 1024 * 1024)), // Convert to GB
            usedStorage: Math.round(connection.storage_used / (1024 * 1024 * 1024))
          };
        }
        return service;
      });
      
      setCloudServices(updatedServices);
      
      // Calculate totals
      const total = updatedServices.reduce((sum, service) => 
        service.isLinked ? sum + service.totalStorage : sum, 0);
      const used = updatedServices.reduce((sum, service) => 
        service.isLinked ? sum + service.usedStorage : sum, 0);
      
      setTotalStorage(total);
      setUsedStorage(used);
      setAvailableStorage(total - used);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const files = await cloudStorageService.getFiles();
      
      // Group files by category
      const updatedCategories = defaultCategories.map(category => ({
        ...category,
        files: files
          .filter(file => file.category === category.id)
          .map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.mime_type || 'application/octet-stream',
            category: file.category,
            lastModified: new Date(file.created_at),
            service: file.service_name
          }))
      }));
      
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const linkService = async (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect cloud services",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (serviceId === 'google-drive') {
        await cloudStorageService.connectGoogleDrive();
      } else {
        // For other services, show a message that they're coming soon
        toast({
          title: "Coming Soon",
          description: `${cloudServices.find(s => s.id === serviceId)?.name} integration is coming soon!`,
        });
      }
    } catch (error) {
      console.error('Error linking service:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to the service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkService = async (serviceId: string) => {
    try {
      const connection = connections.find(conn => conn.service_name === serviceId);
      if (connection) {
        await cloudStorageService.disconnectService(connection.id);
        await loadConnections();
        
        toast({
          title: "Service disconnected",
          description: `Successfully disconnected from ${cloudServices.find(s => s.id === serviceId)?.name}`,
        });
      }
    } catch (error) {
      console.error('Error unlinking service:', error);
      toast({
        title: "Disconnect failed",
        description: "Failed to disconnect the service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (file: File, categoryId: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // This would typically upload to the connected cloud service
    // For now, we'll simulate the upload
    toast({
      title: "Upload simulated",
      description: `${file.name} upload simulation completed`,
    });
  };

  const deleteFile = async (fileId: string, categoryId: string) => {
    try {
      // Delete from database and reload files
      await loadFiles();
      
      toast({
        title: "File deleted",
        description: "File has been removed",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const value = {
    cloudServices,
    categories,
    totalStorage,
    usedStorage,
    availableStorage,
    linkService,
    unlinkService,
    uploadFile,
    deleteFile,
    isLoading,
    connections,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};
