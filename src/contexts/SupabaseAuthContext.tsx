
import React, { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email || '',
        email: supabaseUser.email || '',
        photoUrl: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        isLoggedIn: true,
        joinDate: profile?.created_at || new Date().toISOString(),
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

      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setIsLoading(false);
    }
  };

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/CloudVaultManager',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Sign in failed",
        description: "Please try again or refresh the page",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setUser(null);
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of Cloud Vault Manager"
        });
      }
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

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name || user.name,
          avatar_url: updates.photoUrl || user.photoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const updatedUser = { 
        ...user, 
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      setUser(updatedUser);
      
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
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
