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
import { getUserProfile, listenUserProfile } from "../../services/user.service";
import type { UserProfile, User } from "../../models/user.model";
import { computePermissions } from "../../models/user.model";

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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
    let isMounted = true;
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (!isMounted) return;
      setIsLoading(true);
      setFirebaseUser(fbUser);

      unsubscribeProfile?.();
      unsubscribeProfile = null;

      if (fbUser) {
        unsubscribeProfile = listenUserProfile(fbUser.uid, (userProfile) => {
          if (!isMounted) return;
          setProfile(userProfile);
          setIsLoading(false);
          setIsInitialized(true);
        });
      } else {
        if (isMounted) {
          setProfile(null);
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ user, profile, isLoading, isInitialized, logout, refreshProfile }),
    [user, profile, isLoading, isInitialized, logout, refreshProfile],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
