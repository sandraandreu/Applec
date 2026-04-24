export interface FallesEvent {
  id: string;
  groupId: string;
  createdBy: string;
  name: string;
  date: Date;
  location: string;
  startTime: string;
  requiresConfirmation: boolean;
  sendReminder: boolean;
  createdAt: Date;

  description?: string;
  endTime?: string;
  confirmationDeadline?: Date;
  cancelledAt?: Date;
}

export type FallesEventCreate = Omit<FallesEvent, "id" | "createdAt">;

export type EventStatus = "activo" | "plazo-cerrado" | "finalizado" | "cancelado";

export const getEventStatus = (event: FallesEvent): EventStatus => {
  if (event.cancelledAt) return "cancelado";
  const now = new Date();
  if (now > event.date) return "finalizado";
  if (event.requiresConfirmation && event.confirmationDeadline && now > event.confirmationDeadline) return "plazo-cerrado";
  return "activo";
};
