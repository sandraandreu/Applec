import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import Avatar from "../../../../ui-kit/avatar/Avatar";
import Button from "../../../../ui-kit/button/Button";
import Icon from "../../../../ui-kit/icons/icon/Icon";
import "./vote-sheet.scss";

export interface VoteLinkedMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

interface VoteSheetProps {
  isOpen: boolean;
  onDismiss: () => void;
  userFirstName: string;
  userLastName: string;
  userRole: "admin" | "organizer" | "member";
  deadline?: string;
  linkedMembers: VoteLinkedMember[];
  onAddLinked: () => void;
}

const VoteSheet = ({
  isOpen,
  onDismiss,
  userFirstName,
  userLastName,
  userRole,
  deadline,
  linkedMembers,
  onAddLinked,
}: VoteSheetProps) => {
  const { t } = useTranslation("events");
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
      if (!sheetRef.current || deltaY <= 0) return;
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
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

  return createPortal(
    <dialog ref={dialogRef} className="vote-sheet" onClose={onDismiss} aria-labelledby="vote-sheet-title">
      <div
        className="vote-sheet__panel"
        ref={(node) => {
          swipeRef(node);
          sheetRef.current = node;
        }}
        {...swipeHandlers}
      >
        <div className="vote-sheet__handle" aria-hidden="true" />

        <div className="vote-sheet__scroll">
          <div className="vote-sheet__user">
            <Avatar firstName={userFirstName} lastName={userLastName} role={userRole} size="md" />
            <span className="vote-sheet__user-name">
              {userFirstName} {userLastName}
            </span>
          </div>

          <div className="vote-sheet__question">
            <h2 id="vote-sheet-title" className="vote-sheet__question-title">{t("vote.title")}</h2>
            {deadline && (
              <p className="vote-sheet__question-deadline">
                {t("vote.deadline", { date: deadline })}
              </p>
            )}
            <div className="vote-sheet__own-buttons">
              <button
                type="button"
                className="vote-sheet__own-btn vote-sheet__own-btn--yes"
                aria-pressed={false}
              >
                <Icon name="check-bold" size={20} aria-hidden="true" />
                {t("vote.yes")}
              </button>
              <button
                type="button"
                className="vote-sheet__own-btn vote-sheet__own-btn--no vote-sheet__own-btn--active"
                aria-pressed={true}
              >
                <Icon name="x-mark" size={20} aria-hidden="true" />
                {t("vote.no")}
              </button>
            </div>
          </div>

          {linkedMembers.length > 0 && (
            <ul className="vote-sheet__linked-list" aria-label={t("vote.linkedLabel")}>
              {linkedMembers.map((member) => (
                <li key={member.id} className="vote-sheet__linked-item">
                  <Avatar firstName={member.firstName} lastName={member.lastName} size="sm" />
                  <div className="vote-sheet__linked-info">
                    <span className="vote-sheet__linked-name">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="vote-sheet__linked-relationship">
                      {member.relationship}
                    </span>
                  </div>
                  <div className="vote-sheet__linked-actions">
                    <button
                      type="button"
                      className="vote-sheet__vote-btn vote-sheet__vote-btn--yes vote-sheet__vote-btn--active"
                      aria-label={`${member.firstName} ${t("vote.yes")}`}
                      aria-pressed={true}
                    >
                      <Icon name="check-bold" size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="vote-sheet__vote-btn vote-sheet__vote-btn--no"
                      aria-label={`${member.firstName} ${t("vote.no")}`}
                      aria-pressed={false}
                    >
                      <Icon name="x-mark" size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button
            variant="linked"
            text={t("vote.addLinked")}
            icon={<Icon name="plus" size={22} />}
            onClick={onAddLinked}
          />
        </div>

        <div className="vote-sheet__footer">
          <Button variant="primary" text={t("vote.save")} />
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default VoteSheet;
