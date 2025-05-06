
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

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
  const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);

  // Load Google API
  useEffect(() => {
    const checkGoogleLibrary = () => {
      if (window.google && window.google.accounts) {
        initializeGoogleAuth();
      } else {
        loadGoogleAPI();
      }
    };

    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.body.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (!window.google) {
        console.error("Google API failed to load");
        setIsLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '212192605206-hgfped85t9rtu2ek0g731utottvedjt4.apps.googleusercontent.com',
        callback: handleGoogleCallback,
        auto_select: false
      });
      setGapiLoaded(true);
      
      // Check if user is already logged in
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
    };

    checkGoogleLibrary();
  }, []);

  // Handle Google callback
  const handleGoogleCallback = (response: CredentialResponse) => {
    try {
      // Decode JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      const googleUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        photoUrl: payload.picture,
        isLoggedIn: true
      };

      setUser(googleUser);
      localStorage.setItem("cloud-vault-user", JSON.stringify(googleUser));
      toast({
        title: "Sign in successful",
        description: `Welcome, ${googleUser.name}!`
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Sign in failed",
        description: "Could not sign in with Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In
  const login = async (): Promise<void> => {
    if (!gapiLoaded || !window.google) {
      toast({
        title: "Google API not loaded",
        description: "Please try again in a moment",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Display Google sign-in popup
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: "An error occurred during sign in",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Clear user data
      setUser(null);
      localStorage.removeItem("cloud-vault-user");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
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
