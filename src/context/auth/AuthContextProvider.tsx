import { type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "../../plugins/firebase";
import { logoutUser } from "../../services/auth.service";
import { getUserProfile } from "../../services/user.service";

const auth = getAuth(app);

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserName(profile?.userName ?? null);
      } else {
        setUserName(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const contextValue = { user, userName, isLoading, logout };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
