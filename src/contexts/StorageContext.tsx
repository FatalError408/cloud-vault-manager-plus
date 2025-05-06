
import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService, cloudServices as defaultServices, defaultCategories } from "@/lib/storage-service";
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
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cloudServices, setCloudServices] = useState<CloudService[]>([...defaultServices]);
  const [categories, setCategories] = useState<FileCategory[]>([...defaultCategories]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize storage data
  useEffect(() => {
    // Get data from storage service
    setCloudServices(storageService.getCloudServices());
    setCategories(storageService.getCategories());
    
    const storageInfo = storageService.getTotalStorageInfo();
    setTotalStorage(storageInfo.total);
    setUsedStorage(storageInfo.used);
    setAvailableStorage(storageInfo.available);
    
    setIsLoading(false);
  }, []);

  // Update whenever user changes (login/logout)
  useEffect(() => {
    if (user) {
      // If user logs in, refresh data
      setCloudServices(storageService.getCloudServices());
      setCategories(storageService.getCategories());
      
      const storageInfo = storageService.getTotalStorageInfo();
      setTotalStorage(storageInfo.total);
      setUsedStorage(storageInfo.used);
      setAvailableStorage(storageInfo.available);
    }
  }, [user]);

  // Update storage info whenever services change
  useEffect(() => {
    const storageInfo = storageService.getTotalStorageInfo();
    setTotalStorage(storageInfo.total);
    setUsedStorage(storageInfo.used);
    setAvailableStorage(storageInfo.available);
  }, [cloudServices]);

  const linkService = (serviceId: string) => {
    setIsLoading(true);
    
    // Simulate API connection to the actual service
    setTimeout(() => {
      storageService.linkService(serviceId);
      
      // Update state with service data
      setCloudServices(storageService.getCloudServices());
      
      toast({
        title: "Service Linked",
        description: `Successfully connected to ${cloudServices.find(s => s.id === serviceId)?.name}`,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const unlinkService = (serviceId: string) => {
    storageService.unlinkService(serviceId);
    setCloudServices(storageService.getCloudServices());
    
    toast({
      title: "Service Unlinked",
      description: `Disconnected from ${cloudServices.find(s => s.id === serviceId)?.name}`,
    });
  };

  const uploadFile = async (file: File, categoryId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Check if we have any linked services
        const linkedServices = cloudServices.filter(s => s.isLinked);
        if (linkedServices.length === 0) {
          toast({
            title: "Upload Failed",
            description: "Please link at least one cloud storage service first",
            variant: "destructive"
          });
          reject(new Error("No linked services"));
          return;
        }
        
        // Simulate file upload with progress
        const uploadStartTime = Date.now();
        const uploadDuration = Math.min(file.size / 100000, 3000); // Simulate larger files taking longer
        
        toast({
          title: "Uploading File",
          description: `${file.name} upload started...`,
        });

        setTimeout(() => {
          storageService.addFile(file, categoryId);
          
          // Update state with new file data
          setCategories(storageService.getCategories());
          setCloudServices(storageService.getCloudServices());
          
          toast({
            title: "File Uploaded",
            description: `${file.name} uploaded successfully to ${linkedServices[0].name}`,
          });
          
          resolve();
        }, uploadDuration);
      } catch (error) {
        console.error("Upload failed", error);
        toast({
          title: "Upload Failed",
          description: "An error occurred while uploading the file",
          variant: "destructive"
        });
        reject(error);
      }
    });
  };

  const deleteFile = (fileId: string, categoryId: string) => {
    try {
      // Find the category and file for toast notification
      const category = categories.find(c => c.id === categoryId);
      const file = category?.files.find(f => f.id === fileId);
      const fileName = file?.name || "File";
      
      storageService.removeFile(fileId, categoryId);
      
      // Update state with new data
      setCategories(storageService.getCategories());
      setCloudServices(storageService.getCloudServices());
      
      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted`,
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the file",
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
