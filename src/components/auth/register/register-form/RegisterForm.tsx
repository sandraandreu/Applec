import "./RegisterForm.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  hasMinLength,
  hasUpperCase,
  hasLowerCase,
  hasNumber,
} from "../Register";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  acceptsTerms: boolean;
}

interface RegisterFormProps {
  handleRegister: (email: string, password: string, username: string) => void;
  usernameError: string;
  errorConnection: string;
}

const RegisterForm = ({
  handleRegister,
  usernameError,
  errorConnection,
}: RegisterFormProps) => {
  const { t } = useTranslation();

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
    </>
  );
};

export default RegisterForm;
