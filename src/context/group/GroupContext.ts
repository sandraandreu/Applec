import { createContext, useContext } from "react";
import type { LinkedMemberData } from "../../services/linked-member.service";

export interface GroupData {
  groupId: string;
  name: string;
  imageUrl?: string;
  inviteCode: string;
  adminId: string;
  members: { uid: string; role: "admin" | "organizer" | "member"; firstName: string; lastName: string; photoUrl?: string }[];
  linkedMembers: LinkedMemberData[];
}

export interface GroupContextType {
  group: GroupData | null;
  isLoading: boolean;
  refreshGroup: () => Promise<void>;
}

export const GroupContext = createContext<GroupContextType | null>(null);

export const useGroupContext = () => {
  const value = useContext(GroupContext);
  if (value === null) {
    throw new Error(
      "El contexto no se puede usar fuera de un context provider",
    );
  }
  return value;
};
