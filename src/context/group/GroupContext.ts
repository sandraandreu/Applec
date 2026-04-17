import { createContext, useContext } from "react";

export interface GroupData {
  groupId: string;
  name: string;
  description: string;
  inviteCode: string;
  adminId: string;
  members: { uid: string; role: string; username: string; fullName: string; email: string }[];
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
