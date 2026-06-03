import "./register.scss";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useReducer } from "react";
import { registerReducer, initialRegisterState } from "./register.reducer";
import Modal from "../../../components/modal/Modal";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import {
  registerUser,
  sendVerificationEmail,
} from "../../../services/auth.service";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import EyeToggleIcon from "../../../ui-kit/button/icon-buttons/eye-toggle/EyeToggleIcon";
import Icon from "../../../ui-kit/icons/icon/Icon";
import { createUserProfile } from "../../../services/user.service";
import { isFirebaseError } from "../../../utils/firebase-errors";

interface RegisterFormData {
  firstName: string;
  lastName: string;
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
  const { t: tCommon } = useTranslation("common");

  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const {
    isLoading,
    registerState,
    errorConnection,
    showPassword,
    showConfirmPassword,
  } = state;

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    dispatch({ type: "REGISTER_START" });

    let userCredential;
    try {
      userCredential = await registerUser(email, password);
    } catch (error: unknown) {
      if (
        isFirebaseError(error) &&
        error.code === "auth/email-already-in-use"
      ) {
        dispatch({ type: "ERROR_EMAIL_TAKEN" });
      } else if (
        isFirebaseError(error) &&
        error.code === "auth/network-request-failed"
      ) {
        dispatch({
          type: "ERROR_CONNECTION",
          message: tCommon("errors.noConnection"),
        });
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
        firstName,
        lastName,
        email: userCredential.user.email ?? "",
        createdAt: new Date(),
        role: "member",
      });
    } catch {
      try {
        await userCredential.user.delete();
      } catch {
        /* rollback best-effort */
      }
      dispatch({ type: "REGISTER_ERROR" });
      return;
    }

    navigate("/verify-email", { replace: true, state: { emailSent: verificationEmailSent } });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ mode: "onSubmit" });

  const password = watch("password", "");

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
    );
  };

  return (
    <div className="register-page">
      {isLoading && <Loading />}

      <BackButton />

      <h1 className="register-page__title">{t("register.title")}</h1>

      <form className="register-page__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="register-page__fields">
          <Input
            id="register-firstname"
            label={t("register.firstName")}
            placeholder={t("register.firstNamePlaceholder")}
            type="text"
            required
            maxLength={50}
            registration={register("firstName", {
              required: true,
              maxLength: 50,
              pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            })}
            error={
              errors.firstName?.type === "required"
                ? tCommon("errors.required")
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
            maxLength={50}
            registration={register("lastName", {
              required: true,
              maxLength: 50,
              pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            })}
            error={
              errors.lastName?.type === "required"
                ? tCommon("errors.required")
                : errors.lastName?.type === "pattern"
                  ? t("register.errors.nameInvalid")
                  : undefined
            }
          />

          <Input
            id="register-email"
            label={tCommon("fields.email")}
            placeholder={t("register.emailPlaceholder")}
            type="text"
            required
            maxLength={254}
            registration={register("email", {
              required: true,
              maxLength: 254,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            error={
              errors.email?.type === "required"
                ? tCommon("errors.required")
                : errors.email?.type === "pattern"
                  ? tCommon("errors.emailInvalid")
                  : undefined
            }
          />

          <Input
            id="register-password"
            label={tCommon("fields.password")}
            placeholder={t("register.passwordPlaceholder")}
            type={showPassword ? "text" : "password"}
            required
            maxLength={128}
            registration={register("password", {
              required: true,
              maxLength: 128,
              validate: (value) =>
                hasMinLength(value) &&
                hasUpperCase(value) &&
                hasLowerCase(value) &&
                hasNumber(value),
            })}
            error={
              errors.password?.type === "required"
                ? tCommon("errors.required")
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

          {password.length > 0 && (
            <ul className="register-page__password-requirements">
              {[
                { met: hasMinLength(password), label: t("register.passwordMinLength") },
                { met: hasUpperCase(password), label: t("register.passwordUppercase") },
                { met: hasLowerCase(password), label: t("register.passwordLowercase") },
                { met: hasNumber(password),    label: t("register.passwordNumber") },
              ].map(({ met, label }) => (
                <li
                  key={label}
                  className={`register-page__password-requirements-item${met ? " register-page__password-requirements-item--met" : ""}`}
                >
                  {met
                    ? <Icon name="check-bold" size={16} aria-hidden="true" />
                    : <span className="register-page__password-requirements-dot" aria-hidden="true" />
                  }
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}

          <Input
            id="register-confirm-password"
            label={t("register.confirmPassword")}
            placeholder={t("register.confirmPasswordPlaceholder")}
            type={showConfirmPassword ? "text" : "password"}
            required
            maxLength={128}
            registration={register("confirmPassword", {
              required: true,
              maxLength: 128,
              validate: (value) => value === password,
            })}
            error={
              errors.confirmPassword?.type === "required"
                ? tCommon("errors.required")
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

          <div className="register-page__terms-block">
            <div className="register-page__terms">
              <input
                id="acceptsTerms"
                type="checkbox"
                className="register-page__terms-checkbox"
                {...register("acceptsTerms", { required: true })}
              />
              <label htmlFor="acceptsTerms">
                {t("register.termsStart")}
                <a
                  className="register-page__terms-link"
                  href="https://applec.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("register.termsPrivacy")}
                </a>
                {t("register.termsAnd")}
                <a
                  className="register-page__terms-link"
                  href="https://applec.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("register.termsConditions")}
                </a>
              </label>
            </div>

            {errors.acceptsTerms?.type === "required" && (
              <span className="field__error">
                {t("register.errors.termsRequired")}
              </span>
            )}
          </div>

          {errorConnection && <span>{errorConnection}</span>}
        </div>

        <div className="register-page__actions">
          <Button
            text={t("register.button")}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
          />
          <Link className="register-page__login" to="/login">
            {t("register.loginLink")}
          </Link>
        </div>
      </form>

      <Modal
        isOpen={registerState === "error"}
        header={t("register.errors.emailTakenTitle")}
        message={t("register.errors.emailTakenMessage")}
        onDismiss={() => dispatch({ type: "DISMISS_ERROR" })}
        buttons={[
          {
            text: tCommon("buttons.close"),
            role: "cancel",
          },
          {
            text: t("register.errors.emailTakenButton"),
            handler: () => navigate("/login"),
          },
        ]}
      />
    </div>
  );
};

export default RegisterPage;
