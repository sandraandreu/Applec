import { describe, it, expect } from "vitest";
import { registerReducer, initialRegisterState } from "../register.reducer";

describe("registerReducer", () => {
  it("REGISTER_START sets isLoading and clears errorConnection", () => {
    const state = { ...initialRegisterState, errorConnection: "no internet" };
    const result = registerReducer(state, { type: "REGISTER_START" });
    expect(result.isLoading).toBe(true);
    expect(result.errorConnection).toBe("");
  });

  it("ERROR_CONNECTION clears isLoading and sets error message", () => {
    const state = { ...initialRegisterState, isLoading: true };
    const result = registerReducer(state, { type: "ERROR_CONNECTION", message: "No internet" });
    expect(result.isLoading).toBe(false);
    expect(result.errorConnection).toBe("No internet");
  });

  it("ERROR_EMAIL_TAKEN clears isLoading and sets error state", () => {
    const state = { ...initialRegisterState, isLoading: true };
    const result = registerReducer(state, { type: "ERROR_EMAIL_TAKEN" });
    expect(result.isLoading).toBe(false);
    expect(result.registerState).toBe("error");
  });

  it("REGISTER_ERROR clears isLoading without changing registerState", () => {
    const state = { ...initialRegisterState, isLoading: true };
    const result = registerReducer(state, { type: "REGISTER_ERROR" });
    expect(result.isLoading).toBe(false);
    expect(result.registerState).toBe("form");
  });

  it("DISMISS_ERROR resets registerState to form", () => {
    const state = registerReducer(initialRegisterState, { type: "ERROR_EMAIL_TAKEN" });
    expect(state.registerState).toBe("error");
    const result = registerReducer(state, { type: "DISMISS_ERROR" });
    expect(result.registerState).toBe("form");
  });

  it("TOGGLE_PASSWORD toggles showPassword", () => {
    const first = registerReducer(initialRegisterState, { type: "TOGGLE_PASSWORD" });
    expect(first.showPassword).toBe(true);
    const second = registerReducer(first, { type: "TOGGLE_PASSWORD" });
    expect(second.showPassword).toBe(false);
  });

  it("TOGGLE_CONFIRM_PASSWORD toggles showConfirmPassword independently", () => {
    const result = registerReducer(initialRegisterState, { type: "TOGGLE_CONFIRM_PASSWORD" });
    expect(result.showConfirmPassword).toBe(true);
    expect(result.showPassword).toBe(false);
  });

  it("unknown action returns state unchanged", () => {
    const result = registerReducer(initialRegisterState, { type: "UNKNOWN" } as never);
    expect(result).toBe(initialRegisterState);
  });
});
