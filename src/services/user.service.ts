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
  try {
    await setDoc(doc(db, "users", uid), data);
  } catch (error) {
    throw error;
  }
};

export const updateUserGroup = async (
  uid: string,
  groupId: string,
): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", uid), { groupId });
  } catch (error) {
    throw error;
  }
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    throw error;
  }
};
