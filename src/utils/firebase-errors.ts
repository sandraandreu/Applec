import { FirebaseError } from "firebase/app";

export const isFirebaseError = (error: unknown): error is FirebaseError =>
  error instanceof FirebaseError;

const errorMapping: Record<string, string> = {
  "auth/invalid-credential": "auth:login.errors.invalidCredentials",
  "auth/email-already-in-use": "auth:register.errors.emailTakenMessage",
  "auth/network-request-failed": "common:errors.noConnection",
};

export const getErrorKey = (error: unknown): string => {
  if (isFirebaseError(error) && error.code) {
    return errorMapping[error.code] ?? "common:errors.unknown";
  }
  return "common:errors.unknown";
};
