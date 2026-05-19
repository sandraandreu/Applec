import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSwipeable } from "react-swipeable";
import Button from "../../ui-kit/button/Button";
import "./modal.scss";

interface ModalProps {
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

const Modal = ({
  isOpen,
  header,
  message,
  onDismiss,
  buttons,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.transition = "";
      }
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
    onSwiping: ({ deltaY }) => {
      if (!sheetRef.current) return;
      if (deltaY > 0) {
        sheetRef.current.style.transition = "none";
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      } else {
        sheetRef.current.style.transform = "translateY(0)";
      }
    },
    onSwipedDown: ({ deltaY, velocity }) => {
      if (!sheetRef.current) return;
      if (velocity > 0.5 || deltaY > 100) {
        onDismiss();
      } else {
        sheetRef.current.style.transition = "transform 0.22s ease";
        sheetRef.current.style.transform = "translateY(0)";
      }
    },
    onSwiped: ({ dir }) => {
      if (dir !== "Down" && sheetRef.current) {
        sheetRef.current.style.transition = "transform 0.22s ease";
        sheetRef.current.style.transform = "translateY(0)";
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const handleButtonClick = (button: ModalProps["buttons"][number]) => {
    button.handler?.();
    onDismiss();
  };

  return createPortal(
    <dialog ref={dialogRef} className="modal" onClose={onDismiss} aria-labelledby={header ? "modal-title" : undefined}>
      <div
        className="modal__sheet"
        ref={(node) => {
          swipeRef(node);
          sheetRef.current = node;
        }}
        {...swipeHandlers}
      >
        <div className="modal__handle" aria-hidden="true" />
        <div className="modal__text">
          {header && <h2 id="modal-title" className="modal__header">{header}</h2>}
          {message && <p className="modal__message">{message}</p>}
        </div>
        <div className="modal__buttons">
          {buttons.map((button, index) => (
            <Button
              key={index}
              text={button.text}
              variant={button.role === "cancel" ? "secondary" : button.role === "danger" ? "danger" : "primary"}
              onClick={() => handleButtonClick(button)}
            />
          ))}
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default Modal;
