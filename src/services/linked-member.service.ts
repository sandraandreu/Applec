import { collection, getDocs } from "firebase/firestore";
import { db } from "../plugins/firebase";

export interface LinkedMemberData {
  id: string;
  ownerUid: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

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
