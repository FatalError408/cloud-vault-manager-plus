
import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService, cloudServices as defaultServices, defaultCategories } from "@/lib/storage-service";
import { CloudService, FileCategory, CloudFile } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

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

  // Initialize storage data
  useEffect(() => {
    // Load data from localStorage if available
    const savedServices = localStorage.getItem("cloud-vault-services");
    const savedCategories = localStorage.getItem("cloud-vault-categories");
    
    if (savedServices) {
      try {
        setCloudServices(JSON.parse(savedServices));
      } catch (e) {
        console.error("Failed to parse cloud services", e);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Update storage info whenever services change
  useEffect(() => {
    const storageInfo = storageService.getTotalStorageInfo();
    setTotalStorage(storageInfo.total);
    setUsedStorage(storageInfo.used);
    setAvailableStorage(storageInfo.available);
    
    // Save to localStorage
    localStorage.setItem("cloud-vault-services", JSON.stringify(cloudServices));
  }, [cloudServices]);

  // Save categories whenever they change
  useEffect(() => {
    localStorage.setItem("cloud-vault-categories", JSON.stringify(categories));
  }, [categories]);

  const linkService = (serviceId: string) => {
    const updatedServices = cloudServices.map(service => 
      service.id === serviceId ? { ...service, isLinked: true } : service
    );
    setCloudServices(updatedServices);
    
    toast({
      title: "Service Linked",
      description: `Successfully connected to ${updatedServices.find(s => s.id === serviceId)?.name}`,
    });
  };

  const unlinkService = (serviceId: string) => {
    const updatedServices = cloudServices.map(service => 
      service.id === serviceId ? { ...service, isLinked: false } : service
    );
    setCloudServices(updatedServices);
    
    toast({
      title: "Service Unlinked",
      description: `Disconnected from ${updatedServices.find(s => s.id === serviceId)?.name}`,
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
        
        // Find or create category
        let categoryIndex = categories.findIndex(c => c.id === categoryId);
        let targetCategory: FileCategory;
        
        if (categoryIndex === -1) {
          // Create new category
          targetCategory = {
            id: categoryId.toLowerCase().replace(/\s+/g, '-'),
            name: categoryId,
            files: []
          };
          setCategories(prev => [...prev, targetCategory]);
        } else {
          targetCategory = categories[categoryIndex];
        }
        
        // Select a random linked service
        const selectedService = linkedServices[Math.floor(Math.random() * linkedServices.length)];
        
        // Create the new file
        const newFile: CloudFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          category: targetCategory.id,
          lastModified: new Date(file.lastModified),
          service: selectedService.id
        };
        
        // Add file to category
        setCategories(prev => 
          prev.map(cat => cat.id === targetCategory.id 
            ? { ...cat, files: [...cat.files, newFile] } 
            : cat
          )
        );
        
        // Update used storage for the service
        const sizeInGB = file.size / (1024 * 1024 * 1024);
        setCloudServices(prev => 
          prev.map(service => service.id === selectedService.id
            ? { ...service, usedStorage: service.usedStorage + sizeInGB }
            : service
          )
        );
        
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully to ${selectedService.name}`,
        });
        
        resolve();
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
      // Find the category and file
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) return;
      
      const fileIndex = categories[categoryIndex].files.findIndex(f => f.id === fileId);
      if (fileIndex === -1) return;
      
      const file = categories[categoryIndex].files[fileIndex];
      
      // Update service used storage
      const serviceId = file.service;
      const sizeInGB = file.size / (1024 * 1024 * 1024);
      
      setCloudServices(prev => 
        prev.map(service => service.id === serviceId
          ? { ...service, usedStorage: Math.max(0, service.usedStorage - sizeInGB) }
          : service
        )
      );
      
      // Remove file from category
      setCategories(prev => 
        prev.map(cat => cat.id === categoryId
          ? { ...cat, files: cat.files.filter(f => f.id !== fileId) }
          : cat
        )
      );
      
      toast({
        title: "File Deleted",
        description: `${file.name} has been deleted`,
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
