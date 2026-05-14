import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { GroupContext } from "./GroupContext";
import type { GroupData } from "./GroupContext";
import { useAuthContext } from "../auth/AuthContext";
import { getGroupById } from "../../services/group.service";
import { getGroupLinkedMembers } from "../../services/linked-member.service";

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
    setIsLoading(true);
    if (!user || !profile) return;

    if (profile.groupId) {
      const [groupData, linkedMembers] = await Promise.all([
        getGroupById(profile.groupId),
        getGroupLinkedMembers(profile.groupId),
      ]);
      if (groupData) {
        setGroup({ ...groupData, linkedMembers: linkedMembers ?? [] });
      }
    }
    setIsLoading(false);
  }, [user, profile]);

  useEffect(() => {
    if (authLoading) return;

    if (user === null) {
      setGroup(null);
      setIsLoading(false);
      return;
    }

    loadGroup();
  }, [user, authLoading, loadGroup]);

  const contextValue = useMemo(
    () => ({ group, isLoading }),
    [group, isLoading]
  );

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
