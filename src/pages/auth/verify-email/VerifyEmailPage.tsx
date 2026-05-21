import "./verify-email.scss";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Button from "../../../ui-kit/button/Button";
import { sendVerificationEmail } from "../../../services/auth.service";
import { useAuthContext } from "../../../context/auth/AuthContext";

interface VerifyEmailLocationState {
  emailSent?: boolean;
}

const VerifyEmailPage = () => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();

  const emailSent =
    (location.state as VerifyEmailLocationState)?.emailSent ?? true;

  const [resendSuccess, setResendSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      setResendSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    logout();
    navigate("/login");
  };

  const title = emailSent
    ? t("register.verifyTitle")
    : t("register.emailVerificationFailedTitle");

  const message = emailSent
    ? t("register.verifyMessage")
    : t("register.emailVerificationFailedMessage");

  return (
    <div className="verify-email-page">
      <div className="verify-email-page__content">
        <div className="verify-email-page__header">
          <h1 className="verify-email-page__title">{title}</h1>
          <p className="verify-email-page__description">{message}</p>
        </div>

        <div className="verify-email-page__actions">
          <Button
            variant="secondary"
            text={tCommon("buttons.resendEmail")}
            onClick={handleResend}
            isLoading={isLoading}
          />
          <Button
            text={t("register.verifyLoginButton")}
            onClick={handleLogin}
          />
          {resendSuccess && (
            <p className="verify-email-page__resend-success">
              {t("register.verifyResendSuccess")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
