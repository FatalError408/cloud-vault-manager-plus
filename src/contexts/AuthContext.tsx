import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
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
      console.log("Loading Google API script...");
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google API script loaded successfully");
        initializeGoogleAuth();
      };
      script.onerror = () => {
        console.error("Failed to load Google API script");
        toast({
          title: "Authentication Error",
          description: "Failed to load Google authentication. Please refresh the page.",
          variant: "destructive"
        });
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      console.log("Initializing Google Auth...");
      if (!window.google) {
        console.error("Google API failed to load");
        setIsLoading(false);
        return;
      }

      try {
        // Get the current domain for proper configuration
        const currentDomain = window.location.origin;
        console.log("Current domain:", currentDomain);

        window.google.accounts.id.initialize({
          client_id: '212192605206-hgfped85t9rtu2ek0g731utottvedjt4.apps.googleusercontent.com',
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });
        console.log("Google Auth initialized successfully");
        setGapiLoaded(true);
        
        // Check if user is already logged in
        const savedUser = localStorage.getItem("cloud-vault-user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            // Validate the saved user data
            if (parsedUser.id && parsedUser.name && parsedUser.email) {
              setUser(parsedUser);
              console.log("User restored from localStorage", parsedUser);
              toast({
                title: "Welcome back!",
                description: `Signed in as ${parsedUser.name}`,
              });
            } else {
              console.log("Invalid saved user data, clearing localStorage");
              localStorage.removeItem("cloud-vault-user");
            }
          } catch (e) {
            console.error("Failed to parse user data", e);
            localStorage.removeItem("cloud-vault-user");
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Google Auth:", error);
        toast({
          title: "Authentication Setup Failed", 
          description: "Please refresh the page to try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    checkGoogleLibrary();
  }, []);

  // Handle Google callback with enhanced user data
  const handleGoogleCallback = (response: any) => {
    console.log("Google sign-in callback received", response);
    try {
      // Decode JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log("Decoded token payload:", payload);
      
      const googleUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        photoUrl: payload.picture,
        isLoggedIn: true,
        joinDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: false,
            fileUploads: true,
            storageAlerts: true
          },
          privacy: {
            profileVisible: true,
            activityTracking: false
          }
        }
      };

      setUser(googleUser);
      saveUserToStorage(googleUser);
      
      toast({
        title: "Welcome to Cloud Vault Manager!",
        description: `Successfully signed in as ${googleUser.name}`,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Sign in failed",
        description: "Could not process your Google sign-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced user storage
  const saveUserToStorage = (userData: User) => {
    try {
      localStorage.setItem("cloud-vault-user", JSON.stringify(userData));
      localStorage.setItem("cloud-vault-user-timestamp", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  };

  // Google Sign-In with better error handling
  const login = async (): Promise<void> => {
    console.log("Login requested, gapi loaded:", gapiLoaded);
    if (!gapiLoaded || !window.google) {
      toast({
        title: "Please wait",
        description: "Google authentication is still loading...",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Prompting Google sign-in...");
      
      // Check if we're in production and show appropriate message
      const isProduction = window.location.hostname !== 'localhost';
      if (isProduction) {
        console.log("Production environment detected");
      }
      
      // Show the Google One Tap prompt
      window.google.accounts.id.prompt((notification: any) => {
        console.log("Google prompt notification:", notification);
        if (notification.isNotDisplayed()) {
          console.log("Prompt not displayed, trying renderButton fallback");
          // Fallback: create a temporary sign-in button
          const tempDiv = document.createElement('div');
          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            type: 'standard'
          });
          tempDiv.click();
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Sign in failed",
        description: "Please try again or refresh the page",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Enhanced logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Update last logout time
      if (user) {
        const updatedUser = { ...user, lastLogoutDate: new Date().toISOString() };
        saveUserToStorage(updatedUser);
      }
      
      // Clear user data
      setUser(null);
      localStorage.removeItem("cloud-vault-user");
      localStorage.removeItem("cloud-vault-user-timestamp");
      
      // Sign out from Google
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of Cloud Vault Manager"
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

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { 
        ...user, 
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUserProfile }}>
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
