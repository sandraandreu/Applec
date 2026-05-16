import type { CreateEventStep1Data } from "./CreateEventStep1Page";
import type { CreateEventStep2Data, CreateEventStep2Draft } from "./CreateEventStep2Page";
import type { CreateEventStep3Draft } from "./CreateEventStep3Page";

export type CreateEventState = {
  step: 1 | 2 | 3;
  direction: "forward" | "backward";
  step1Data: CreateEventStep1Data | undefined;
  step2Data: CreateEventStep2Data | undefined;
  step2Draft: CreateEventStep2Draft | undefined;
  step3Draft: CreateEventStep3Draft | undefined;
  isLoading: boolean;
  errorKey: string | undefined;
};

export type CreateEventAction =
  | { type: "COMPLETE_STEP1"; payload: CreateEventStep1Data }
  | { type: "COMPLETE_STEP2"; payload: CreateEventStep2Data }
  | { type: "BACK_TO_STEP1"; payload: CreateEventStep2Draft }
  | { type: "BACK_TO_STEP2"; payload: CreateEventStep3Draft }
  | { type: "SET_SUBMITTING" }
  | { type: "SET_ERROR"; payload: string | undefined };

export const initialState: CreateEventState = {
  step: 1,
  direction: "forward",
  step1Data: undefined,
  step2Data: undefined,
  step2Draft: undefined,
  step3Draft: undefined,
  isLoading: false,
  errorKey: undefined,
};

export const createEventReducer = (
  state: CreateEventState,
  action: CreateEventAction
): CreateEventState => {
  switch (action.type) {
    case "COMPLETE_STEP1":
      return { ...state, step: 2, direction: "forward", step1Data: action.payload };
    case "COMPLETE_STEP2":
      return {
        ...state,
        step: 3,
        direction: "forward",
        step2Data: action.payload,
        step2Draft: { ...action.payload, endTime: action.payload.endTime ?? "" },
      };
    case "BACK_TO_STEP1":
      return { ...state, step: 1, direction: "backward", step2Draft: action.payload };
    case "BACK_TO_STEP2":
      return { ...state, step: 2, direction: "backward", step3Draft: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isLoading: true, errorKey: undefined };
    case "SET_ERROR":
      return { ...state, isLoading: false, errorKey: action.payload };
    default:
      return state;
  }
};
