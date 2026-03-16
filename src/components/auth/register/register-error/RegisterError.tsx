import "./RegisterError.scss";
import { IonAlert, useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";

interface RegisterErrorProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterError = ({ isOpen, onClose }: RegisterErrorProps) => {
  const { t } = useTranslation();
  const router = useIonRouter();

  return (
    <>
      <IonAlert
        isOpen={isOpen}
        header={t("register_error_email_taken")}
        buttons={[
          {
            text: t("register_close"),
            role: "cancel",
          },
          {
            text: t("register_error_email_taken_button"),
            handler: () => {
              router.push("/login");
            },
          },
        ]}
        onDidDismiss={onClose}
      ></IonAlert>
    </>
  );
};

export default RegisterError;
