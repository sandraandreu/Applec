import { type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import app from "../../plugins/firebase";

const auth = getAuth(app);

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  const contextValue = {user, logout};

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
