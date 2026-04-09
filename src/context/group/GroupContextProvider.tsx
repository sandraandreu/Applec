import { type ReactNode, useCallback, useEffect, useState } from "react";
import { GroupContext } from "./GroupContext";
import type { GroupData } from "./GroupContext";
import { useAuthContext } from "../auth/AuthContext";
import { getUserProfile } from "../../services/user.service";
import { getGroupById } from "../../services/group.service";

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

    const profile = await getUserProfile(user.uid);

    if (profile?.groupId) {
      const groupData = await getGroupById(profile.groupId);
      setGroup(groupData);
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

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
