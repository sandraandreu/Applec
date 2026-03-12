import "./RegisterError.scss";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";

interface RegisterErrorProps {
  onBack: () => void;
}

const RegisterError = ({onBack }:RegisterErrorProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("register_error_email_taken")}</h1>
      <IonButton onClick={onBack}>{t("register_back")}</IonButton>
      <IonButton routerLink="/login">
        {t("register_error_email_taken_button")}
      </IonButton>
    </>
  );
};

export default RegisterError;
