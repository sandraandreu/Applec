import { type ReactNode, useCallback, useEffect, useState } from "react";
import { GroupContext } from "./GroupContext";
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

  const [groupId, setGroupId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [members, setMembers] = useState<
    { uid: string; role: string }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadGroup = useCallback(async () => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists() && userDoc.data().groupId) {
      const gId = userDoc.data().groupId;
      const groupDoc = await getDoc(doc(db, "groups", gId));
      if (groupDoc.exists()) {
        const data = groupDoc.data();
        setGroupId(gId);
        setName(data.name);
        setDescription(data.description);
        setInviteCode(data.inviteCode);
        setAdminId(data.adminId);
        setMembers(data.members);
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
      setGroupId(null);
      setName(null);
      setDescription(null);
      setInviteCode(null);
      setAdminId(null);
      setMembers(null);
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    loadGroup();
  }, [user, authLoading, loadGroup]);

  const contextValue = {
    groupId,
    name,
    description,
    inviteCode,
    adminId,
    members,
    isLoading,
    refreshGroup,
  };

  console.log("authLoading:", authLoading);
  console.log("user:", user?.uid);
  console.log("groupId:", groupId);
  console.log("groupLoading:", isLoading);

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
