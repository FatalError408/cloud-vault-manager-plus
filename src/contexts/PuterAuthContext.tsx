
import React, { createContext, useContext, useState, useEffect } from "react";
import { puter } from "@puter/sdk";

interface PuterUser {
  id: string;
  email: string;
  fullName?: string;
}

interface PuterAuthContextType {
  user: PuterUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const PuterAuthContext = createContext<PuterAuthContextType | undefined>(undefined);

export const PuterAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PuterUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On mount, check if already signed in and listen for auth state changes
  useEffect(() => {
    async function checkCurrentUser() {
      setIsLoading(true);
      const session = puter.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.fullName,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }

    // Listen for auth state change events
    const unsub = puter.onAuthStateChanged((session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.fullName,
        });
      } else {
        setUser(null);
      }
    });

    checkCurrentUser();

    return () => unsub();
  }, []);

  // Sign in with Puter's popup
  const signIn = async () => {
    setIsLoading(true);
    await puter.auth.signInWithPopup();
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await puter.auth.signOut();
    setIsLoading(false);
  };

  return (
    <PuterAuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </PuterAuthContext.Provider>
  );
};

export function usePuterAuth(): PuterAuthContextType {
  const ctx = useContext(PuterAuthContext);
  if (!ctx) throw new Error("usePuterAuth must be used within PuterAuthProvider");
  return ctx;
}
