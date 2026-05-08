import type { User } from "firebase/auth";

export interface RegisterState {
  isLoading: boolean;
  registerState: "form" | "success" | "error";
  registeredUser: User | null;
  usernameError: string;
  errorConnection: string;
}

export type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "USERNAME_TAKEN"; message: string }
  | { type: "REGISTER_SUCCESS"; user: User }
  | { type: "ERROR_CONNECTION"; message: string }
  | { type: "ERROR_EMAIL_TAKEN" }
  | { type: "REGISTER_ERROR" }
  | { type: "DISMISS_ERROR" };

export const initialRegisterState: RegisterState = {
  isLoading: false,
  registerState: "form",
  registeredUser: null,
  usernameError: "",
  errorConnection: "",
};

export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, isLoading: true, usernameError: "", errorConnection: "" };
    case "USERNAME_TAKEN":
      return { ...state, isLoading: false, usernameError: action.message };
    case "REGISTER_SUCCESS":
      return { ...state, isLoading: false, registerState: "success", registeredUser: action.user };
    case "ERROR_CONNECTION":
      return { ...state, isLoading: false, errorConnection: action.message };
    case "ERROR_EMAIL_TAKEN":
      return { ...state, isLoading: false, registerState: "error" };
    case "REGISTER_ERROR":
      return { ...state, isLoading: false };
    case "DISMISS_ERROR":
      return { ...state, registerState: "form" };
    default:
      return state;
  }
};
