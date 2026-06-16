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
  const profileRef = useRef(profile);
  useEffect(() => { profileRef.current = profile; });

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const userId = user?.uid ?? null;

  const loadGroup = useCallback(async (groupId: string) => {
    const currentProfile = profileRef.current;
    setIsLoading(true);

    const [groupData, linkedMembers] = await Promise.all([
      getGroupById(groupId),
      getGroupLinkedMembers(groupId),
    ]);
    if (!isMountedRef.current) return;
    if (groupData) {
      setGroup({ ...groupData, linkedMembers: linkedMembers ?? [] });
      const memberInGroup = groupData.members.find(member => member.uid === userId);
      if (userId && memberInGroup && memberInGroup.role !== currentProfile?.role) {
        await updateUserFields(userId, { role: memberInGroup.role }).catch(() => undefined);
      }
    }
    if (isMountedRef.current) setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    if (authLoading) return;

    if (!userId || !profile?.groupId) {
      setGroup(null);
      setIsLoading(false);
      return;
    }

    loadGroup(profile.groupId);
  }, [userId, authLoading, loadGroup, profile?.groupId]);

  const refreshGroup = useCallback(async () => {
    if (profile?.groupId) await loadGroup(profile.groupId);
  }, [loadGroup, profile?.groupId]);

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
