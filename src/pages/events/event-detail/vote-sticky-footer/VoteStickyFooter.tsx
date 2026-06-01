import { useTranslation } from "react-i18next";
import Button from "../../../../ui-kit/button/Button";
import Icon from "../../../../ui-kit/icons/icon/Icon";
import AttendanceIndicator from "../../../../ui-kit/attendance-indicator/AttendanceIndicator";

interface Props {
  eventStatus: "activo" | "plazo-cerrado" | "finalizado";
  hasVoted: boolean;
  myResponse: "going" | "not-going" | undefined;
  myLinkedMembers: { id: string; firstName: string }[];
  myLinkedResponses: Record<string, "going" | "not-going">;
  deadline?: string;
  allowExternalGuests?: boolean;
  maxExternalGuests?: number;
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
  allowExternalGuests,
  maxExternalGuests,
  voteError,
  onVoteClick,
}: Props) => {
  const { t } = useTranslation("events");

  const votedCompanions = myLinkedMembers.filter(lm => myLinkedResponses[lm.id]);

  return (
    <div className="event-detail-page__vote-sticky">
      {hasVoted ? (
        <div className="event-detail-page__vote-summary">
          <div className="event-detail-page__vote-row">
            <span className="event-detail-page__vote-row-name">{t("vote.you")}</span>
            <AttendanceIndicator attendance={myResponse ?? "pending"} />
          </div>
          {votedCompanions.length > 0 && (
            <ul className="event-detail-page__vote-companions-names">
              {votedCompanions.map(lm => (
                <li key={lm.id}>{lm.firstName}</li>
              ))}
            </ul>
          )}
          {eventStatus === "activo" && (
            <Button
              variant="primary"
              text={votedCompanions.length > 0 ? t("vote.modifyPlural") : t("vote.modify")}
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
              {allowExternalGuests && (
                <p className="event-detail-page__vote-external">
                  <Icon name="users" size={20} aria-hidden="true" />
                  {maxExternalGuests
                    ? t("vote.externalAllowedMax", { count: maxExternalGuests })
                    : t("vote.externalAllowed")}
                </p>
              )}
              <Button
                variant="primary"
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
