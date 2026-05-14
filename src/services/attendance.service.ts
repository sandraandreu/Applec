import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { AttendanceResponse } from "../models/attendance.model";

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
