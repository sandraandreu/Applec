import { collection, getDocs, doc, writeBatch, arrayUnion, runTransaction } from "firebase/firestore";
import { db } from "../plugins/firebase";
import type { LinkedMember, LinkedMemberType } from "../models/user.model";

export interface LinkedMemberData {
  id: string;
  ownerUid: string;
  firstName: string;
  lastName: string;
  relationship: string;
  type?: LinkedMemberType;
}

export const addLinkedMember = async (
  groupId: string,
  ownerUid: string,
  data: { firstName: string; lastName: string; relationship: string; type: LinkedMemberType },
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
  data: { firstName: string; lastName: string; relationship: string; type: LinkedMemberType },
): Promise<void> => {
  const linkedMemberRef = doc(db, "groups", groupId, "linkedMembers", linkedMemberId);
  const userRef = doc(db, "users", ownerUid);
  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const currentLinkedMembers = (userSnap.data()?.linkedMembers ?? []) as LinkedMember[];
    const updatedLinkedMembers = currentLinkedMembers.map((linkedMember) =>
      linkedMember.id === linkedMemberId ? { ...linkedMember, ...data } : linkedMember
    );
    transaction.update(linkedMemberRef, data);
    transaction.update(userRef, { linkedMembers: updatedLinkedMembers });
  });
};

export const deleteLinkedMember = async (
  groupId: string,
  linkedMemberId: string,
  ownerUid: string,
): Promise<void> => {
  const userRef = doc(db, "users", ownerUid);
  const linkedMemberRef = doc(db, "groups", groupId, "linkedMembers", linkedMemberId);
  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const currentLinkedMembers = (userSnap.data()?.linkedMembers ?? []) as LinkedMember[];
    const updatedLinkedMembers = currentLinkedMembers.filter((lm) => lm.id !== linkedMemberId);
    transaction.delete(linkedMemberRef);
    transaction.update(userRef, { linkedMembers: updatedLinkedMembers });
  });
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
      type: d.data().type,
    }));
  } catch {
    return null;
  }
};
