import { format } from "date-fns";
import type { FallesEvent } from "../../../models/event.model";

export type EditEventState = {
  event: FallesEvent | null;
  isLoading: boolean;
  isSubmitting: boolean;
  errorKey: string | undefined;
  eventType: "normal" | "special";
  selectedDate: Date | undefined;
  currentMonth: Date;
  dateError: boolean;
  requiresConfirmation: boolean;
  sendReminder: boolean;
  deadlineOpen: boolean;
  deadlineDate: Date | undefined;
  deadlineTime: string;
  deadlineMonth: Date;
};

export type EditEventAction =
  | { type: "SET_EVENT_DATA"; payload: FallesEvent }
  | { type: "SET_DATE"; payload: Date | undefined }
  | { type: "SET_CURRENT_MONTH"; payload: Date }
  | { type: "SET_EVENT_TYPE"; payload: "normal" | "special" }
  | { type: "SET_CONFIRMATION"; payload: boolean }
  | { type: "SET_REMINDER"; payload: boolean }
  | { type: "TOGGLE_DEADLINE" }
  | { type: "SET_DEADLINE_DATE"; payload: Date | undefined }
  | { type: "SET_DEADLINE_MONTH"; payload: Date }
  | { type: "SET_DEADLINE_TIME"; payload: string }
  | { type: "SET_DATE_ERROR" }
  | { type: "SET_SUBMITTING" }
  | { type: "SET_ERROR"; payload: string | undefined };

export const initialState: EditEventState = {
  event: null,
  isLoading: true,
  isSubmitting: false,
  errorKey: undefined,
  eventType: "normal",
  selectedDate: undefined,
  currentMonth: new Date(),
  dateError: false,
  requiresConfirmation: false,
  sendReminder: false,
  deadlineOpen: false,
  deadlineDate: undefined,
  deadlineTime: "23:59",
  deadlineMonth: new Date(),
};

export const editEventReducer = (
  state: EditEventState,
  action: EditEventAction
): EditEventState => {
  switch (action.type) {
    case "SET_EVENT_DATA": {
      const data = action.payload;
      return {
        ...state,
        event: data,
        isLoading: false,
        eventType: data.isSpecial ? "special" : "normal",
        selectedDate: data.date,
        currentMonth: data.date,
        requiresConfirmation: data.requiresConfirmation,
        sendReminder: data.sendReminder,
        deadlineOpen: !!data.confirmationDeadline,
        deadlineDate: data.confirmationDeadline,
        deadlineMonth: data.confirmationDeadline ?? state.deadlineMonth,
        deadlineTime: data.confirmationDeadline
          ? format(data.confirmationDeadline, "HH:mm")
          : state.deadlineTime,
      };
    }
    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
        ...(action.payload && { dateError: false, currentMonth: action.payload }),
      };
    case "SET_CURRENT_MONTH":
      return { ...state, currentMonth: action.payload };
    case "SET_EVENT_TYPE":
      return { ...state, eventType: action.payload };
    case "SET_CONFIRMATION":
      return { ...state, requiresConfirmation: action.payload };
    case "SET_REMINDER":
      return { ...state, sendReminder: action.payload };
    case "TOGGLE_DEADLINE":
      return { ...state, deadlineOpen: !state.deadlineOpen };
    case "SET_DEADLINE_DATE":
      return {
        ...state,
        deadlineDate: action.payload,
        ...(action.payload && { deadlineMonth: action.payload }),
      };
    case "SET_DEADLINE_MONTH":
      return { ...state, deadlineMonth: action.payload };
    case "SET_DEADLINE_TIME":
      return { ...state, deadlineTime: action.payload };
    case "SET_DATE_ERROR":
      return { ...state, dateError: true };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: true, errorKey: undefined };
    case "SET_ERROR":
      return { ...state, errorKey: action.payload, isSubmitting: false };
    default:
      return state;
  }
};
