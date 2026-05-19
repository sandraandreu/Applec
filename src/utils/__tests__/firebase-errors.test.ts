import { describe, it, expect } from "vitest";
import { FirebaseError } from "firebase/app";
import { getErrorKey } from "../firebase-errors";

describe("getErrorKey", () => {
  it("mapea auth/invalid-credential a credenciales inválidas", () => {
    expect(getErrorKey(new FirebaseError("auth/invalid-credential", ""))).toBe(
      "auth:login.errors.invalidCredentials"
    );
  });

  it("mapea auth/email-already-in-use a email en uso", () => {
    expect(getErrorKey(new FirebaseError("auth/email-already-in-use", ""))).toBe(
      "auth:register.errors.emailTakenMessage"
    );
  });

  it("mapea auth/network-request-failed a sin conexión", () => {
    expect(getErrorKey(new FirebaseError("auth/network-request-failed", ""))).toBe(
      "common:errors.noConnection"
    );
  });

  it("devuelve error genérico para un código de Firebase desconocido", () => {
    expect(getErrorKey(new FirebaseError("auth/unknown-code", ""))).toBe(
      "common:errors.unknown"
    );
  });

  it("devuelve error genérico si el error no es de Firebase", () => {
    expect(getErrorKey(new Error("algo falló"))).toBe("common:errors.unknown");
    expect(getErrorKey("string error")).toBe("common:errors.unknown");
    expect(getErrorKey(null)).toBe("common:errors.unknown");
  });
});
