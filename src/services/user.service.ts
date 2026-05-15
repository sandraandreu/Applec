import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
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

export const updateUserFields = async (
  uid: string,
  fields: Partial<UserProfile>,
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { ...fields });
};

