import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  userName: string | null;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('El contexto no se puede usar fuera de un context provider');
  }
  return value;
};