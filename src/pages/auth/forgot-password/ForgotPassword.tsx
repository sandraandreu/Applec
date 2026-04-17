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

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
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
    <>
      {isLoading && <Loading />}

      <h1>{t("forgotPassword.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="forgot_password-email"
          label={tc("fields.email")}
          placeholder={t("forgotPassword.emailPlaceholder")}
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

        <Button
          text={t("forgotPassword.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        <a href="/login">{t("forgotPassword.back")}</a>

        {errorConnection && <span>{errorConnection}</span>}
      </form>

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
    </>
  );
};

export default ForgotPassword;
