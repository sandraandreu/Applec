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
import { db } from "../plugins/firebase";
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
      description: data.description,
      inviteCode: data.inviteCode,
      adminId: data.adminId,
      members: data.members,
    };
  } catch (error) {
    console.error("getGroupById error:", error);
    return null;
  }
};

interface CreateGroupData {
  name: string;
  description: string;
  adminUid: string;
  adminUsername: string;
  adminFullName: string;
  adminEmail: string;
}

export const createGroup = async ({
  name,
  description,
  adminUid,
  adminUsername,
  adminFullName,
  adminEmail,
}: CreateGroupData): Promise<string> => {
  const inviteCode = crypto.randomUUID();
  const ref = await addDoc(collection(db, "groups"), {
    name,
    description,
    inviteCode,
    adminId: adminUid,
    members: [{ uid: adminUid, role: "admin", username: adminUsername, fullName: adminFullName, email: adminEmail }],
    createdAt: new Date(),
  });
  return ref.id;
};

export const findGroupByInviteCode = async (
  code: string,
): Promise<{ id: string; name: string; description: string } | null> => {
  try {
    const q = query(collection(db, "groups"), where("inviteCode", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const groupDoc = snap.docs[0];
    return {
      id: groupDoc.id,
      name: groupDoc.data().name,
      description: groupDoc.data().description,
    };
  } catch (error) {
    console.error("findGroupByInviteCode error:", error);
    return null;
  }
};

export const addMemberToGroup = async (
  groupId: string,
  uid: string,
  username: string,
  fullName: string,
  email: string,
): Promise<void> => {
  try {
    await updateDoc(doc(db, "groups", groupId), {
      members: arrayUnion({ uid, role: "member", username, fullName, email }),
    });
  } catch (error) {
    console.error("addMemberToGroup error:", error);
    throw error;
  }
};
