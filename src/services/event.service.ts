import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { FallesEvent, FallesEventCreate } from "../models/event.model";

const toDate = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : (value as Date);

export interface EventNotif {
  eventId: string;
  title: string;
  createdBy: string;
  createdAt: Date;
}

const toEvent = (id: string, data: DocumentData): FallesEvent => ({
  id,
  groupId: data.groupId,
  createdBy: data.createdBy,
  name: data.name,
  date: toDate(data.date),
  location: data.location,
  startTime: data.startTime,
  requiresConfirmation: data.requiresConfirmation,
  sendReminder: data.sendReminder,
  createdAt: toDate(data.createdAt),
  description: data.description,
  endTime: data.endTime,
  confirmationDeadline: data.confirmationDeadline
    ? toDate(data.confirmationDeadline)
    : undefined,
  isSpecial: data.isSpecial,
  allowExternalGuests: data.allowExternalGuests,
  maxExternalGuests: data.maxExternalGuests,
});

export const getEvents = async (groupId: string): Promise<FallesEvent[] | null> => {
  try {
    const q = query(
      collection(db, "groups", groupId, "events"),
      orderBy("date", "asc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toEvent(d.id, d.data()));
  } catch {
    return null;
  }
};

export const getEventById = async (
  groupId: string,
  eventId: string,
): Promise<FallesEvent | null> => {
  try {
    const snap = await getDoc(doc(db, "groups", groupId, "events", eventId));
    if (!snap.exists()) return null;
    return toEvent(snap.id, snap.data());
  } catch {
    return null;
  }
};

const writeEventNotification = async (groupId: string, eventId: string, title: string, createdBy: string): Promise<void> => {
  await setDoc(doc(db, "groups", groupId, "eventNotifications", eventId), {
    eventId,
    title,
    createdBy,
    createdAt: serverTimestamp(),
  });
};

export const createEvent = async (
  groupId: string,
  data: FallesEventCreate,
): Promise<string> => {
  const ref = await addDoc(collection(db, "groups", groupId, "events"), {
    ...data,
    createdAt: new Date(),
  });
  await writeEventNotification(groupId, ref.id, data.name, data.createdBy);
  return ref.id;
};

export const listenEventNotifications = (
  groupId: string,
  callback: (notifications: EventNotif[]) => void,
): (() => void) => {
  return onSnapshot(collection(db, "groups", groupId, "eventNotifications"), (snap) => {
    const notifications = snap.docs.map(d => ({
      eventId: d.data().eventId as string,
      title: d.data().title as string,
      createdBy: d.data().createdBy as string,
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    }));
    callback(notifications);
  });
};

export const updateEvent = async (
  groupId: string,
  eventId: string,
  data: Partial<FallesEventCreate>,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId, "events", eventId), data);
};

export const deleteEvent = async (
  groupId: string,
  eventId: string,
): Promise<void> => {
  await deleteDoc(doc(db, "groups", groupId, "events", eventId));
};
