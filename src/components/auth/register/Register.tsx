import "./Register.scss";
import { useTranslation } from "react-i18next";
import { useIonRouter } from "@ionic/react";
import { useForm } from "react-hook-form";
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
import Alert from "../../feedback/alerts/Alert";

const auth = getAuth(app);
const db = getFirestore(app);

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptsTerms: boolean;
  }

const hasMinLength = (value: string) => value.length >= 6;
const hasUpperCase = (value: string) => /[A-Z]/.test(value);
const hasLowerCase = (value: string) => /[a-z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);

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
        return;
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

  //Formulario

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password", "");

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(data.email, data.password, data.username);
  };

  return (
    <>
      <h1>{t("register_title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="register-userusername">{t("register_username")}</label>
        <input
          id="register-username"
          type="text"
          placeholder={t("register_username_placeholder")}
          {...register("username", { required: true })}
        />

        {errors.username?.type === "required" && (
          <span>{t("register_error_required")}</span>
        )}
        {usernameError && <span>{usernameError}</span>}

        <label htmlFor="register-email">{t("register_email")}</label>
        <input
          id="register-email"
          type="text"
          placeholder={t("register_email_placeholder")}
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
        />

        {errors.email?.type === "required" && (
          <span>{t("register_error_required")}</span>
        )}
        {errors.email?.type === "pattern" && (
          <span>{t("register_error_email_invalid")}</span>
        )}

        <label htmlFor="register-password">{t("register_password")}</label>
        <input
          id="register-password"
          type="password"
          placeholder={t("register_password_placeholder")}
          {...register("password", {
            required: true,
            validate: (value) =>
              hasMinLength(value) &&
              hasUpperCase(value) &&
              hasLowerCase(value) &&
              hasNumber(value),
          })}
        />

        {errors.password?.type === "required" && (
          <span>{t("register_error_required")}</span>
        )}

        <div>
          <input type="checkbox" readOnly checked={hasMinLength(password)} />
          <span>{t("register_password_min_length")}</span>
          <input type="checkbox" readOnly checked={hasUpperCase(password)} />
          <span>{t("register_password_uppercase")}</span>
          <input type="checkbox" readOnly checked={hasLowerCase(password)} />
          <span>{t("register_password_lowercase")}</span>
          <input type="checkbox" readOnly checked={hasNumber(password)} />
          <span>{t("register_password_number")}</span>
        </div>

        <label htmlFor="register-confirm-password">
          {t("register_confirm_password")}
        </label>
        <input
          id="register-confirm-password"
          type="password"
          placeholder={t("register_confirm_password_placeholder")}
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
        />

        {errors.confirmPassword?.type === "required" && (
          <span>{t("register_error_required")}</span>
        )}
        {errors.confirmPassword?.type === "validate" && (
          <span>{t("register_error_password_mismatch")}</span>
        )}

        <input
          id="acceptsTerms"
          type="checkbox"
          {...register("acceptsTerms", { required: true })}
        />
        <label htmlFor="acceptsTerms">
          {t("register_terms_start")}
          <a href="/privacy">{t("register_terms_privacy")}</a>
          {t("register_terms_and")}
          <a href="/terms">{t("register_terms_conditions")}</a>
        </label>

        {errors.acceptsTerms?.type === "required" && (
          <span>{t("register_error_terms_required")}</span>
        )}

        <button type="submit" disabled={Object.keys(errors).length > 0}>
          {t("register_button")}
        </button>

        {errorConnection && <span>{errorConnection}</span>}

        <a href="/login">{t("register_login_link")}</a>
      </form>

      <Alert
        isOpen={registerState === "error"}
        header={t("register_error_email_taken")}
        onDismiss={() => setRegisterState("form")}
        buttons={[
          {
            text: t("register_close"),
            role: "cancel",
          },
          {
            text: t("register_error_email_taken_button"),
            handler: () => router.push("/login"),
          },
        ]}
      />

      <Alert
        isOpen={registerState === "success"}
        header={t("register_verify_title")}
        message={t("register_verify_message")}
        onDismiss={() => router.push("/login")}
        buttons={[
          {
            text: t("register_verify_resend"),
            handler: () => handleResendEmail(),
          },
          {
            text: t("register_close"),
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default Register;
