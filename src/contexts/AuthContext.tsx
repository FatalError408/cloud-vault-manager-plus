
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    // Check localStorage for saved user data
    const savedUser = localStorage.getItem("cloud-vault-user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("cloud-vault-user");
      }
    }
    
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app this would connect to Google OAuth
  const login = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would be replaced with actual Google OAuth
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: "Demo User",
        email: "demo.user@example.com",
        photoUrl: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff",
        isLoggedIn: true
      };
      
      setUser(mockUser);
      localStorage.setItem("cloud-vault-user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Clear user data
      setUser(null);
      localStorage.removeItem("cloud-vault-user");
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
