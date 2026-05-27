import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../plugins/firebase";
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

export const uploadProfilePhoto = async (
  uid: string,
  file: File,
): Promise<string> => {
  const storageRef = ref(storage, `users/${uid}/avatar`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const updateUserFields = async (
  uid: string,
  fields: Partial<UserProfile>,
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), fields);
};

export const clearGroupDeletedFlag = async (uid: string): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { groupDeleted: deleteField() });
};

