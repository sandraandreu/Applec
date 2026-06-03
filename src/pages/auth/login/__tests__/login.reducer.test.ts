import { describe, it, expect } from "vitest";
import type { User } from "firebase/auth";
import { loginReducer, initialLoginState } from "../login.reducer";

describe("loginReducer", () => {
  it("LOGIN_START sets isLoading and clears both errors", () => {
    const state = {
      ...initialLoginState,
      errorCredentials: "wrong password",
      errorConnection: "no internet",
    };
    const result = loginReducer(state, { type: "LOGIN_START" });
    expect(result.isLoading).toBe(true);
    expect(result.errorCredentials).toBe("");
    expect(result.errorConnection).toBe("");
  });

  it("LOGIN_SUCCESS clears isLoading", () => {
    const state = { ...initialLoginState, isLoading: true };
    const result = loginReducer(state, { type: "LOGIN_SUCCESS" });
    expect(result.isLoading).toBe(false);
  });

  it("LOGIN_UNVERIFIED sets unverified state and stores user", () => {
    const state = { ...initialLoginState, isLoading: true };
    const fakeUser = { uid: "user-1" } as User;
    const result = loginReducer(state, { type: "LOGIN_UNVERIFIED", user: fakeUser });
    expect(result.isLoading).toBe(false);
    expect(result.loginState).toBe("unverified");
    expect(result.unverifiedUser).toBe(fakeUser);
  });

  it("ERROR_CREDENTIALS clears isLoading and sets error message", () => {
    const state = { ...initialLoginState, isLoading: true };
    const result = loginReducer(state, { type: "ERROR_CREDENTIALS", message: "Invalid credentials" });
    expect(result.isLoading).toBe(false);
    expect(result.errorCredentials).toBe("Invalid credentials");
  });

  it("ERROR_CONNECTION clears isLoading and sets connection error", () => {
    const state = { ...initialLoginState, isLoading: true };
    const result = loginReducer(state, { type: "ERROR_CONNECTION", message: "No internet" });
    expect(result.isLoading).toBe(false);
    expect(result.errorConnection).toBe("No internet");
  });

  it("TOGGLE_PASSWORD toggles showPassword", () => {
    const first = loginReducer(initialLoginState, { type: "TOGGLE_PASSWORD" });
    expect(first.showPassword).toBe(true);
    const second = loginReducer(first, { type: "TOGGLE_PASSWORD" });
    expect(second.showPassword).toBe(false);
  });

  it("DISMISS_UNVERIFIED resets loginState to form", () => {
    const fakeUser = { uid: "user-1" } as User;
    const state = loginReducer(initialLoginState, { type: "LOGIN_UNVERIFIED", user: fakeUser });
    const result = loginReducer(state, { type: "DISMISS_UNVERIFIED" });
    expect(result.loginState).toBe("form");
  });

  it("unknown action returns state unchanged", () => {
    const result = loginReducer(initialLoginState, { type: "UNKNOWN" } as never);
    expect(result).toBe(initialLoginState);
  });
});
