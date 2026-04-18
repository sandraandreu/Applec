import "./login.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/alert/Alert";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import { loginUser, sendVerificationEmail } from "../../../services/auth.service";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<"form" | "unverified">("form");
  const [unverifiedUser, setUnverifiedUser] = useState<import("firebase/auth").User | null>(null);
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

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await loginUser(email, password);

      setUnverifiedUser(userCredential.user);

      if (!userCredential.user.emailVerified) {
        setLoginState("unverified");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate("/home");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/invalid-credential") {
        setErrorCredentials(t("login.errors.invalidCredentials"));
        setIsLoading(false);
        return;
      }
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        setIsLoading(false);
        return;
      }
      console.error("Email sign up error:", firebaseError.message);
    }
  };

  const handleResendEmail = async () => {
    if (unverifiedUser) {
      await sendVerificationEmail(unverifiedUser);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("login.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="login-email"
          label={tc("fields.email")}
          placeholder={t("login.emailPlaceholder")}
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
          id="login-password"
          label={tc("fields.password")}
          placeholder={t("login.passwordPlaceholder")}
          type="password"
          required
          registration={register("password", { required: true })}
          error={
            errors.password?.type === "required"
              ? tc("errors.required")
              : undefined
          }
        />

        <Button
          text={t("login.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}
        {errorCredentials && <span>{errorCredentials}</span>}

        <a href="/register">{t("login.registerLink")}</a>
        <a href="/forgot-password">{t("login.forgotPassword")}</a>
      </form>

      <Alert
        isOpen={loginState === "unverified"}
        header={t("login.errors.emailNotVerifiedTitle")}
        message={t("login.errors.emailNotVerified")}
        onDismiss={() => setLoginState("form")}
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
    </>
  );
};

export default Login;
