import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { EventAttendanceData } from "../models/attendance.model";

export const getEventAttendances = async (
  groupId: string,
  eventId: string,
): Promise<EventAttendanceData | null> => {
  try {
    const ref = collection(db, "groups", groupId, "events", eventId, "attendances");
    const snap = await getDocs(ref);
    const memberResponses: Record<string, "yes" | "no"> = {};
    const linkedResponses: Record<string, Record<string, "yes" | "no">> = {};
    snap.docs.forEach(d => {
      const data = d.data();
      if (data.response) {
        memberResponses[d.id] = data.response;
      }
      if (data.linkedResponses) {
        linkedResponses[d.id] = data.linkedResponses;
      }
    });
    return { memberResponses, linkedResponses };
  } catch {
    return null;
  }
};

export const getMyAttendances = async (
  groupId: string,
  userId: string,
  eventIds: string[],
): Promise<Record<string, "yes" | "no"> | null> => {
  try {
    const docs = await Promise.all(
      eventIds.map(eventId =>
        getDoc(doc(db, "groups", groupId, "events", eventId, "attendances", userId))
      )
    );
    const result: Record<string, "yes" | "no"> = {};
    docs.forEach((d, i) => {
      if (d.exists()) {
        const data = d.data();
        if (data.response) result[eventIds[i]] = data.response;
      }
    });
    return result;
  } catch {
    return null;
  }
};

export const saveAttendance = async (
  groupId: string,
  eventId: string,
  userId: string,
  data: { response?: "yes" | "no"; linkedResponses: Record<string, "yes" | "no"> },
): Promise<void> => {
  const payload: Record<string, unknown> = {
    userId,
    eventId,
    confirmedAt: new Date(),
    linkedResponses: data.linkedResponses,
  };
  if (data.response !== undefined) {
    payload.response = data.response;
  }
  await setDoc(
    doc(db, "groups", groupId, "events", eventId, "attendances", userId),
    payload,
    { merge: true },
  );
};
