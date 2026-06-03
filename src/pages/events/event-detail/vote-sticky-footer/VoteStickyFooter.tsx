import { useTranslation } from "react-i18next";
import Button from "../../../../ui-kit/button/Button";
import Icon from "../../../../ui-kit/icons/icon/Icon";

interface Props {
  eventStatus: "activo" | "plazo-cerrado" | "finalizado";
  myResponse: "going" | "not-going" | undefined;
  visibleLinkedMembers: { id: string; firstName: string }[];
  myLinkedResponses: Record<string, "going" | "not-going">;
  voteError: string | null;
  onVote: (response: "going" | "not-going") => void;
  onCompanionsClick: () => void;
  onAddLinked: () => void;
}

const VoteStickyFooter = ({
  eventStatus,
  myResponse,
  visibleLinkedMembers,
  myLinkedResponses,
  voteError,
  onVote,
  onCompanionsClick,
  onAddLinked,
}: Props) => {
  const { t } = useTranslation("events");

  const hasVisibleCompanions = visibleLinkedMembers.length > 0;
  const noneVoted = visibleLinkedMembers.every(lm => !myLinkedResponses[lm.id]);
  const goingMembers = visibleLinkedMembers.filter(lm => myLinkedResponses[lm.id] === "going");
  const pendingCount = visibleLinkedMembers.filter(lm => !myLinkedResponses[lm.id]).length;

  const companionSubtitle = (() => {
    if (!hasVisibleCompanions) return null;
    if (noneVoted) return t("vote.companionsPrompt");
    const goingNames = goingMembers.map(lm => lm.firstName).join(", ");
    if (goingNames && pendingCount > 0) return `${goingNames} · ${t("vote.companionsPending", { count: pendingCount })}`;
    if (goingNames) return goingNames;
    if (pendingCount > 0) return t("vote.companionsPending", { count: pendingCount });
    return null;
  })();

  return (
    <div className="event-detail-page__vote-sticky">
      {eventStatus === "activo" && (
        <>
          <p className="event-detail-page__vote-question">{t("vote.questionTitle")}</p>
          <div className="event-detail-page__vote-own-buttons">
            <button
              type="button"
              className={`event-detail-page__vote-own-btn event-detail-page__vote-own-btn--yes${myResponse === "going" ? " event-detail-page__vote-own-btn--active" : ""}`}
              aria-pressed={myResponse === "going"}
              onClick={() => onVote("going")}
            >
              <Icon name="check-bold" size={20} aria-hidden="true" />
              {t("vote.yes")}
            </button>
            <button
              type="button"
              className={`event-detail-page__vote-own-btn event-detail-page__vote-own-btn--no${myResponse === "not-going" ? " event-detail-page__vote-own-btn--active" : ""}`}
              aria-pressed={myResponse === "not-going"}
              onClick={() => onVote("not-going")}
            >
              <Icon name="x-mark" size={20} aria-hidden="true" />
              {t("vote.no")}
            </button>
          </div>
          {hasVisibleCompanions ? (
            <Button
              variant={myResponse === "not-going" ? "secondary" : "primary"}
              text={t("vote.companions")}
              onClick={onCompanionsClick}
            />
          ) : (
            <Button
              variant="secondary"
              text={t("vote.addLinked")}
              icon={<Icon name="plus" size={20} />}
              onClick={onAddLinked}
            />
          )}
          {companionSubtitle && (
            <p className="event-detail-page__vote-companions-subtitle">
              {companionSubtitle}
            </p>
          )}
        </>
      )}
      {eventStatus === "plazo-cerrado" && (
        <>
          <div className="event-detail-page__vote-own-buttons event-detail-page__vote-own-buttons--readonly">
            <button
              type="button"
              disabled
              className={`event-detail-page__vote-own-btn event-detail-page__vote-own-btn--yes${myResponse === "going" ? " event-detail-page__vote-own-btn--active" : ""}`}
            >
              <Icon name="check-bold" size={20} aria-hidden="true" />
              {t("vote.yes")}
            </button>
            <button
              type="button"
              disabled
              className={`event-detail-page__vote-own-btn event-detail-page__vote-own-btn--no${myResponse === "not-going" ? " event-detail-page__vote-own-btn--active" : ""}`}
            >
              <Icon name="x-mark" size={20} aria-hidden="true" />
              {t("vote.no")}
            </button>
          </div>
          {goingMembers.length > 0 && (
            <p className="event-detail-page__vote-companions-subtitle">
              {goingMembers.map(lm => lm.firstName).join(", ")}
            </p>
          )}
          <p className="event-detail-page__vote-closed-info">
            {t("vote.closed")}
          </p>
        </>
      )}
      {voteError && (
        <p className="event-detail-page__vote-error">
          <Icon name="error-circle" size={20} aria-hidden="true" />
          {voteError}
        </p>
      )}
    </div>
  );
};

export default VoteStickyFooter;
