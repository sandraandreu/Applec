import "./login.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginReducer, initialLoginState } from "./login.reducer";
import Alert from "../../../components/alert/Alert";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import {
  loginUser,
  sendVerificationEmail,
} from "../../../services/auth.service";
import BackButton from "../../../ui-kit/icons/BackButton";
import EyeToggleIcon from "../../../ui-kit/icons/EyeToggleIcon";
import type { FirebaseError } from "../../../models/error.model";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const { isLoading, loginState, unverifiedUser, errorConnection, errorCredentials, showPassword } = state;

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
      dispatch({ type: "LOGIN_START" });
      const userCredential = await loginUser(email, password);

      if (!userCredential.user.emailVerified) {
        dispatch({ type: "LOGIN_UNVERIFIED", user: userCredential.user });
        return;
      }
      dispatch({ type: "LOGIN_SUCCESS" });
      navigate("/events");
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/invalid-credential") {
        dispatch({ type: "ERROR_CREDENTIALS", message: t("login.errors.invalidCredentials") });
        return;
      }
      if (firebaseError.code === "auth/network-request-failed") {
        dispatch({ type: "ERROR_CONNECTION", message: tc("errors.noConnection") });
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
    <div className="login-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="login-page__content">
        <h1 className="login-page__title margin-bottom-48px">{t("login.title")}</h1>
        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
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
            type={showPassword ? "text" : "password"}
            required
            registration={register("password", { required: true })}
            error={
              errors.password?.type === "required"
                ? tc("errors.required")
                : undefined
            }
            endIcon={
              <EyeToggleIcon
                showPassword={showPassword}
                onToggle={() => dispatch({ type: "TOGGLE_PASSWORD" })}
              />
            }
          />

          <Link className="login-page__forgot margin-bottom-48px" to="/forgot-password">
            {t("login.forgotPassword")}
          </Link>

          {errorConnection && (
            <span className="login-page__error">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/></svg>
              {errorConnection}
            </span>
          )}
          {errorCredentials && (
            <span className="login-page__error">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/></svg>
              {errorCredentials}
            </span>
          )}

          <Button
            text={t("login.button")}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
          />
        </form>
      </div>

      <Link className="login-page__register" to="/register">
        {t("login.registerLink")}
      </Link>

      <Alert
        isOpen={loginState === "unverified"}
        header={t("login.errors.emailNotVerifiedTitle")}
        message={t("login.errors.emailNotVerified")}
        onDismiss={() => dispatch({ type: "DISMISS_UNVERIFIED" })}
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
    </div>
  );
};

export default LoginPage;
