import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "../plugins/firebase";

interface UserProfile {
  userName: string;
  fullName: string;
  email: string | null;
  createdAt: Date;
  role: string;
}

const db = getFirestore(app);

export const getUserProfile = async (
  uid: string,
): Promise<(UserProfile & { groupId?: string }) | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile & { groupId?: string };
};

export const createUserProfile = async (
  uid: string,
  data: UserProfile,
): Promise<void> => {
  await setDoc(doc(db, "users", uid), data);
};

export const updateUserGroup = async (
  uid: string,
  groupId: string,
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { groupId });
};

export const isUsernameTaken = async (userName: string): Promise<boolean> => {
  const q = query(collection(db, "users"), where("userName", "==", userName));
  const snap = await getDocs(q);
  return !snap.empty;
};
