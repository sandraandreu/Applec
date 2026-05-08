import type { User } from "firebase/auth";

export interface LoginState {
  isLoading: boolean;
  loginState: "form" | "unverified";
  unverifiedUser: User | null;
  errorConnection: string;
  errorCredentials: string;
  showPassword: boolean;
}

export type LoginAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_UNVERIFIED"; user: User }
  | { type: "ERROR_CREDENTIALS"; message: string }
  | { type: "ERROR_CONNECTION"; message: string }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "DISMISS_UNVERIFIED" };

export const initialLoginState: LoginState = {
  isLoading: false,
  loginState: "form",
  unverifiedUser: null,
  errorConnection: "",
  errorCredentials: "",
  showPassword: false,
};

export const loginReducer = (
  state: LoginState,
  action: LoginAction,
): LoginState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        errorConnection: "",
        errorCredentials: "",
      };
    case "LOGIN_SUCCESS":
      return { ...state, isLoading: false };
    case "LOGIN_UNVERIFIED":
      return {
        ...state,
        isLoading: false,
        loginState: "unverified",
        unverifiedUser: action.user,
      };
    case "ERROR_CREDENTIALS":
      return { ...state, isLoading: false, errorCredentials: action.message };
    case "ERROR_CONNECTION":
      return { ...state, isLoading: false, errorConnection: action.message };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "DISMISS_UNVERIFIED":
      return { ...state, loginState: "form" };
    default:
      return state;
  }
};
