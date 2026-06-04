export interface RegisterState {
  isLoading: boolean;
  registerState: "form" | "error";
  errorConnection: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "ERROR_CONNECTION"; message: string }
  | { type: "ERROR_EMAIL_TAKEN" }
  | { type: "DISMISS_ERROR" }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "TOGGLE_CONFIRM_PASSWORD" };

export const initialRegisterState: RegisterState = {
  isLoading: false,
  registerState: "form",
  errorConnection: "",
  showPassword: false,
  showConfirmPassword: false,
};

export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, isLoading: true, errorConnection: "" };
    case "ERROR_CONNECTION":
      return { ...state, isLoading: false, errorConnection: action.message };
    case "ERROR_EMAIL_TAKEN":
      return { ...state, isLoading: false, registerState: "error" };
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
