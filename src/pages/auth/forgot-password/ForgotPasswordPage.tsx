import "./forgot-password.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "../../../components/alert/Alert";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import { sendPasswordReset } from "../../../services/auth.service";
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
      const firebaseError = error as { code?: string; message?: string };
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

      <a className="forgot-password-page__login" href="/login">
        {t("forgotPassword.back")}
      </a>

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
