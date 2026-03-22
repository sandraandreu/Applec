import "./Login.scss";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import app from "../../../plugins/firebase";
import Alert from "../../feedback/alerts/Alert";
import Loading from "../../feedback/loading/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

const auth = getAuth(app);

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<"form" | "unverified">("form");
  const [user, setUser] = useState<any>(null);
  const [errorConnection, setErrorConnection] = useState<string>("");
  const [errorCredentials, setErrorCredentials] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.email, data.password);
  };

  //Iniciar sesión

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setUser(userCredential.user);

      if (!userCredential.user.emailVerified) {
        setLoginState("unverified");
        return;
      }
      setIsLoading(false);
      router.push("/welcome");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setErrorCredentials(t("login_error_invalid_credentials"));
        setIsLoading(false);
        return;
      }
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(t("register_error_no_connection"));
        setIsLoading(false);
        return;
      }
      console.error("Email sign up error:", error.message);
    } 
  };

  //Reenviar email de merificación

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("login_title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="login-email"
          label={t("login_email")}
          placeholder={t("login_email_placeholder")}
          type="text"
          registration={register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          error={
            errors.email?.type === "required"
              ? t("login_error_required")
              : errors.email?.type === "pattern"
                ? t("login_error_email_invalid")
                : undefined
          }
        />

        <Input
          id="login-password"
          label={t("login_password")}
          placeholder={t("login_password_placeholder")}
          type="password"
          registration={register("password", { required: true })}
          error={
            errors.password?.type === "required"
              ? t("login_error_required")
              : undefined
          }
        />

        <Button
          text={t("login_button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}
        {errorCredentials && <span>{errorCredentials}</span>}

        <a href="/register">{t("login_register_link")}</a>
        <a href="/forgot-password">{t("login_forgot_password")}</a>
      </form>

      <Alert
        isOpen={loginState === "unverified"}
        header={t("login_error_email_not_verified_title")}
        message={t("login_error_email_not_verified")}
        onDismiss={() => setLoginState("form")}
        buttons={[
          {
            text: t("login_verify_resend"),
            handler: () => handleResendEmail(),
          },
          {
            text: t("login_close"),
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default Login;
