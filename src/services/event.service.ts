import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { FallesEvent, FallesEventCreate } from "../models/event.model";

const toDate = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : (value as Date);

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
  cancelledAt: data.cancelledAt ? toDate(data.cancelledAt) : undefined,
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

export const createEvent = async (
  groupId: string,
  data: FallesEventCreate,
): Promise<string> => {
  const ref = await addDoc(collection(db, "groups", groupId, "events"), {
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
};

export const updateEvent = async (
  groupId: string,
  eventId: string,
  data: Partial<FallesEventCreate>,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId, "events", eventId), { ...data });
};

export const deleteEvent = async (
  groupId: string,
  eventId: string,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId, "events", eventId), {
    cancelledAt: new Date(),
  });
};
