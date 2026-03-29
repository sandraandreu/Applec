import { createContext, useContext } from 'react';

export interface GroupContextType {
  groupId: string | null;
  name: string | null;
  description: string | null;
  inviteCode: string | null;
  adminId: string | null;
  members: { uid: string; role: string }[] | null;
  isLoading: boolean;
  refreshGroup: () => Promise<void>;
}

export const GroupContext = createContext<GroupContextType | null>(null);

export const useGroupContext = () => {
  const value = useContext(GroupContext);
  if (value === null) {
    throw new Error('El contexto no se puede usar fuera de un context provider');
  }
  return value;
};