import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../plugins/firebase";

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
  const docRef = await addDoc(collection(db, "groups", groupId, "linkedMembers"), {
    ownerUid,
    ...data,
  });
  await updateDoc(doc(db, "users", ownerUid), {
    linkedMembers: arrayUnion({ id: docRef.id, ...data }),
  });
};

export const editLinkedMember = async (
  groupId: string,
  linkedMemberId: string,
  ownerUid: string,
  data: { firstName: string; lastName: string; relationship: string },
): Promise<void> => {
  await updateDoc(doc(db, "groups", groupId, "linkedMembers", linkedMemberId), data);
  const userSnap = await getDoc(doc(db, "users", ownerUid));
  const currentLinkedMembers = (userSnap.data()?.linkedMembers ?? []) as { id: string; firstName: string; lastName: string; relationship: string }[];
  const updatedLinkedMembers = currentLinkedMembers.map((lm) =>
    lm.id === linkedMemberId ? { ...lm, ...data } : lm
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
