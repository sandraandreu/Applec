import "./ForgotPassword.scss";
import { useTranslation } from "react-i18next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import app from "../../../plugins/firebase";
import Alert from "../../feedback/alerts/Alert";
import { useHistory } from "react-router-dom";
import Loading from "../../feedback/loading/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

const auth = getAuth(app);

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

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
        setErrorConnection(tc("errors.noConnection"));
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
            handler: () => history.push("/login"),
          },
        ]}
      />
    </>
  );
};

export default ForgotPassword;
