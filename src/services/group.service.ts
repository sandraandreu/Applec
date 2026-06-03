import {
  doc,
  getDoc,
  setDoc,
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
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../plugins/firebase";
import type { GroupData } from "../context/group/GroupContext";
import type { JoinRequest, AcceptedRequest } from "../models/user.model";

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
    const normalized = code.trim().toUpperCase();
    const q = query(collection(db, "groups"), where("inviteCode", "==", normalized));
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

export const updateMemberFields = async (
  groupId: string,
  uid: string,
  fields: Partial<{ firstName: string; lastName: string; photoUrl: string }>,
): Promise<void> => {
  const groupRef = doc(db, "groups", groupId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(groupRef);
    const members = (snap.data()?.members ?? []) as GroupData["members"];
    const updated = members.map(member => member.uid === uid ? { ...member, ...fields } : member);
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
  nonAdminUids: string[],
): Promise<void> => {
  const notifiedSet = new Set(nonAdminUids);
  const batch = writeBatch(db);
  batch.delete(doc(db, "groups", groupId));
  for (const uid of memberUids) {
    const fields = notifiedSet.has(uid)
      ? { groupId: deleteField(), groupDeleted: true }
      : { groupId: deleteField() };
    batch.update(doc(db, "users", uid), fields);
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

export const sendJoinRequest = async (
  groupId: string,
  uid: string,
  { firstName, lastName, email }: { firstName: string; lastName: string; email: string },
): Promise<void> => {
  await setDoc(doc(db, "groups", groupId, "joinRequests", uid), {
    uid,
    firstName,
    lastName,
    email,
    requestedAt: serverTimestamp(),
  });
};

export const getJoinRequests = async (groupId: string): Promise<JoinRequest[]> => {
  try {
    const snap = await getDocs(collection(db, "groups", groupId, "joinRequests"));
    return snap.docs.map(d => ({
      uid: d.id,
      firstName: d.data().firstName as string,
      lastName: d.data().lastName as string,
      email: d.data().email as string,
      requestedAt: d.data().requestedAt?.toDate() ?? new Date(),
    }));
  } catch {
    return [];
  }
};

export const approveJoinRequest = async (
  groupId: string,
  uid: string,
  memberData: { firstName: string; lastName: string },
): Promise<void> => {
  const batch = writeBatch(db);
  batch.update(doc(db, "groups", groupId), {
    members: arrayUnion({ uid, role: "member", firstName: memberData.firstName, lastName: memberData.lastName }),
  });
  batch.update(doc(db, "users", uid), {
    groupId,
    role: "member",
    joinAccepted: true,
    pendingJoinGroupId: deleteField(),
  });
  batch.delete(doc(db, "groups", groupId, "joinRequests", uid));
  batch.set(doc(db, "groups", groupId, "acceptedRequests", uid), {
    firstName: memberData.firstName,
    lastName: memberData.lastName,
    acceptedAt: serverTimestamp(),
  });
  await batch.commit();
};

export const getAcceptedRequests = async (groupId: string): Promise<AcceptedRequest[]> => {
  try {
    const snap = await getDocs(collection(db, "groups", groupId, "acceptedRequests"));
    return snap.docs.map(d => ({
      uid: d.id,
      firstName: d.data().firstName as string,
      lastName: d.data().lastName as string,
      acceptedAt: d.data().acceptedAt?.toDate() ?? new Date(),
    }));
  } catch {
    return [];
  }
};

export const rejectJoinRequest = async (
  groupId: string,
  uid: string,
): Promise<void> => {
  const batch = writeBatch(db);
  batch.update(doc(db, "users", uid), {
    joinRejected: true,
    pendingJoinGroupId: deleteField(),
  });
  batch.delete(doc(db, "groups", groupId, "joinRequests", uid));
  await batch.commit();
};
