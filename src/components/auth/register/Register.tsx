import "./Register.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "../../feedback/Alert";
import Loading from "../../feedback/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";
import { registerUser, logoutUser, sendVerificationEmail } from "../../../services/auth.service";
import { createUserProfile, isUsernameTaken } from "../../../services/user.service";

interface RegisterFormData {
  fullName: string;
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
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");
  const [registeredUser, setRegisteredUser] = useState<import("firebase/auth").User | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [errorConnection, setErrorConnection] = useState<string>("");

  const handleRegister = async (
    email: string,
    password: string,
    username: string,
    fullName: string,
  ) => {
    try {
      setIsLoading(true);

      // 1. Crear el usuario en Auth primero (queda autenticado para poder consultar Firestore)
      const userCredential = await registerUser(email, password);

      try {
        // 2. Comprobar username ya autenticados
        const taken = await isUsernameTaken(username);
        if (taken) {
          await userCredential.user.delete();
          setUsernameError(t("register.errors.usernameTaken"));
          return;
        }

        await sendVerificationEmail(userCredential.user);
        setRegisteredUser(userCredential.user);

        await createUserProfile(userCredential.user.uid, {
          username,
          fullName,
          email: userCredential.user.email,
          createdAt: new Date(),
          role: "member",
        });

        await logoutUser();
        setRegisterState("success");
      } catch (innerError: unknown) {
        // Si algo falla después de crear el usuario en Auth, lo eliminamos para no dejar basura
        await userCredential.user.delete().catch((_) => _);
        throw innerError;
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      if (firebaseError.code === "auth/email-already-in-use") {
        setRegisterState("error");
        return;
      }
      console.error("Register error:", firebaseError.code, firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (registeredUser) {
      await sendVerificationEmail(registeredUser);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password", "");

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(data.email, data.password, data.username, data.fullName);
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("register.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="register-fullname"
          label={t("register.fullName")}
          placeholder={t("register.fullNamePlaceholder")}
          type="text"
          registration={register("fullName", {
            required: true,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
          })}
          error={
            errors.fullName?.type === "required"
              ? tc("errors.required")
              : errors.fullName?.type === "pattern"
                ? t("register.errors.fullNameInvalid")
                : undefined
          }
        />

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
            handler: () => navigate("/login"),
          },
        ]}
      />

      <Alert
        isOpen={registerState === "success"}
        header={t("register.verifyTitle")}
        message={t("register.verifyMessage")}
        onDismiss={() => navigate("/login")}
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
