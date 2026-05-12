import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../../plugins/firebase";
import { logoutUser } from "../../services/auth.service";
import { getUserProfile } from "../../services/user.service";
import type { UserProfile, User } from "../../models/user.model";
import { computePermissions } from "../../models/user.model";

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = useMemo<User | null>(() => {
    if (!firebaseUser) return null;
    return { ...firebaseUser, permissions: computePermissions(profile?.role) } as User;
  }, [firebaseUser, profile]);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    setProfile(await getUserProfile(firebaseUser.uid));
  }, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      setFirebaseUser(fbUser);

      if (fbUser) {
        const userProfile = await getUserProfile(fbUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const contextValue = useMemo(
    () => ({ user, profile, isLoading, logout, refreshProfile }),
    [user, profile, isLoading, logout, refreshProfile],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
