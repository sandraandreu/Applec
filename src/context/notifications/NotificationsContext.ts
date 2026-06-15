import { createContext, useContext } from "react";

export interface NotificationsContextType {
  hasUnread: boolean;
  markAsRead: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotificationsContext = () => {
  const value = useContext(NotificationsContext);
  if (value === null) {
    throw new Error("El contexto no se puede usar fuera de un context provider");
  }
  return value;
};
