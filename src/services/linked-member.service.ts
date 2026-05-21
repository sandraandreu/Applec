import { collection, getDocs, getDoc, doc, updateDoc, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { LinkedMember } from "../models/user.model";

export interface LinkedMemberData {
  id: string;
  ownerUid: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

export const addLinkedMember = async (
  groupId: string,
  ownerUid: string,
  data: { firstName: string; lastName: string; relationship: string },
): Promise<void> => {
  const batch = writeBatch(db);
  const newDocRef = doc(collection(db, "groups", groupId, "linkedMembers"));
  batch.set(newDocRef, { ownerUid, ...data });
  batch.update(doc(db, "users", ownerUid), {
    linkedMembers: arrayUnion({ id: newDocRef.id, ...data }),
  });
  await batch.commit();
};

export const editLinkedMember = async (
  groupId: string,
  linkedMemberId: string,
  ownerUid: string,
  data: { firstName: string; lastName: string; relationship: string },
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId, "linkedMembers", linkedMemberId), data);
  const userSnap = await getDoc(doc(db, "users", ownerUid));
  const currentLinkedMembers = (userSnap.data()?.linkedMembers ?? []) as LinkedMember[];
  const updatedLinkedMembers = currentLinkedMembers.map((linkedMember) =>
    linkedMember.id === linkedMemberId ? { ...linkedMember, ...data } : linkedMember
  );
  await updateDoc(doc(db, "users", ownerUid), { linkedMembers: updatedLinkedMembers });
};

export const getGroupLinkedMembers = async (groupId: string): Promise<LinkedMemberData[] | null> => {
  try {
    const snap = await getDocs(collection(db, "groups", groupId, "linkedMembers"));
    return snap.docs.map(d => ({
      id: d.id,
      ownerUid: d.data().ownerUid,
      firstName: d.data().firstName,
      lastName: d.data().lastName,
      relationship: d.data().relationship ?? "",
    }));
  } catch {
    return null;
  }
};
