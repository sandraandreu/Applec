import "./Register.scss";
import { useTranslation } from "react-i18next";
import { useIonRouter } from "@ionic/react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "../../../plugins/firebase";
import { useState } from "react";
import RegisterForm from "./register-form/RegisterForm";
import RegisterSuccess from "./register-success/RegisterSuccess";
import RegisterError from "./register-error/RegisterError";

const auth = getAuth(app);
const db = getFirestore(app);

export const hasMinLength = (value: string) => value.length >= 6;
export const hasUpperCase = (value: string) => /[A-Z]/.test(value);
export const hasLowerCase = (value: string) => /[a-z]/.test(value);
export const hasNumber = (value: string) => /[0-9]/.test(value);

const Register = () => {
  const router = useIonRouter();
  const { t } = useTranslation();

  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");
  const [user, setUser] = useState<any>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [errorConnection, setErrorConnection] = useState<string>("");

  //Crear user en firebase

  const handleRegister = async (
    email: string,
    password: string,
    userName: string,
  ) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userName", "==", userName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("username-already-exists");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setUser(userCredential.user);

      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        userName: userName,
        email: userCredential.user.email,
        createdAt: new Date(),
        role: "member",
      });

      setRegisterState("success");
    } catch (error: any) {
      if (error.message === "username-already-exists") {
        setUsernameError(t("register_error_name_taken"));
        return;
      }
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(t("register_error_no_connection"));
        return
      }
      setRegisterState("error");
      console.error("Email sign up error:", error.message);
    }
  };

  //Reenviar email de merificación

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  return (
    <>
      {registerState === "success" ? (
        <RegisterSuccess
          isOpen={registerState === "success"}
          handleResendEmail={handleResendEmail}
          onClose={() => router.push("/login")}
        />
      ) : registerState === "error" ? (
        <RegisterError
          isOpen={registerState === "error"}
          onClose={() => setRegisterState("form")}
        />
      ) : (
        <RegisterForm
          handleRegister={handleRegister}
          usernameError={usernameError}
          errorConnection={errorConnection}
        />
      )}
    </>
  );
};

export default Register;
