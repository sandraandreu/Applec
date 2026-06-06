import "./login.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useReducer, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginReducer, initialLoginState } from "./login.reducer";
import Modal from "../../../components/modal/Modal";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import {
  loginUser,
  logoutUser,
  sendVerificationEmail,
} from "../../../services/auth.service";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import EyeToggleIcon from "../../../ui-kit/button/icon-buttons/eye-toggle/EyeToggleIcon";
import Icon from "../../../ui-kit/icons/icon/Icon";
import { isFirebaseError, getErrorKey } from "../../../utils/firebase-errors";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(false);
  const {
    isLoading,
    loginState,
    unverifiedUser,
    errorConnection,
    errorCredentials,
    showPassword,
  } = state;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: "onSubmit" });

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.email.trim(), data.password);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const userCredential = await loginUser(email, password);

      if (!userCredential.user.emailVerified) {
        const unverifiedUser = userCredential.user;
        await logoutUser();
        dispatch({ type: "LOGIN_UNVERIFIED", user: unverifiedUser });
        return;
      }
      dispatch({ type: "LOGIN_SUCCESS" });
      navigate("/events", { replace: true });
    } catch (error: unknown) {
      if (isFirebaseError(error) && error.code === "auth/invalid-credential") {
        dispatch({
          type: "ERROR_CREDENTIALS",
          message: t("login.errors.invalidCredentials"),
        });
        return;
      }
      if (
        isFirebaseError(error) &&
        error.code === "auth/network-request-failed"
      ) {
        dispatch({
          type: "ERROR_CONNECTION",
          message: tCommon("errors.noConnection"),
        });
        return;
      }
      dispatch({ type: "ERROR_CREDENTIALS", message: t(getErrorKey(error)) });
    }
  };

  const handleResendEmail = async () => {
    if (!unverifiedUser) return;
    setResendSuccess(false);
    setResendError(false);
    try {
      await sendVerificationEmail(unverifiedUser);
      setResendSuccess(true);
    } catch {
      setResendError(true);
    }
  };

  return (
    <div className="login-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="login-page__center">
        <h1 className="login-page__title">{t("login.title")}</h1>

        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="login-page__fields">
            <Input
              id="login-email"
              label={tCommon("fields.email")}
              placeholder={t("login.emailPlaceholder")}
              type="text"
              required
              maxLength={254}
              registration={register("email", {
                required: true,
                maxLength: 254,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              error={
                errors.email?.type === "required"
                  ? tCommon("errors.required")
                  : errors.email?.type === "pattern"
                    ? tCommon("errors.emailInvalid")
                    : undefined
              }
            />

            <Input
              id="login-password"
              label={tCommon("fields.password")}
              placeholder={t("login.passwordPlaceholder")}
              type={showPassword ? "text" : "password"}
              required
              maxLength={128}
              registration={register("password", { required: true, maxLength: 128 })}
              error={
                errors.password?.type === "required"
                  ? tCommon("errors.required")
                  : undefined
              }
              endIcon={
                <EyeToggleIcon
                  showPassword={showPassword}
                  onToggle={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                />
              }
            />

            <Link className="login-page__forgot" to="/forgot-password">
              {t("login.forgotPassword")}
            </Link>
          </div>

          <div className="login-page__actions">
            {errorConnection && (
              <span className="inline-error">
                <Icon name="error-circle" size={24} className="icon" />
                {errorConnection}
              </span>
            )}
            {errorCredentials && (
              <span className="inline-error">
                <Icon name="error-circle" size={24} className="icon" />
                {errorCredentials}
              </span>
            )}
            <Button
              text={t("login.button")}
              type="submit"
              disabled={Object.keys(errors).length > 0}
              isLoading={isLoading}
            />
            <Link className="login-page__register" to="/register">
              {t("login.registerLink")}
            </Link>
          </div>
        </form>
      </div>

      <Modal
        isOpen={loginState === "unverified"}
        header={t("login.errors.emailNotVerifiedTitle")}
        message={
          resendSuccess
            ? t("login.errors.resendSuccess")
            : resendError
              ? t("login.errors.resendError")
              : t("login.errors.emailNotVerified")
        }
        onDismiss={() => {
          dispatch({ type: "DISMISS_UNVERIFIED" });
          setResendSuccess(false);
          setResendError(false);
        }}
        buttons={[
          {
            text: tCommon("buttons.resendEmail"),
            handler: () => handleResendEmail(),
          },
          {
            text: tCommon("buttons.close"),
            role: "cancel",
          },
        ]}
      />
    </div>
  );
};

export default LoginPage;
