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
  adminUid: string;
  adminUsername: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

export const createGroup = async ({
  name,
  adminUid,
  adminUsername,
  adminFirstName,
  adminLastName,
  adminEmail,
}: CreateGroupData): Promise<string> => {
  try {
    const inviteCode = crypto.randomUUID();
    const ref = await addDoc(collection(db, "groups"), {
      name,
      inviteCode,
      adminId: adminUid,
      members: [{ uid: adminUid, role: "admin", username: adminUsername, firstName: adminFirstName, lastName: adminLastName, email: adminEmail }],
      createdAt: new Date(),
    });
    return ref.id;
  } catch (error) {
    console.error("createGroup error:", error);
    throw error;
  }
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
  } catch (error) {
    console.error("findGroupByInviteCode error:", error);
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
  try {
    await updateDoc(doc(db, "groups", groupId), {
      members: arrayUnion({ uid, role: "member", username, firstName, lastName, email }),
    });
  } catch (error) {
    console.error("addMemberToGroup error:", error);
    throw error;
  }
};
