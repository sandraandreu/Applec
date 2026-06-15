import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../plugins/firebase";
import { useAuthContext } from "../auth/AuthContext";
import { NotificationsContext } from "./NotificationsContext";

export const NotificationsContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuthContext();

  const lastSeenRef = useRef(Number(localStorage.getItem("notificationsLastSeen") ?? 0));
  const [hasJoinRequests, setHasJoinRequests] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);

  useEffect(() => {
    if (!user?.permissions.canManageMembers || !profile?.groupId) return;
    const unsubscribe = onSnapshot(
      collection(db, "groups", profile.groupId, "joinRequests"),
      (snap) => {
        const hasNew = snap.docs.some(
          (d) => (d.data().requestedAt?.toMillis?.() ?? Infinity) > lastSeenRef.current,
        );
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
        const hasNew = snap.docs.some((d) => {
          const createdAt = d.data().createdAt?.toMillis?.() ?? 0;
          const createdBy = d.data().createdBy as string;
          return createdAt > lastSeenRef.current && createdBy !== uid;
        });
        setHasNewEvents(hasNew);
      },
    );
    return () => unsubscribe();
  }, [profile?.groupId, user?.uid]);

  const markAsRead = useCallback(() => {
    lastSeenRef.current = Date.now();
    localStorage.setItem("notificationsLastSeen", String(lastSeenRef.current));
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
