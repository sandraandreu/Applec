import { IonAlert } from "@ionic/react";
import { createPortal } from "react-dom";

interface AlertProps {
  isOpen: boolean;
  header?: string;
  message?: string;
  onDismiss: () => void;
  buttons: {
    text: string;
    role?: string;
    handler?: () => void;
  }[];
}

const Alert = ({
  isOpen,
  header,
  message,
  onDismiss,
  buttons,
}: AlertProps) => {
  return createPortal(
    <IonAlert
      isOpen={isOpen}
      header={header}
      message={message}
      buttons={buttons}
      onDidDismiss={onDismiss}
    />,
    document.body
  );
};

export default Alert;
