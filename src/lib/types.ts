
export interface CloudService {
  id: string;
  name: string;
  icon: string;
  totalStorage: number; // in GB
  usedStorage: number; // in GB
  isLinked: boolean;
  signUpUrl: string;
  color: string;
}

export interface CloudFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  category: string;
  lastModified: Date;
  service: string; // which cloud service the file is stored on
}

export interface FileCategory {
  id: string;
  name: string;
  files: CloudFile[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isLoggedIn: boolean;
}
