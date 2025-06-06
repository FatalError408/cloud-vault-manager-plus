
import { CloudService, CloudFile, FileCategory } from "./types";

// Default cloud services available
export const cloudServices: CloudService[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    type: "google-drive",
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
    type: "dropbox",
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
    type: "onedrive",
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
    type: "onedrive",
    icon: "hard-drive",
    totalStorage: 5,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://onedrive.live.com",
    color: "#0078D4"
  },
  {
    id: "pcloud",
    name: "pCloud",
    type: "box",
    icon: "cloud",
    totalStorage: 10,
    usedStorage: 0,
    isLinked: false,
    signUpUrl: "https://www.pcloud.com",
    color: "#4CB3FF"
  }
];

// Default file categories
export const defaultCategories: FileCategory[] = [
  { id: "work", name: "Work", files: [], totalSize: 0, color: "#0077C2" },
  { id: "documents", name: "Documents", files: [], totalSize: 0, color: "#0061FF" },
  { id: "photos", name: "Photos", files: [], totalSize: 0, color: "#D9272E" },
  { id: "videos", name: "Videos", files: [], totalSize: 0, color: "#0078D4" }
];

// Storage service for managing cloud storage and files
class StorageService {
  private services: CloudService[] = [...cloudServices];
  private categories: FileCategory[] = [...defaultCategories];

  // Get all cloud services
  getCloudServices(): CloudService[] {
    return this.services;
  }

  // Get all categories
  getCategories(): FileCategory[] {
    return this.categories;
  }

  // Link a cloud service
  linkService(serviceId: string): void {
    const serviceIndex = this.services.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
      // For demonstration, we simulate successful API connection with a delay
      setTimeout(() => {
        this.services[serviceIndex].isLinked = true;
        
        // Save to local storage
        this.saveToLocalStorage();
      }, 500);
    }
  }

  // Unlink a cloud service
  unlinkService(serviceId: string): void {
    const serviceIndex = this.services.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
      this.services[serviceIndex].isLinked = false;
      
      // Save to local storage
      this.saveToLocalStorage();
    }
  }
  
  // Save service and category data to localStorage
  saveToLocalStorage(): void {
    localStorage.setItem("cloud-vault-services", JSON.stringify(this.services));
    localStorage.setItem("cloud-vault-categories", JSON.stringify(this.categories));
  }
  
  // Load service and category data from localStorage
  loadFromLocalStorage(): void {
    const savedServices = localStorage.getItem("cloud-vault-services");
    const savedCategories = localStorage.getItem("cloud-vault-categories");
    
    if (savedServices) {
      try {
        this.services = JSON.parse(savedServices);
      } catch (e) {
        console.error("Failed to parse cloud services", e);
      }
    }
    
    if (savedCategories) {
      try {
        this.categories = JSON.parse(savedCategories);
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }
  }

  // Get total storage info
  getTotalStorageInfo(): { total: number; used: number; available: number } {
    const total = this.services.reduce((sum, service) => 
      service.isLinked ? sum + service.totalStorage : sum, 0);
    
    const used = this.services.reduce((sum, service) => 
      service.isLinked ? sum + service.usedStorage : sum, 0);
    
    return {
      total,
      used,
      available: total - used
    };
  }

  // Add a file to a category
  addFile(file: File, category: string): void {
    let targetCategoryIndex = this.categories.findIndex(c => c.id === category);
    
    if (targetCategoryIndex === -1) {
      // Create new category if it doesn't exist
      const newCategory: FileCategory = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        files: [],
        totalSize: 0,
        color: "#666666"
      };
      this.categories.push(newCategory);
      targetCategoryIndex = this.categories.length - 1;
    }

    // Randomly select a linked service to "store" the file
    const linkedServices = this.services.filter(service => service.isLinked);
    
    if (linkedServices.length === 0) {
      console.error("No linked cloud services available");
      return;
    }

    const selectedService = linkedServices[Math.floor(Math.random() * linkedServices.length)];
    
    // Add file to category
    const newFile: CloudFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type as 'file' | 'folder',
      modifiedDate: new Date(file.lastModified).toISOString(),
      serviceId: selectedService.id,
      path: `/${file.name}`
    };

    this.categories[targetCategoryIndex].files.push(newFile);
    this.categories[targetCategoryIndex].totalSize += file.size;
    
    // Update used storage for the service
    const serviceIndex = this.services.findIndex(s => s.id === selectedService.id);
    if (serviceIndex !== -1) {
      // Convert bytes to GB and add to used storage
      const sizeInGB = file.size / (1024 * 1024 * 1024);
      this.services[serviceIndex].usedStorage += sizeInGB;
      
      // Save to local storage after changes
      this.saveToLocalStorage();
    }
  }

  // Remove a file
  removeFile(fileId: string, categoryId: string): void {
    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      const fileIndex = this.categories[categoryIndex].files.findIndex(f => f.id === fileId);
      
      if (fileIndex !== -1) {
        const file = this.categories[categoryIndex].files[fileIndex];
        
        // Update service used storage
        const serviceIndex = this.services.findIndex(s => s.id === file.serviceId);
        if (serviceIndex !== -1) {
          const sizeInGB = file.size / (1024 * 1024 * 1024);
          this.services[serviceIndex].usedStorage = Math.max(0, this.services[serviceIndex].usedStorage - sizeInGB);
        }
        
        // Update category total size
        this.categories[categoryIndex].totalSize -= file.size;
        
        // Remove file
        this.categories[categoryIndex].files.splice(fileIndex, 1);
        
        // Save to local storage after changes
        this.saveToLocalStorage();
      }
    }
  }
  
  // Initialize service - load any saved data
  initialize(): void {
    this.loadFromLocalStorage();
  }
}

export const storageService = new StorageService();
storageService.initialize();
