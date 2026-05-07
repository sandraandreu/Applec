import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const initializedRef = useRef(false);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    setProfile(await getUserProfile(user.uid));
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setUser(firebaseUser);
      setProfile(firebaseUser ? await getUserProfile(firebaseUser.uid) : null);
      setIsLoading(false);
      if (!initializedRef.current) {
        setIsInitialized(true);
        initializedRef.current = true;
      }
    });

    return unsubscribe;
  }, []);

  const contextValue = useMemo(
    () => ({ user, profile, isLoading, isInitialized, logout, refreshProfile }),
    [user, profile, isLoading, isInitialized, logout, refreshProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
