import "./Login.scss";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useHistory } from "react-router-dom";
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
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

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
        setIsLoading(false)
        return;
      }
      setIsLoading(false);
      history.push("/onboarding/welcome");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setErrorCredentials(t("login.errors.invalidCredentials"));
        setIsLoading(false);
        return;
      }
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        setIsLoading(false);
        return;
      }
      console.error("Email sign up error:", error.message);
    }
  };

  //Reenviar email de verificación

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
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
