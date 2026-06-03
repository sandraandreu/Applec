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
  type?: "fallero" | "extern";
}

interface VoteSheetProps {
  isOpen: boolean;
  onDismiss: () => void;
  myResponse?: "going" | "not-going";
  linkedMembers: VoteLinkedMember[];
  allowExternalGuests?: boolean;
  maxExternalGuests?: number;
  onAddLinked: () => void;
  initialLinkedResponses?: Record<string, "going" | "not-going">;
  onSaveCompanions: (linkedResponses: Record<string, "going" | "not-going">) => Promise<void>;
}

const VoteSheet = ({
  isOpen,
  onDismiss,
  myResponse,
  linkedMembers,
  allowExternalGuests,
  maxExternalGuests,
  onAddLinked,
  initialLinkedResponses,
  onSaveCompanions,
}: VoteSheetProps) => {
  const { t } = useTranslation("events");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const initialVotesRef = useRef<Record<string, "going" | "not-going" | null>>({});
  const [linkedVotes, setLinkedVotes] = useState<Record<string, "going" | "not-going" | null>>({});

  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, "going" | "not-going" | null> = {};
    linkedMembers.forEach((member) => {
      initial[member.id] = initialLinkedResponses?.[member.id] ?? null;
    });
    setLinkedVotes(initial);
    initialVotesRef.current = { ...initial };
  }, [isOpen, linkedMembers, initialLinkedResponses]);

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

  const isDirty = Object.entries(linkedVotes).some(
    ([id, vote]) => vote !== (initialVotesRef.current[id] ?? null)
  );

  const handleDismiss = () => {
    if (isDirty) {
      const filteredVotes: Record<string, "going" | "not-going"> = {};
      Object.entries(linkedVotes).forEach(([id, vote]) => {
        if (vote !== null) filteredVotes[id] = vote;
      });
      onSaveCompanions(filteredVotes).catch(() => undefined);
    }
    onDismiss();
  };

  const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
    onSwiping: ({ deltaY }) => {
      if (!sheetRef.current || deltaY <= 0) return;
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    },
    onSwipedDown: ({ deltaY, velocity }) => {
      if (!sheetRef.current) return;
      if (velocity > 0.5 || deltaY > 100) {
        handleDismiss();
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

  const filteredMembers = allowExternalGuests === false
    ? linkedMembers.filter(lm => lm.type !== "extern")
    : linkedMembers;
  const visibleMembers = [
    ...filteredMembers.filter(lm => (lm.type ?? "fallero") === "fallero"),
    ...filteredMembers.filter(lm => lm.type === "extern"),
  ];

  const goingExternalsCount = linkedMembers
    .filter(lm => lm.type === "extern" && linkedVotes[lm.id] === "going")
    .length;
  const externalLimitReached = allowExternalGuests && maxExternalGuests !== undefined
    && goingExternalsCount >= maxExternalGuests;

  const isDisabled = (member: VoteLinkedMember) =>
    !!(externalLimitReached && member.type === "extern" && linkedVotes[member.id] !== "going");

  const companionsDesc = allowExternalGuests === false
    ? t("vote.companionsDescFallersOnly")
    : myResponse === "not-going"
      ? t("vote.companionsDescNotGoing")
      : t("vote.companionsDesc");

  const renderLinkedMember = (member: VoteLinkedMember) => {
    const disabled = isDisabled(member);
    const isFallero = (member.type ?? "fallero") === "fallero";
    return (
      <li
        key={member.id}
        className={`vote-sheet__linked-item${isFallero ? " vote-sheet__linked-item--fallero" : ""}${disabled ? " vote-sheet__linked-item--disabled" : ""}`}
      >
        <Avatar firstName={member.firstName} lastName={member.lastName} size="md" />
        <div className="vote-sheet__linked-info">
          <span className="vote-sheet__linked-name">
            {member.firstName} {member.lastName}
          </span>
          <span className="vote-sheet__linked-relationship">
            {member.relationship}
          </span>
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

  return createPortal(
    <dialog
      ref={dialogRef}
      className="vote-sheet"
      onClose={handleDismiss}
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
          <div className="vote-sheet__header">
            <h2 id="vote-sheet-title" className="vote-sheet__header-title">
              {t("vote.linkedLabel")}
            </h2>
            <p className="vote-sheet__header-desc">{companionsDesc}</p>
          </div>

          {externalLimitReached && (
            <p className="vote-sheet__limit-message">
              {t("vote.externalLimit", { count: maxExternalGuests })}
            </p>
          )}

          {visibleMembers.length > 0 && (
            <ul className="vote-sheet__linked-list">
              {visibleMembers.map(member => renderLinkedMember(member))}
            </ul>
          )}
        </div>
        <div className="vote-sheet__footer">
          <Button
            variant="secondary"
            text={t("vote.addLinked")}
            icon={<Icon name="plus" size={22} />}
            onClick={onAddLinked}
          />
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default VoteSheet;
