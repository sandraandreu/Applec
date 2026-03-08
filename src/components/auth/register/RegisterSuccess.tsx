
import "./RegisterSuccess.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { IonButton } from "@ionic/react";

interface RegisterSuccessProps {
  handleResendEmail: () => void;
  onBack: () => void;
}

const RegisterSuccess = ({ handleResendEmail, onBack }:RegisterSuccessProps) => {
  const { t } = useTranslation();

  const [counter, setCounter] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((previousNum) => previousNum - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>{t("register_verify_title")}</h1>
      <p>{t("register_verify_message")}</p>
      <IonButton onClick={onBack}>{t("register_back")}</IonButton>
      {counter <= 0 && (
        <IonButton
          onClick={() => {
            handleResendEmail();
            setCounter(30);
          }}
        >
          {t("register_verify_resend")}
        </IonButton>
      )}
    </>
  );
};

export default RegisterSuccess;
