
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseStorageService } from "@/lib/supabase-storage-service";
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize storage data when user logs in
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Reset data when user logs out
      setCloudServices([]);
      setCategories([]);
      setTotalStorage(0);
      setUsedStorage(0);
      setAvailableStorage(0);
      setIsLoading(false);
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [services, cats] = await Promise.all([
        supabaseStorageService.getCloudServices(user.id),
        supabaseStorageService.getCategories(user.id)
      ]);

      setCloudServices(services);
      setCategories(cats);

      // Calculate totals
      const total = services.reduce((sum, service) => sum + service.totalStorage, 0);
      const used = services.reduce((sum, service) => sum + service.usedStorage, 0);
      
      setTotalStorage(total);
      setUsedStorage(used);
      setAvailableStorage(total - used);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Error",
        description: "Failed to load storage data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const linkService = async (serviceType: string, accessToken: string, refreshToken?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await supabaseStorageService.linkService(user.id, serviceType, accessToken, refreshToken);
      
      toast({
        title: "Service Linked",
        description: `Successfully connected to ${serviceType}`,
      });
      
      await refreshData();
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
    try {
      await supabaseStorageService.unlinkService(connectionId);
      
      toast({
        title: "Service Unlinked",
        description: "Successfully disconnected the service",
      });
      
      await refreshData();
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
    
    // Check if we have any linked services
    const linkedServices = cloudServices.filter(s => s.isLinked);
    if (linkedServices.length === 0) {
      toast({
        title: "Upload Failed",
        description: "Please link at least one cloud storage service first",
        variant: "destructive"
      });
      throw new Error("No linked services");
    }

    // Select service with most available space
    const selectedService = linkedServices.reduce((prev, curr) => 
      (curr.totalStorage - curr.usedStorage) > (prev.totalStorage - prev.usedStorage) ? curr : prev
    );

    try {
      // Simulate cloud upload (in real implementation, this would upload to the actual service)
      const cloudFileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const cloudPath = `/${categoryId}/${file.name}`;

      await supabaseStorageService.addFile(
        user.id,
        file,
        categoryId,
        selectedService.id,
        cloudFileId,
        cloudPath
      );

      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully to ${selectedService.name}`,
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
      await supabaseStorageService.removeFile(fileId);
      
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

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a SupabaseStorageProvider");
  }
  return context;
};
