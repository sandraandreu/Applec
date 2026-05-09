import type { User } from "firebase/auth";

export interface RegisterState {
  isLoading: boolean;
  registerState: "form" | "success" | "email-verification-failed" | "error";
  registeredUser: User | null;
  errorConnection: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; user: User }
  | { type: "REGISTER_EMAIL_VERIFICATION_FAILED"; user: User }
  | { type: "ERROR_CONNECTION"; message: string }
  | { type: "ERROR_EMAIL_TAKEN" }
  | { type: "REGISTER_ERROR" }
  | { type: "DISMISS_ERROR" }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "TOGGLE_CONFIRM_PASSWORD" };

export const initialRegisterState: RegisterState = {
  isLoading: false,
  registerState: "form",
  registeredUser: null,
  errorConnection: "",
  showPassword: false,
  showConfirmPassword: false,
};

export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, isLoading: true, errorConnection: "" };
    case "REGISTER_SUCCESS":
      return { ...state, isLoading: false, registerState: "success", registeredUser: action.user };
    case "REGISTER_EMAIL_VERIFICATION_FAILED":
      return { ...state, isLoading: false, registerState: "email-verification-failed", registeredUser: action.user };
    case "ERROR_CONNECTION":
      return { ...state, isLoading: false, errorConnection: action.message };
    case "ERROR_EMAIL_TAKEN":
      return { ...state, isLoading: false, registerState: "error" };
    case "REGISTER_ERROR":
      return { ...state, isLoading: false };
    case "DISMISS_ERROR":
      return { ...state, registerState: "form" };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "TOGGLE_CONFIRM_PASSWORD":
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    default:
      return state;
  }
};
