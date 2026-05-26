import { useTranslation } from "react-i18next";
import Button from "../../../../ui-kit/button/Button";
import Icon from "../../../../ui-kit/icons/icon/Icon";

interface Props {
  eventStatus: "activo" | "plazo-cerrado" | "finalizado";
  hasVoted: boolean;
  myResponse: "going" | "not-going" | undefined;
  myLinkedMembers: { id: string; firstName: string }[];
  myLinkedResponses: Record<string, "going" | "not-going">;
  deadline?: string;
  voteError: string | null;
  onVoteClick: () => void;
}

const VoteStickyFooter = ({
  eventStatus,
  hasVoted,
  myResponse,
  myLinkedMembers,
  myLinkedResponses,
  deadline,
  voteError,
  onVoteClick,
}: Props) => {
  const { t } = useTranslation("events");

  return (
    <div className="event-detail-page__vote-sticky">
      {hasVoted ? (
        <div className="event-detail-page__vote-summary">
          <div className="event-detail-page__vote-own-row">
            <span className="event-detail-page__vote-label">{t("vote.myVote")}</span>
            {myResponse ? (
              <span className={`event-detail-page__vote-own-chip event-detail-page__vote-own-chip--${myResponse}`}>
                <Icon name={myResponse === "going" ? "check-bold" : "x-mark"} size={20} aria-hidden="true" />
                {myResponse === "going" ? t("attendance.going") : t("attendance.notGoing")}
              </span>
            ) : (
              <span className="event-detail-page__vote-own-chip event-detail-page__vote-own-chip--pending">
                –
              </span>
            )}
          </div>
          {myLinkedMembers.filter(linked => myLinkedResponses[linked.id]).length > 0 && (
            <ul className="event-detail-page__vote-linked-list">
              {myLinkedMembers
                .filter(linked => myLinkedResponses[linked.id])
                .map(linked => (
                  <li key={linked.id} className="event-detail-page__vote-linked-row">
                    <span className="event-detail-page__vote-linked-name">
                      {linked.firstName}
                    </span>
                    <span className={`event-detail-page__vote-linked-chip event-detail-page__vote-linked-chip--${myLinkedResponses[linked.id]}`}>
                      <Icon name={myLinkedResponses[linked.id] === "going" ? "check-bold" : "x-mark"} size={16} aria-hidden="true" />
                      {myLinkedResponses[linked.id] === "going" ? t("vote.yes") : t("vote.no")}
                    </span>
                  </li>
                ))}
            </ul>
          )}
          {eventStatus === "activo" && (
            <Button
              variant="primary"
              text={t("vote.modify")}
              onClick={onVoteClick}
            />
          )}
        </div>
      ) : (
        <>
          {eventStatus === "activo" && (
            <>
              {deadline && (
                <p className="event-detail-page__vote-deadline">
                  <Icon name="clock" size={20} aria-hidden="true" />
                  {t("vote.deadline", { date: deadline })}
                </p>
              )}
              <Button
                variant="especial"
                text={t("vote.cta")}
                onClick={onVoteClick}
              />
            </>
          )}
          {eventStatus === "plazo-cerrado" && (
            <p className="event-detail-page__vote-closed-info">
              {t("vote.closed")}
            </p>
          )}
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
