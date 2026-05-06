import { type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../plugins/firebase";
import { logoutUser } from "../../services/auth.service";
import { getUserProfile } from "../../services/user.service";
import type { UserProfile } from "../../models/user.model";

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = async () => {
    await logoutUser();
  };

  const refreshProfile = async () => {
    if (!user) return;
    setProfile(await getUserProfile(user.uid));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setUser(firebaseUser);
      setProfile(firebaseUser ? await getUserProfile(firebaseUser.uid) : null);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const contextValue = { user, profile, isLoading, logout, refreshProfile };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
