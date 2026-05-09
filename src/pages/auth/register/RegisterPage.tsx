import "./register.scss";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useReducer } from "react";
import { registerReducer, initialRegisterState } from "./register.reducer";
import Alert from "../../../components/alert/Alert";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import {
  registerUser,
  logoutUser,
  sendVerificationEmail,
} from "../../../services/auth.service";
import BackButton from "../../../ui-kit/buttons/icon-buttons/back-button/BackButton";
import EyeToggleIcon from "../../../ui-kit/buttons/icon-buttons/eye-toggle/EyeToggleIcon";
import {
  createUserProfile,
  isUsernameTaken,
} from "../../../services/user.service";
import { isFirebaseError } from "../../../utils/firebase-errors";

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

  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const { isLoading, registerState, registeredUser, errorConnection, showPassword, showConfirmPassword } = state;

  const handleRegister = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
  ) => {
    dispatch({ type: "REGISTER_START" });

    let userCredential;
    try {
      userCredential = await registerUser(email, password);
    } catch (error: unknown) {
      if (isFirebaseError(error) && error.code === "auth/email-already-in-use") {
        dispatch({ type: "ERROR_EMAIL_TAKEN" });
      } else if (isFirebaseError(error) && error.code === "auth/network-request-failed") {
        dispatch({ type: "ERROR_CONNECTION", message: tc("errors.noConnection") });
      } else {
        dispatch({ type: "REGISTER_ERROR" });
      }
      return;
    }

    let verificationEmailSent = true;
    try {
      await sendVerificationEmail(userCredential.user);
    } catch {
      verificationEmailSent = false;
    }

    try {
      await createUserProfile(userCredential.user.uid, {
        username,
        firstName,
        lastName,
        email: userCredential.user.email ?? "",
        createdAt: new Date(),
        role: "member",
      });
    } catch {
      try { await userCredential.user.delete(); } catch { /* rollback best-effort */ }
      dispatch({ type: "REGISTER_ERROR" });
      return;
    }

    let logoutSuccess = false;
    for (let attempt = 0; attempt < 3 && !logoutSuccess; attempt++) {
      try {
        await logoutUser();
        logoutSuccess = true;
      } catch { /* retry */ }
    }

    if (verificationEmailSent) {
      dispatch({ type: "REGISTER_SUCCESS", user: userCredential.user });
    } else {
      dispatch({ type: "REGISTER_EMAIL_VERIFICATION_FAILED", user: userCredential.user });
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
  } = useForm<RegisterFormData>({ mode: "onBlur" });

  const password = watch("password", "");

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(data.email, data.password, data.username, data.firstName, data.lastName);
  };

  return (
    <div className="register-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="register-page__content">
        <h1 className="register-page__title margin-bottom-48px">{t("register.title")}</h1>
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
            registration={register("username", {
              required: true,
              validate: async (value) => {
                const taken = await isUsernameTaken(value);
                if (taken) return t("register.errors.usernameTaken");
                return true;
              },
            })}
            error={
              errors.username?.type === "required"
                ? tc("errors.required")
                : errors.username?.message
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
            type={showPassword ? "text" : "password"}
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
            endIcon={
              <EyeToggleIcon
                showPassword={showPassword}
                onToggle={() => dispatch({ type: "TOGGLE_PASSWORD" })}
              />
            }
          />

          <Input
            id="register-confirm-password"
            label={t("register.confirmPassword")}
            placeholder={t("register.confirmPasswordPlaceholder")}
            type={showConfirmPassword ? "text" : "password"}
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
            endIcon={
              <EyeToggleIcon
                showPassword={showConfirmPassword}
                onToggle={() => dispatch({ type: "TOGGLE_CONFIRM_PASSWORD" })}
              />
            }
          />

          <div className="register-page__terms margin-bottom-48px">
            <input
              id="acceptsTerms"
              type="checkbox"
              className="register-page__terms-checkbox"
              {...register("acceptsTerms", { required: true })}
            />
            <label htmlFor="acceptsTerms">
              {t("register.termsStart")}
              <a className="register-page__terms-link" href="https://applec.com/privacy" target="_blank" rel="noopener noreferrer">{t("register.termsPrivacy")}</a>
              {t("register.termsAnd")}
              <a className="register-page__terms-link" href="https://applec.com/terms" target="_blank" rel="noopener noreferrer">{t("register.termsConditions")}</a>
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

      <Link className="register-page__login" to="/login">
        {t("register.loginLink")}
      </Link>

      <Alert
        isOpen={registerState === "error"}
        header={t("register.errors.emailTakenTitle")}
        message={t("register.errors.emailTakenMessage")}
        onDismiss={() => dispatch({ type: "DISMISS_ERROR" })}
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

      <Alert
        isOpen={registerState === "email-verification-failed"}
        header={t("register.emailVerificationFailedTitle")}
        message={t("register.emailVerificationFailedMessage")}
        onDismiss={() => navigate("/login")}
        buttons={[
          {
            text: tc("buttons.resendEmail"),
            handler: () => handleResendEmail(),
          },
        ]}
      />
    </div>
  );
};

export default RegisterPage;
