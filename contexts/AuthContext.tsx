import { auth } from "@/firebase/config";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  authReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  authReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Ensure anonymous sign-in
        await signInAnonymously(auth);
        return;
      }

      setUser(firebaseUser);
      setAuthReady(true);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
