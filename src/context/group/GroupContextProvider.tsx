import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { GroupContext } from "./GroupContext";
import type { GroupData } from "./GroupContext";
import { useAuthContext } from "../auth/AuthContext";
import { getGroupById } from "../../services/group.service";

export interface GroupContextProviderProps {
  children: ReactNode;
}

export const GroupContextProvider = ({
  children,
}: GroupContextProviderProps) => {
  const { user, profile, isLoading: authLoading } = useAuthContext();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadGroup = useCallback(async () => {
    if (!user || !profile) return;

    if (profile.groupId) {
      const groupData = await getGroupById(profile.groupId);
      setGroup(groupData);
    }
    setIsLoading(false);
  }, [user, profile]);

  const refreshGroup = useCallback(async () => {
    setIsLoading(true);
    await loadGroup();
  }, [loadGroup]);

  useEffect(() => {
    if (authLoading) return;

    if (user === null) {
      setGroup(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadGroup();
  }, [user, authLoading, loadGroup]);

  const contextValue = useMemo(
    () => ({ group, isLoading, refreshGroup }),
    [group, isLoading, refreshGroup]
  );

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
