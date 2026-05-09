import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "../../ui-kit/button/Button";
import "./alert.scss";

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleButtonClick = (button: AlertProps["buttons"][number]) => {
    button.handler?.();
    onDismiss();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="alert"
      onClose={onDismiss}
    >
      <div className="alert__content">
        <div className="alert__text">
{header && <h2 className="alert__header">{header}</h2>}
        {message && <p className="alert__message">{message}</p>}
        </div>
        
        <div className="alert__buttons">
          {buttons.map((button, index) => (
            <Button
              key={index}
              text={button.text}
              variant={button.role === "cancel" ? "secondary" : "primary"}
              onClick={() => handleButtonClick(button)}
            />
          ))}
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default Alert;
