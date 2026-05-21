import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GroupContext } from "./GroupContext";
import type { GroupData } from "./GroupContext";
import { useAuthContext } from "../auth/AuthContext";
import { getGroupById } from "../../services/group.service";
import { getGroupLinkedMembers } from "../../services/linked-member.service";
import { updateUserFields } from "../../services/user.service";

export interface GroupContextProviderProps {
  children: ReactNode;
}

export const GroupContextProvider = ({
  children,
}: GroupContextProviderProps) => {
  const { user, profile, isLoading: authLoading } = useAuthContext();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const loadGroup = useCallback(async () => {
    setIsLoading(true);
    if (!user || !profile) {
      setIsLoading(false);
      return;
    }

    if (profile.groupId) {
      const [groupData, linkedMembers] = await Promise.all([
        getGroupById(profile.groupId),
        getGroupLinkedMembers(profile.groupId),
      ]);
      if (!isMountedRef.current) return;
      if (groupData) {
        setGroup({ ...groupData, linkedMembers: linkedMembers ?? [] });
        const memberInGroup = groupData.members.find(m => m.uid === user.uid);
        if (memberInGroup && memberInGroup.role !== profile.role) {
          await updateUserFields(user.uid, { role: memberInGroup.role }).catch(() => undefined);
        }
      }
    }
    if (isMountedRef.current) setIsLoading(false);
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
    () => ({ group, isLoading, refreshGroup: loadGroup }),
    [group, isLoading, loadGroup]
  );

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};
