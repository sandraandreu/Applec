import "./forgot-password.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "../../../components/alert/Alert";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import { sendPasswordReset } from "../../../services/auth.service";
import type { FirebaseError } from "../../../models/error.model";
import BackButton from "../../../ui-kit/icons/BackButton";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgotPasswordState, setForgotPasswordState] = useState<
    "form" | "success"
  >("form");
  const [errorConnection, setErrorConnection] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = (data: ForgotPasswordFormData) => {
    handleForgotPassword(data.email);
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordReset(email);
      setForgotPasswordState("success");
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      console.error("Forgot password error:", firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="forgot-password-page__content">
        <div className="forgot-password-page__header">
          <h1 className="forgot-password-page__title">
            {t("forgotPassword.title")}
          </h1>
          <p className="forgot-password-page__description margin-bottom-48px">
            {t("forgotPassword.description")}
          </p>
        </div>

        <form
          className="forgot-password-page__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="margin-bottom-48px">
            <Input
              id="forgot_password-email"
              label={tc("fields.email")}
              placeholder={t("forgotPassword.emailPlaceholder")}
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

            {errorConnection && (
              <span className="forgot-password-page__error">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/></svg>
                {errorConnection}
              </span>
            )}
          </div>

          <Button
            text={t("forgotPassword.button")}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
          />
        </form>
      </div>

      <Link className="forgot-password-page__login" to="/login">
        {t("forgotPassword.back")}
      </Link>

      <Alert
        isOpen={forgotPasswordState === "success"}
        header={t("forgotPassword.successTitle")}
        message={t("forgotPassword.successMessage")}
        onDismiss={() => setForgotPasswordState("form")}
        buttons={[
          {
            text: t("forgotPassword.back"),
            handler: () => navigate("/login"),
          },
        ]}
      />
    </div>
  );
};

export default ForgotPasswordPage;
