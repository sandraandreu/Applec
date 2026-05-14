import { collection, collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { AttendanceResponse, EventAttendanceData } from "../models/attendance.model";

export const getEventAttendances = async (
  groupId: string,
  eventId: string,
): Promise<EventAttendanceData | null> => {
  try {
    const ref = collection(db, "groups", groupId, "events", eventId, "attendances");
    const snap = await getDocs(ref);
    const memberResponses: Record<string, AttendanceResponse> = {};
    const linkedResponses: Record<string, Record<string, AttendanceResponse>> = {};
    snap.docs.forEach(d => {
      const data = d.data();
      memberResponses[d.id] = data.response;
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
  userId: string,
): Promise<Record<string, AttendanceResponse> | null> => {
  try {
    const q = query(collectionGroup(db, "attendances"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const result: Record<string, AttendanceResponse> = {};
    snap.docs.forEach(d => {
      const data = d.data();
      result[data.eventId] = data.response;
    });
    return result;
  } catch {
    return null;
  }
};
