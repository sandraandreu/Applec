import "./ForgotPassword.scss";
import { useTranslation } from "react-i18next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import app from "../../../plugins/firebase";
import Alert from "../../feedback/alerts/Alert";
import { useIonRouter } from "@ionic/react";
import Loading from "../../feedback/loading/Loading";

const auth = getAuth(app);

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

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
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordState("success");
    } catch (error: any) {
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(t("forgot_password_error_no_connection"));
        return;
      }
      console.error("Forgot password error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("forgot_password_title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="forgot_password-email">
          {t("forgot_password_email")}
        </label>
        <input
          id="forgot_password-email"
          type="text"
          placeholder={t("forgot_password_email_placeholder")}
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
        />

        {errors.email?.type === "required" && (
          <span>{t("forgot_password_error_required")}</span>
        )}
        {errors.email?.type === "pattern" && (
          <span>{t("forgot_password_error_email_invalid")}</span>
        )}

        <button type="submit" disabled={Object.keys(errors).length > 0 || isLoading}>
          {t("forgot_password_button")}
        </button>

        <a href="/login">{t("forgot_password_back")}</a>

        {errorConnection && <span>{errorConnection}</span>}
      </form>

      <Alert
        isOpen={forgotPasswordState === "success"}
        header={t("forgot_password_success_title")}
        message={t("forgot_password_success_message")}
        onDismiss={() => setForgotPasswordState("form")}
        buttons={[
          {
            text: t("forgot_password_back"),
            handler: () => router.push("/login"),
          },
        ]}
      />
    </>
  );
};

export default ForgotPassword;
