import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { UserProfile, UserProfileCreate } from "../models/user.model";

export type { UserProfile };

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch {
    return null;
  }
};

export const createUserProfile = async (
  uid: string,
  data: UserProfileCreate,
): Promise<void> => {
  await setDoc(doc(db, "users", uid), data);
};

export const updateUserGroup = async (
  uid: string,
  groupId: string,
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { groupId });
};

export const updateUserRole = async (
  uid: string,
  role: "admin" | "organizer" | "member",
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { role });
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  return !snap.empty;
};
