import "./RegisterSuccess.scss";
import { IonAlert } from "@ionic/react";
import { useTranslation } from "react-i18next";

interface RegisterSuccessProps {
  isOpen: boolean;
  handleResendEmail: () => void;
  onClose: () => void;
}

const RegisterSuccess = ({
  isOpen,
  handleResendEmail,
  onClose,
}: RegisterSuccessProps) => {
  const { t } = useTranslation();

  return (
    <>
      <IonAlert
        isOpen={isOpen}
        header={t("register_verify_title")}
        message={t("register_verify_message")}
        buttons={[
          {
            text: t("register_verify_resend"),
            handler: () => {
              handleResendEmail();
            },
          },
        ]}
        onDidDismiss={onClose}
      ></IonAlert>
    </>
  );
};

export default RegisterSuccess;
