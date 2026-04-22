import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../plugins/firebase";
import type { GroupData } from "../context/group/GroupContext";

export const getGroupById = async (
  groupId: string,
): Promise<GroupData | null> => {
  try {
    const snap = await getDoc(doc(db, "groups", groupId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      groupId,
      name: data.name,
      imageUrl: data.imageUrl,
      inviteCode: data.inviteCode,
      adminId: data.adminId,
      members: data.members,
    };
  } catch {
    return null;
  }
};

interface CreateGroupData {
  name: string;
  imageUrl?: string;
  adminUid: string;
  adminUsername: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

export const uploadGroupImage = async (file: File, groupId: string): Promise<string> => {
  const storageRef = ref(storage, `groups/${groupId}/image`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const updateGroupImage = async (groupId: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), { imageUrl });
};

export const createGroup = async ({
  name,
  imageUrl,
  adminUid,
  adminUsername,
  adminFirstName,
  adminLastName,
  adminEmail,
}: CreateGroupData): Promise<string> => {
  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  let inviteCode = generateCode();
  let codeExists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", inviteCode)))).empty;
  while (codeExists) {
    inviteCode = generateCode();
    codeExists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", inviteCode)))).empty;
  }
  const ref = await addDoc(collection(db, "groups"), {
    name,
    ...(imageUrl && { imageUrl }),
    inviteCode,
    adminId: adminUid,
    members: [{ uid: adminUid, role: "admin", username: adminUsername, firstName: adminFirstName, lastName: adminLastName, email: adminEmail }],
    createdAt: new Date(),
  });
  return ref.id;
};

export const findGroupByInviteCode = async (
  code: string,
): Promise<{ id: string; name: string } | null> => {
  try {
    const q = query(collection(db, "groups"), where("inviteCode", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const groupDoc = snap.docs[0];
    return {
      id: groupDoc.id,
      name: groupDoc.data().name,
    };
  } catch {
    return null;
  }
};

export const addMemberToGroup = async (
  groupId: string,
  uid: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), {
    members: arrayUnion({ uid, role: "member", username, firstName, lastName, email }),
  });
};
