import "./register.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "../../../components/alert/Alert";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import {
  registerUser,
  logoutUser,
  sendVerificationEmail,
} from "../../../services/auth.service";
import BackButton from "../../../ui-kit/icons/BackButton";
import {
  createUserProfile,
  isUsernameTaken,
} from "../../../services/user.service";

interface RegisterFormData {
  firstName: string;
  lastName: string;
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");
  const [registeredUser, setRegisteredUser] = useState<
    import("firebase/auth").User | null
  >(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [errorConnection, setErrorConnection] = useState<string>("");

  const handleRegister = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      setIsLoading(true);

      const userCredential = await registerUser(email, password);

      try {
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
          firstName,
          lastName,
          email: userCredential.user.email,
          createdAt: new Date(),
          role: "member",
        });

        await logoutUser();
        setRegisterState("success");
      } catch (innerError: unknown) {
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
      console.error(
        "Register error:",
        firebaseError.code,
        firebaseError.message,
      );
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
    handleRegister(data.email, data.password, data.username, data.firstName, data.lastName);
  };

  return (
    <div className="register-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="register-page__content">
        <h1 className="register-page__title margin-buttom48px">{t("register.title")}</h1>
        <form className="register-page__form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="register-firstname"
            label={t("register.firstName")}
            placeholder={t("register.firstNamePlaceholder")}
            type="text"
            required
            registration={register("firstName", {
              required: true,
              pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            })}
            error={
              errors.firstName?.type === "required"
                ? tc("errors.required")
                : errors.firstName?.type === "pattern"
                  ? t("register.errors.nameInvalid")
                  : undefined
            }
          />

          <Input
            id="register-lastname"
            label={t("register.lastName")}
            placeholder={t("register.lastNamePlaceholder")}
            type="text"
            required
            registration={register("lastName", {
              required: true,
              pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            })}
            error={
              errors.lastName?.type === "required"
                ? tc("errors.required")
                : errors.lastName?.type === "pattern"
                  ? t("register.errors.nameInvalid")
                  : undefined
            }
          />

          <Input
            id="register-username"
            label={t("register.username")}
            placeholder={t("register.usernamePlaceholder")}
            type="text"
            required
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
            required
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
            required
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
                : errors.password
                  ? t("register.errors.passwordInvalid")
                  : undefined
            }
          />

          <div className="register-page__password-requirements">
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
            required
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

          <div className="register-page__terms margin-buttom48px">
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
            <span className="field__error">
              {t("register.errors.termsRequired")}
            </span>
          )}

          {errorConnection && <span>{errorConnection}</span>}

          <Button
            text={t("register.button")}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
          />
        </form>

      </div>

      <a className="register-page__login" href="/login">
        {t("register.loginLink")}
      </a>

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
    </div>
  );
};

export default RegisterPage;
