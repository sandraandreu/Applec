import { useEffect, useRef, useState } from "react";
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
  deadline?: string;
  linkedMembers: VoteLinkedMember[];
  onAddLinked: () => void;
  initialResponse?: "going" | "not-going";
  initialLinkedResponses?: Record<string, "going" | "not-going">;
  onSave: (response: "going" | "not-going" | undefined, linkedResponses: Record<string, "going" | "not-going">) => Promise<void>;
}

const VoteSheet = ({
  isOpen,
  onDismiss,
  deadline,
  linkedMembers,
  onAddLinked,
  initialResponse,
  initialLinkedResponses,
  onSave,
}: VoteSheetProps) => {
  const { t } = useTranslation("events");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<"going" | "not-going" | null>(
    initialResponse ?? null
  );
  const [linkedVotes, setLinkedVotes] = useState<Record<string, "going" | "not-going" | null>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedResponse(initialResponse ?? null);
    const initial: Record<string, "going" | "not-going" | null> = {};
    linkedMembers.forEach((member) => {
      initial[member.id] = initialLinkedResponses?.[member.id] ?? null;
    });
    setLinkedVotes(initial);
  }, [isOpen]); // reset draft state on each open

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

  const hasAnyVote = !!selectedResponse || Object.values(linkedVotes).some(v => v !== null);

  const handleSave = async () => {
    if (!hasAnyVote || isSaving) return;
    setIsSaving(true);
    const filteredLinkedVotes: Record<string, "going" | "not-going"> = {};
    Object.entries(linkedVotes).forEach(([id, vote]) => {
      if (vote !== null) filteredLinkedVotes[id] = vote;
    });
    try {
      await onSave(selectedResponse ?? undefined, filteredLinkedVotes);
      onDismiss();
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="vote-sheet"
      onClose={onDismiss}
      aria-labelledby="vote-sheet-title"
    >
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
          <div className="vote-sheet__question">
            <h2 id="vote-sheet-title" className="vote-sheet__question-title">
              {t("vote.title")}
            </h2>
            {deadline && (
              <p className="vote-sheet__question-deadline">
                {t("vote.deadline", { date: deadline })}
              </p>
            )}
            <div className="vote-sheet__own-buttons">
              <button
                type="button"
                className={`vote-sheet__own-btn vote-sheet__own-btn--yes${selectedResponse === "going" ? " vote-sheet__own-btn--active" : ""}`}
                aria-pressed={selectedResponse === "going"}
                onClick={() => setSelectedResponse((prev) => prev === "going" ? null : "going")}
              >
                <Icon name="check-bold" size={20} aria-hidden="true" />
                {t("vote.yes")}
              </button>
              <button
                type="button"
                className={`vote-sheet__own-btn vote-sheet__own-btn--no${selectedResponse === "not-going" ? " vote-sheet__own-btn--active" : ""}`}
                aria-pressed={selectedResponse === "not-going"}
                onClick={() => setSelectedResponse((prev) => prev === "not-going" ? null : "not-going")}
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
                      className={`vote-sheet__vote-btn vote-sheet__vote-btn--yes${linkedVotes[member.id] === "going" ? " vote-sheet__vote-btn--active" : ""}`}
                      aria-label={`${member.firstName} ${t("vote.yes")}`}
                      aria-pressed={linkedVotes[member.id] === "going"}
                      onClick={() =>
                        setLinkedVotes((prev) => ({ ...prev, [member.id]: prev[member.id] === "going" ? null : "going" }))
                      }
                    >
                      <Icon name="check-bold" size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`vote-sheet__vote-btn vote-sheet__vote-btn--no${linkedVotes[member.id] === "not-going" ? " vote-sheet__vote-btn--active" : ""}`}
                      aria-label={`${member.firstName} ${t("vote.no")}`}
                      aria-pressed={linkedVotes[member.id] === "not-going"}
                      onClick={() =>
                        setLinkedVotes((prev) => ({ ...prev, [member.id]: prev[member.id] === "not-going" ? null : "not-going" }))
                      }
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
          <Button
            variant="primary"
            text={t("vote.save")}
            onClick={handleSave}
            disabled={!selectedResponse && !Object.values(linkedVotes).some(linkedVote => linkedVote !== null)}
            isLoading={isSaving}
          />
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default VoteSheet;
