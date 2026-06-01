import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import Avatar from "../../../../ui-kit/avatar/Avatar";
import Button from "../../../../ui-kit/button/Button";
import BackButton from "../../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Icon from "../../../../ui-kit/icons/icon/Icon";
import "./vote-sheet.scss";

export interface VoteLinkedMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  type?: "fallero" | "extern";
}

interface VoteSheetProps {
  isOpen: boolean;
  onDismiss: () => void;
  deadline?: string;
  linkedMembers: VoteLinkedMember[];
  allowExternalGuests?: boolean;
  maxExternalGuests?: number;
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
  allowExternalGuests,
  maxExternalGuests,
  onAddLinked,
  initialResponse,
  initialLinkedResponses,
  onSave,
}: VoteSheetProps) => {
  const { t } = useTranslation("events");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedResponse, setSelectedResponse] = useState<"going" | "not-going" | null>(
    initialResponse ?? null
  );
  const [linkedVotes, setLinkedVotes] = useState<Record<string, "going" | "not-going" | null>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setSelectedResponse(initialResponse ?? null);
    const initial: Record<string, "going" | "not-going" | null> = {};
    linkedMembers.forEach((member) => {
      initial[member.id] = initialLinkedResponses?.[member.id] ?? null;
    });
    setLinkedVotes(initial);
  }, [isOpen]);

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

  const handleSave = async () => {
    if (isSaving) return;
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

  const falleroMembers = linkedMembers.filter(lm => (lm.type ?? "fallero") === "fallero");
  const externMembers = linkedMembers.filter(lm => lm.type === "extern");

  const goingExternalsCount = linkedMembers
    .filter(lm => lm.type === "extern" && linkedVotes[lm.id] === "going")
    .length;
  const externalLimitReached = allowExternalGuests && maxExternalGuests !== undefined
    && goingExternalsCount >= maxExternalGuests;

  const isDisabled = (member: VoteLinkedMember) => {
    if (allowExternalGuests === false && member.type === "extern") return true;
    if (externalLimitReached && member.type === "extern" && linkedVotes[member.id] !== "going") return true;
    return false;
  };

  const renderLinkedMember = (member: VoteLinkedMember) => {
    const disabled = isDisabled(member);
    const externalNotAllowed = allowExternalGuests === false && member.type === "extern";
    return (
      <li
        key={member.id}
        className={`vote-sheet__linked-item${disabled ? " vote-sheet__linked-item--disabled" : ""}`}
      >
        <Avatar firstName={member.firstName} lastName={member.lastName} size="md" />
        <div className="vote-sheet__linked-info">
          <span className="vote-sheet__linked-name">
            {member.firstName} {member.lastName}
          </span>
          {externalNotAllowed ? (
            <span className="vote-sheet__linked-warning">
              {t("vote.externalNotAllowed")}
            </span>
          ) : (
            <span className="vote-sheet__linked-relationship">
              {member.relationship}
            </span>
          )}
        </div>
        {!disabled && (
          <div className="vote-sheet__linked-actions">
            <button
              type="button"
              className={`vote-sheet__vote-btn vote-sheet__vote-btn--yes${linkedVotes[member.id] === "going" ? " vote-sheet__vote-btn--active" : ""}`}
              aria-label={`${member.firstName} ${t("vote.companionYes")}`}
              aria-pressed={linkedVotes[member.id] === "going"}
              onClick={() => setLinkedVotes(prev => ({ ...prev, [member.id]: prev[member.id] === "going" ? null : "going" }))}
            >
              <Icon name="check-bold" size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`vote-sheet__vote-btn vote-sheet__vote-btn--no${linkedVotes[member.id] === "not-going" ? " vote-sheet__vote-btn--active" : ""}`}
              aria-label={`${member.firstName} ${t("vote.companionNo")}`}
              aria-pressed={linkedVotes[member.id] === "not-going"}
              onClick={() => setLinkedVotes(prev => ({ ...prev, [member.id]: prev[member.id] === "not-going" ? null : "not-going" }))}
            >
              <Icon name="x-mark" size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </li>
    );
  };

  const companionsDesc = linkedMembers.length === 0
    ? t("vote.companionsEmpty")
    : allowExternalGuests === false
      ? t("vote.companionsDescFallersOnly")
      : t("vote.companionsDesc");

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

        {step === 1 ? (
          <>
            <div className="vote-sheet__scroll">
              <div className="vote-sheet__question">
                <h2 id="vote-sheet-title" className="vote-sheet__question-title">
                  {t("vote.title")}
                </h2>
                <p className="vote-sheet__question-desc">
                  {deadline ? t("vote.ownDesc", { date: deadline }) : t("vote.ownDescNoDeadline")}
                </p>
                <div className="vote-sheet__own-buttons">
                  <button
                    type="button"
                    className={`vote-sheet__own-btn vote-sheet__own-btn--yes${selectedResponse === "going" ? " vote-sheet__own-btn--active" : ""}`}
                    aria-pressed={selectedResponse === "going"}
                    onClick={() => setSelectedResponse(prev => prev === "going" ? null : "going")}
                  >
                    <Icon name="check-bold" size={20} aria-hidden="true" />
                    {t("vote.yes")}
                  </button>
                  <button
                    type="button"
                    className={`vote-sheet__own-btn vote-sheet__own-btn--no${selectedResponse === "not-going" ? " vote-sheet__own-btn--active" : ""}`}
                    aria-pressed={selectedResponse === "not-going"}
                    onClick={() => setSelectedResponse(prev => prev === "not-going" ? null : "not-going")}
                  >
                    <Icon name="x-mark" size={20} aria-hidden="true" />
                    {t("vote.no")}
                  </button>
                </div>
              </div>
            </div>
            <div className="vote-sheet__footer">
              <Button
                variant="primary"
                text={t("vote.next")}
                disabled={!selectedResponse}
                onClick={() => setStep(2)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="vote-sheet__scroll">
              <div className="vote-sheet__companions-header">
                <BackButton onClick={() => setStep(1)} />
                <div className="vote-sheet__companions-info">
                  <h2 id="vote-sheet-title" className="vote-sheet__companions-title">
                    {t("vote.linkedLabel")}
                  </h2>
                  <p className="vote-sheet__companions-desc">{companionsDesc}</p>
                </div>
              </div>

              {linkedMembers.length > 0 && (
                <div className="vote-sheet__linked-list">
                  {falleroMembers.length > 0 && (
                    <div className="vote-sheet__linked-section">
                      {externMembers.length > 0 && (
                        <p className="vote-sheet__linked-section-label">{t("linked.typeFallero")}</p>
                      )}
                      <ul>
                        {falleroMembers.map(member => renderLinkedMember(member))}
                      </ul>
                    </div>
                  )}
                  {externMembers.length > 0 && (
                    <div className="vote-sheet__linked-section">
                      <p className="vote-sheet__linked-section-label">{t("linked.typeExtern")}</p>
                      {externalLimitReached && (
                        <p className="vote-sheet__limit-message">
                          {t("vote.externalLimit", { count: maxExternalGuests })}
                        </p>
                      )}
                      <ul>
                        {externMembers.map(member => renderLinkedMember(member))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="vote-sheet__footer">
              <Button
                variant="secondary"
                text={t("vote.addLinked")}
                icon={<Icon name="plus" size={22} />}
                onClick={onAddLinked}
              />
              <Button
                variant="primary"
                text={t("vote.save")}
                onClick={handleSave}
                isLoading={isSaving}
              />
            </div>
          </>
        )}
      </div>
    </dialog>,
    document.body
  );
};

export default VoteSheet;
