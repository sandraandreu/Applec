import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
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
    firstName: data.firstName,
    lastName: data.lastName,
    relationship: data.relationship,
  });
  await updateDoc(doc(db, "users", ownerUid), {
    linkedMembers: arrayUnion({
      id: docRef.id,
      firstName: data.firstName,
      lastName: data.lastName,
      relationship: data.relationship,
    }),
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
    }));
  } catch {
    return null;
  }
};
