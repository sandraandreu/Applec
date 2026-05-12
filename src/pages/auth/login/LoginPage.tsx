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
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
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
          message: tc("errors.noConnection"),
        });
        return;
      }
      dispatch({ type: "ERROR_CREDENTIALS", message: t(getErrorKey(error)) });
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
        <h1 className="login-page__title margin-bottom-48px">
          {t("login.title")}
        </h1>
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

          <Link
            className="login-page__forgot margin-bottom-48px"
            to="/forgot-password"
          >
            {t("login.forgotPassword")}
          </Link>

          {errorConnection && (
            <span className="login-page__error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection}
            </span>
          )}
          {errorCredentials && (
            <span className="login-page__error">
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
