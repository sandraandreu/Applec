import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteField,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  runTransaction,
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
      linkedMembers: [],
    };
  } catch {
    return null;
  }
};

interface CreateGroupData {
  name: string;
  imageUrl?: string;
  adminUid: string;
  adminFirstName: string;
  adminLastName: string;
}

export const uploadGroupImage = async (file: File, groupId: string): Promise<string> => {
  const storageRef = ref(storage, `groups/${groupId}/image`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const updateGroupImage = async (groupId: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), { imageUrl });
};

const generateInviteCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export const regenerateInviteCode = async (groupId: string): Promise<void> => {
  let code = generateInviteCode();
  let exists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", code)))).empty;
  while (exists) {
    code = generateInviteCode();
    exists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", code)))).empty;
  }
  await updateDoc(doc(db, "groups", groupId), { inviteCode: code });
};

export const createGroup = async ({
  name,
  imageUrl,
  adminUid,
  adminFirstName,
  adminLastName,
}: CreateGroupData): Promise<string> => {
  let inviteCode = generateInviteCode();
  let codeExists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", inviteCode)))).empty;
  while (codeExists) {
    inviteCode = generateInviteCode();
    codeExists = !(await getDocs(query(collection(db, "groups"), where("inviteCode", "==", inviteCode)))).empty;
  }
  const ref = await addDoc(collection(db, "groups"), {
    name,
    ...(imageUrl && { imageUrl }),
    inviteCode,
    adminId: adminUid,
    members: [{ uid: adminUid, role: "admin", firstName: adminFirstName, lastName: adminLastName }],
    createdAt: new Date(),
  });
  return ref.id;
};

export const findGroupByInviteCode = async (
  code: string,
): Promise<{ id: string; name: string; imageUrl?: string } | null> => {
  try {
    const q = query(collection(db, "groups"), where("inviteCode", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const groupDoc = snap.docs[0];
    return {
      id: groupDoc.id,
      name: groupDoc.data().name,
      imageUrl: groupDoc.data().imageUrl,
    };
  } catch {
    return null;
  }
};

export const updateMemberRole = async (
  groupId: string,
  uid: string,
  newRole: "admin" | "organizer" | "member",
): Promise<void> => {
  const groupRef = doc(db, "groups", groupId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(groupRef);
    const members = (snap.data()?.members ?? []) as GroupData["members"];
    const updated = members.map(member => member.uid === uid ? { ...member, role: newRole } : member);
    transaction.update(groupRef, { members: updated });
  });
};

export const updateMemberPhotoUrl = async (
  groupId: string,
  uid: string,
  photoUrl: string,
): Promise<void> => {
  const groupRef = doc(db, "groups", groupId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(groupRef);
    const members = (snap.data()?.members ?? []) as GroupData["members"];
    const updated = members.map(member => member.uid === uid ? { ...member, photoUrl } : member);
    transaction.update(groupRef, { members: updated });
  });
};

export const removeMemberFromGroup = async (
  groupId: string,
  uid: string,
): Promise<void> => {
  const groupRef = doc(db, "groups", groupId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(groupRef);
    const members = (snap.data()?.members ?? []) as GroupData["members"];
    const updated = members.filter(member => member.uid !== uid);
    transaction.update(groupRef, { members: updated });
  });
};

export const deleteGroup = async (
  groupId: string,
  memberUids: string[],
): Promise<void> => {
  const batch = writeBatch(db);
  batch.delete(doc(db, "groups", groupId));
  for (const uid of memberUids) {
    batch.update(doc(db, "users", uid), { groupId: deleteField() });
  }
  await batch.commit();
};

export const updateGroupSettings = async (
  groupId: string,
  data: Partial<Pick<GroupData, "name" | "imageUrl">>,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), data);
};

export const addMemberToGroup = async (
  groupId: string,
  uid: string,
  firstName: string,
  lastName: string,
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId), {
    members: arrayUnion({ uid, role: "member", firstName, lastName }),
  });
};
