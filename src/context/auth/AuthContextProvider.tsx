import { type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../plugins/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().userName);
        }
      } else {
        setUserName(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
     
  }, []);

  const contextValue = { user, userName, isLoading, logout };

  console.log(user)

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
