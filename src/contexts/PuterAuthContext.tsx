
import React, { createContext, useContext, useEffect, useState } from "react";

// Make sure Puter SDK is loaded (add CDN in index.html if not present)
// import PuterJS from "puter-js"; // Uncomment if package is installed, or use window.PuterJS

export interface PuterUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface PuterAuthContextType {
  user: PuterUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const PuterAuthContext = createContext<PuterAuthContextType | undefined>(undefined);

export const PuterAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PuterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-load session on mount
    setIsLoading(true);
    (async () => {
      try {
        // @ts-ignore
        const session = await window.PuterJS?.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            avatarUrl: session.user.avatarUrl,
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore
      await window.PuterJS?.auth.loginWithPopup();
      // @ts-ignore
      const session = await window.PuterJS?.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          avatarUrl: session.user.avatarUrl,
        });
      }
    } catch (e) {
      // Optionally handle error or show toast
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore
      await window.PuterJS?.auth.logout();
      setUser(null);
    } catch (e) {
      // Optionally handle error or show toast
    }
    setIsLoading(false);
  };

  return (
    <PuterAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </PuterAuthContext.Provider>
  );
};

export const usePuterAuth = () => {
  const ctx = useContext(PuterAuthContext);
  if (!ctx) throw new Error("usePuterAuth must be used in PuterAuthProvider");
  return ctx;
};
