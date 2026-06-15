import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../plugins/firebase";
import { useAuthContext } from "../auth/AuthContext";
import { NotificationsContext } from "./NotificationsContext";

export const NotificationsContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuthContext();

  const lastSeenRef = useRef(Number(localStorage.getItem("notificationsLastSeen") ?? 0));
  const latestEventTsRef = useRef(0);
  const latestRequestTsRef = useRef(0);
  const [hasJoinRequests, setHasJoinRequests] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);

  useEffect(() => {
    if (!user?.permissions.canManageMembers || !profile?.groupId) return;
    const unsubscribe = onSnapshot(
      collection(db, "groups", profile.groupId, "joinRequests"),
      (snap) => {
        let maxTs = 0;
        const hasNew = snap.docs.some((d) => {
          const ts = d.data().requestedAt?.toMillis?.() ?? 0;
          if (ts > maxTs) maxTs = ts;
          return ts > lastSeenRef.current;
        });
        latestRequestTsRef.current = maxTs;
        setHasJoinRequests(hasNew);
      },
    );
    return () => unsubscribe();
  }, [user?.permissions.canManageMembers, profile?.groupId]);

  useEffect(() => {
    if (!profile?.groupId || !user?.uid) return;
    const uid = user.uid;
    const unsubscribe = onSnapshot(
      collection(db, "groups", profile.groupId, "eventNotifications"),
      (snap) => {
        let maxTs = 0;
        const hasNew = snap.docs.some((d) => {
          const createdAt = d.data().createdAt?.toMillis?.() ?? 0;
          const createdBy = d.data().createdBy as string;
          if (createdAt > maxTs) maxTs = createdAt;
          return createdAt > lastSeenRef.current && createdBy !== uid;
        });
        latestEventTsRef.current = maxTs;
        setHasNewEvents(hasNew);
      },
    );
    return () => unsubscribe();
  }, [profile?.groupId, user?.uid]);

  const markAsRead = useCallback(() => {
    const lastSeen = Math.max(Date.now(), latestEventTsRef.current, latestRequestTsRef.current);
    lastSeenRef.current = lastSeen;
    localStorage.setItem("notificationsLastSeen", String(lastSeen));
    setHasJoinRequests(false);
    setHasNewEvents(false);
  }, []);

  const contextValue = useMemo(
    () => ({ hasUnread: hasJoinRequests || hasNewEvents, markAsRead }),
    [hasJoinRequests, hasNewEvents, markAsRead],
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
