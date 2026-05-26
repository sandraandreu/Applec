import { collection, getDocs, setDoc, doc, getDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { EventAttendanceData } from "../models/attendance.model";

const normalizeResponse = (r: string): "going" | "not-going" | undefined => {
  if (r === "yes" || r === "going") return "going";
  if (r === "no" || r === "not-going") return "not-going";
  return undefined;
};

export const getEventAttendances = async (
  groupId: string,
  eventId: string,
): Promise<EventAttendanceData | null> => {
  try {
    const ref = collection(db, "groups", groupId, "events", eventId, "attendances");
    const snap = await getDocs(ref);
    const memberResponses: Record<string, "going" | "not-going"> = {};
    const linkedResponses: Record<string, Record<string, "going" | "not-going">> = {};
    snap.docs.forEach(d => {
      const data = d.data();
      const response = normalizeResponse(data.response);
      if (response) memberResponses[d.id] = response;
      if (data.linkedResponses) {
        linkedResponses[d.id] = Object.fromEntries(
          Object.entries(data.linkedResponses as Record<string, string>)
            .flatMap(([id, r]) => {
              const normalized = normalizeResponse(r);
              return normalized ? [[id, normalized]] : [];
            })
        );
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
): Promise<Record<string, "going" | "not-going"> | null> => {
  try {
    const docs = await Promise.all(
      eventIds.map(eventId =>
        getDoc(doc(db, "groups", groupId, "events", eventId, "attendances", userId))
      )
    );
    const result: Record<string, "going" | "not-going"> = {};
    docs.forEach((d, i) => {
      if (d.exists()) {
        const data = d.data();
        const response = normalizeResponse(data.response);
        if (response) result[eventIds[i]] = response;
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
  data: { response?: "going" | "not-going"; linkedResponses: Record<string, "going" | "not-going"> },
): Promise<void> => {
  const payload: Record<string, unknown> = {
    userId,
    eventId,
    confirmedAt: serverTimestamp(),
    linkedResponses: data.linkedResponses,
    response: data.response !== undefined ? data.response : deleteField(),
  };
  await setDoc(
    doc(db, "groups", groupId, "events", eventId, "attendances", userId),
    payload,
    { merge: true },
  );
};
