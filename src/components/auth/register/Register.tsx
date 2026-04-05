import "./Register.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
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
import Alert from "../../feedback/Alert";
import Loading from "../../feedback/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

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
  const history = useHistory();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [errorConnection, setErrorConnection] = useState<string>("");

  //Crear user en firebase

  const handleRegister = async (
    email: string,
    password: string,
    userName: string,
  ) => {
    try {
      setIsLoading(true);
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

      await signOut(auth);
      setRegisterState("success");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      console.error("Error completo:", firebaseError);
      console.error("Código:", firebaseError.code);
      console.error("Mensaje:", firebaseError.message);
      if (firebaseError.message === "username-already-exists") {
        setUsernameError(t("register.errors.usernameTaken"));
        return;
      }
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      setRegisterState("error");
      console.error("Email sign up error:", firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  //Reenviar email de verificación

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
      {isLoading && <Loading />}

      <h1>{t("register.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="register-username"
          label={t("register.username")}
          placeholder={t("register.usernamePlaceholder")}
          type="text"
          registration={register("username", { required: true })}
          error={
            errors.username?.type === "required"
              ? tc("errors.required")
              : usernameError
                ? usernameError
                : undefined
          }
        />

        <Input
          id="register-email"
          label={tc("fields.email")}
          placeholder={t("register.emailPlaceholder")}
          type="text"
          registration={register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          error={
            errors.email?.type === "required"
              ? tc("errors.required")
              : errors.email?.type === "pattern"
                ? tc("errors.emailInvalid")
                : undefined
          }
        />

        <Input
          id="register-password"
          label={tc("fields.password")}
          placeholder={t("register.passwordPlaceholder")}
          type="password"
          registration={register("password", {
            required: true,
            validate: (value) =>
              hasMinLength(value) &&
              hasUpperCase(value) &&
              hasLowerCase(value) &&
              hasNumber(value),
          })}
          error={
            errors.password?.type === "required"
              ? tc("errors.required")
              : undefined
          }
        />

        <div className="password-requirements">
          <div><input type="checkbox" readOnly checked={hasMinLength(password)} /><span>{t("register.passwordMinLength")}</span></div>
          <div><input type="checkbox" readOnly checked={hasUpperCase(password)} /><span>{t("register.passwordUppercase")}</span></div>
          <div><input type="checkbox" readOnly checked={hasLowerCase(password)} /><span>{t("register.passwordLowercase")}</span></div>
          <div><input type="checkbox" readOnly checked={hasNumber(password)} /><span>{t("register.passwordNumber")}</span></div>
        </div>

        <Input
          id="register-confirm-password"
          label={t("register.confirmPassword")}
          placeholder={t("register.confirmPasswordPlaceholder")}
          type="password"
          registration={register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          error={
            errors.confirmPassword?.type === "required"
              ? tc("errors.required")
              : errors.confirmPassword?.type === "validate"
                ? t("register.errors.passwordMismatch")
                : undefined
          }
        />

        <div className="terms-row">
          <input
            id="acceptsTerms"
            type="checkbox"
            {...register("acceptsTerms", { required: true })}
          />
          <label htmlFor="acceptsTerms">
            {t("register.termsStart")}
            <a href="/privacy">{t("register.termsPrivacy")}</a>
            {t("register.termsAnd")}
            <a href="/terms">{t("register.termsConditions")}</a>
          </label>
        </div>

        {errors.acceptsTerms?.type === "required" && (
          <span className="field__error">{t("register.errors.termsRequired")}</span>
        )}

        <Button
          text={t("register.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}

        <a href="/login">{t("register.loginLink")}</a>
      </form>

      <Alert
        isOpen={registerState === "error"}
        header={t("register.errors.emailTaken")}
        onDismiss={() => setRegisterState("form")}
        buttons={[
          {
            text: tc("buttons.close"),
            role: "cancel",
          },
          {
            text: t("register.errors.emailTakenButton"),
            handler: () => history.push("/login"),
          },
        ]}
      />

      <Alert
        isOpen={registerState === "success"}
        header={t("register.verifyTitle")}
        message={t("register.verifyMessage")}
        onDismiss={() => history.push("/login")}
        buttons={[
          {
            text: tc("buttons.resendEmail"),
            handler: () => handleResendEmail(),
          },
          {
            text: tc("buttons.close"),
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default Register;
