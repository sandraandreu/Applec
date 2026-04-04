import { type ReactNode, useCallback, useEffect, useState } from "react";
import { GroupContext } from "./GroupContext";
import type { GroupData } from "./GroupContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../plugins/firebase";
import { useAuthContext } from "../auth/AuthContext";

const db = getFirestore(app);

export interface GroupContextProviderProps {
  children: ReactNode;
}

export const GroupContextProvider = ({
  children,
}: GroupContextProviderProps) => {
  const { user, isLoading: authLoading } = useAuthContext();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadGroup = useCallback(async () => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists() && userDoc.data().groupId) {
      const gId = userDoc.data().groupId;
      const groupDoc = await getDoc(doc(db, "groups", gId));
      if (groupDoc.exists()) {
        const data = groupDoc.data();
        setGroup({
          groupId: gId,
          name: data.name,
          description: data.description,
          inviteCode: data.inviteCode,
          adminId: data.adminId,
          members: data.members,
        });
      }
    }
    setIsLoading(false);
  }, [user]);

  const refreshGroup = async () => {
    setIsLoading(true);
    await loadGroup();
  };

  useEffect(() => {
    if (authLoading) return;

    if (user === null) {
      setGroup(null);
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    loadGroup();
  }, [user, authLoading, loadGroup]);

  const contextValue = {
    group,
    isLoading,
    refreshGroup,
  };

  console.log(group?.groupId)

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
