import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  UserCredential,
  User,
} from "firebase/auth";
import { auth } from "../plugins/firebase";

export const loginUser = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

export const sendVerificationEmail = async (user?: User): Promise<void> => {
  const target = user ?? auth.currentUser;
  if (!target) throw new Error("No authenticated user");
  await sendEmailVerification(target);
};
