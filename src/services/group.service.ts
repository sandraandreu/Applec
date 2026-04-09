import {
  getFirestore,
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
import app from "../plugins/firebase";
import type { GroupData } from "../context/group/GroupContext";

const db = getFirestore(app);

export const getGroupById = async (
  groupId: string,
): Promise<GroupData | null> => {
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
};

interface CreateGroupData {
  name: string;
  description: string;
  adminUid: string;
}

export const createGroup = async ({
  name,
  description,
  adminUid,
}: CreateGroupData): Promise<string> => {
  const inviteCode = crypto.randomUUID();
  const ref = await addDoc(collection(db, "groups"), {
    name,
    description,
    inviteCode,
    adminId: adminUid,
    members: [{ uid: adminUid, role: "admin" }],
    createdAt: new Date(),
  });
  return ref.id;
};

export const findGroupByInviteCode = async (
  code: string,
): Promise<{ id: string; name: string; description: string } | null> => {
  const q = query(collection(db, "groups"), where("inviteCode", "==", code));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const groupDoc = snap.docs[0];
  return {
    id: groupDoc.id,
    name: groupDoc.data().name,
    description: groupDoc.data().description,
  };
};

export const addMemberToGroup = async (
  groupId: string,
  uid: string,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), {
    members: arrayUnion({ uid, role: "member" }),
  });
};
