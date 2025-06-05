
import React, { createContext, useContext, useState, useEffect } from "react";
import { CloudService, FileCategory } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface StorageContextType {
  cloudServices: CloudService[];
  categories: FileCategory[];
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  linkService: (serviceType: string, accessToken: string, refreshToken?: string) => Promise<void>;
  unlinkService: (connectionId: string) => Promise<void>;
  uploadFile: (file: File, category: string) => Promise<void>;
  deleteFile: (fileId: string, categoryId: string) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const SupabaseStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cloudServices, setCloudServices] = useState<CloudService[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize with mock data for demo purposes
  useEffect(() => {
    if (user) {
      console.log("Initializing storage data for user:", user.id);
      initializeMockData();
    } else {
      console.log("No user, resetting storage data");
      resetData();
    }
  }, [user]);

  const initializeMockData = () => {
    console.log("Setting up mock storage data...");
    
    const mockServices: CloudService[] = [
      {
        id: "1",
        name: "Google Drive",
        type: "google-drive",
        icon: "cloud",
        totalStorage: 15,
        usedStorage: 3.2,
        isLinked: false,
        signUpUrl: "https://www.google.com/drive/",
        color: "#4285F4"
      },
      {
        id: "2",
        name: "Dropbox",
        type: "dropbox", 
        icon: "archive",
        totalStorage: 2,
        usedStorage: 0.5,
        isLinked: false,
        signUpUrl: "https://www.dropbox.com",
        color: "#0061FF"
      },
      {
        id: "3",
        name: "OneDrive",
        type: "onedrive",
        icon: "hard-drive",
        totalStorage: 5,
        usedStorage: 1.8,
        isLinked: false,
        signUpUrl: "https://onedrive.live.com",
        color: "#0078D4"
      },
      {
        id: "4",
        name: "Mega",
        type: "mega",
        icon: "database",
        totalStorage: 50,
        usedStorage: 5.1,
        isLinked: false,
        signUpUrl: "https://mega.nz",
        color: "#D9272E"
      }
    ];

    const mockCategories: FileCategory[] = [
      {
        id: "documents",
        name: "Documents",
        files: [],
        totalSize: 0,
        color: "#0077C2"
      },
      {
        id: "images", 
        name: "Images",
        files: [],
        totalSize: 0,
        color: "#0061FF"
      },
      {
        id: "videos",
        name: "Videos", 
        files: [],
        totalSize: 0,
        color: "#D9272E"
      },
      {
        id: "archives",
        name: "Archives",
        files: [],
        totalSize: 0,
        color: "#0078D4"
      }
    ];

    setCloudServices(mockServices);
    setCategories(mockCategories);
    
    const total = mockServices.reduce((sum, service) => sum + service.totalStorage, 0);
    const used = mockServices.reduce((sum, service) => sum + service.usedStorage, 0);
    
    setTotalStorage(total);
    setUsedStorage(used);
    setAvailableStorage(total - used);
    
    console.log("Mock data initialized:", { total, used, available: total - used });
  };

  const resetData = () => {
    setCloudServices([]);
    setCategories([]);
    setTotalStorage(0);
    setUsedStorage(0);
    setAvailableStorage(0);
  };

  const refreshData = async () => {
    if (!user) return;
    console.log("Refreshing storage data...");
    initializeMockData();
  };

  const linkService = async (serviceType: string, accessToken: string, refreshToken?: string) => {
    if (!user) return;
    
    console.log("Linking service:", serviceType);
    setIsLoading(true);
    
    try {
      // Simulate linking service
      const updatedServices = cloudServices.map(service => 
        service.type === serviceType 
          ? { ...service, isLinked: true }
          : service
      );
      
      setCloudServices(updatedServices);
      
      toast({
        title: "Service Linked",
        description: `Successfully connected to ${serviceType}`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Error linking service:', error);
      toast({
        title: "Link Failed",
        description: error instanceof Error ? error.message : "Failed to link service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkService = async (connectionId: string) => {
    console.log("Unlinking service:", connectionId);
    
    try {
      const updatedServices = cloudServices.map(service => 
        service.id === connectionId 
          ? { ...service, isLinked: false }
          : service
      );
      
      setCloudServices(updatedServices);
      
      toast({
        title: "Service Unlinked",
        description: "Successfully disconnected the service",
      });
    } catch (error) {
      console.error('Error unlinking service:', error);
      toast({
        title: "Unlink Failed",
        description: error instanceof Error ? error.message : "Failed to unlink service",
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (file: File, categoryId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    const linkedServices = cloudServices.filter(s => s.isLinked);
    if (linkedServices.length === 0) {
      toast({
        title: "Upload Failed",
        description: "Please link at least one cloud storage service first",
        variant: "destructive"
      });
      throw new Error("No linked services");
    }

    try {
      console.log("Uploading file:", file.name, "to category:", categoryId);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });

      await refreshData();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the file",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteFile = async (fileId: string, categoryId: string) => {
    try {
      console.log("Deleting file:", fileId, "from category:", categoryId);
      
      toast({
        title: "File Deleted",
        description: "File has been deleted successfully",
      });
      
      await refreshData();
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "An error occurred while deleting the file",
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
    refreshData,
  };

  console.log("Storage context render:", value);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a SupabaseStorageProvider");
  }
  return context;
};
