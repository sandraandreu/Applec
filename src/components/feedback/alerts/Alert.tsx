import { IonAlert } from "@ionic/react";
import "./Alert.scss";

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
  return (
    <IonAlert
      isOpen={isOpen}
      header={header}
      message={message}
      buttons={buttons}
      onDidDismiss={onDismiss}
    />
  );
};

export default Alert;
