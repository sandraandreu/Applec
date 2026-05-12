import { createContext, useContext } from 'react';
import type { UserProfile, User } from '../../models/user.model';

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('El contexto no se puede usar fuera de un context provider');
  }
  return value;
};