import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import { getEventStatus } from "../../models/event.model";
import Badge from "../../ui-kit/badge/Badge";
import AttendanceIndicator from "../../ui-kit/attendance-indicator/AttendanceIndicator";
import Icon from "../../ui-kit/icons/icon/Icon";
import "./events.scss";
import { getIntlLocale } from "../../utils/dates";

type AttendanceResponse = "going" | "not-going" | null;

interface EventCardProps {
  event: FallesEvent;
  attendanceResponse?: AttendanceResponse;
}

const EventCard = ({ event, attendanceResponse = null }: EventCardProps) => {
  const { t, i18n } = useTranslation("events");
  const navigate = useNavigate();

  const status = getEventStatus(event);
  const isFinished = status === "finalizado";

  const showIndicator = event.requiresConfirmation;
  const isNotGoing = showIndicator && attendanceResponse === "not-going";
  const isGoing = showIndicator && attendanceResponse === "going";
  const isPending = showIndicator && attendanceResponse === null;

  const day = event.date.getDate();
  const month = event.date.toLocaleDateString(
    getIntlLocale(i18n.language),
    { month: "short" },
  );

  const cardClass = [
    "event-card",
    event.isSpecial ? "event-card--special" : "",
    isFinished ? "event-card--finished" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      <Link to={`/events/${event.id}`} className="event-card__content">
        <div className="event-card__date">
          <span className="event-card__day">{day}</span>
          <span className="event-card__month">{month}</span>
        </div>
        <div className="event-card__info">
          <span className="event-card__name">
            {event.name}
          </span>
          <span className="event-card__meta">
            {event.startTime} · {event.location}
          </span>
        </div>
      </Link>

      <div className="event-card__action">
        {isFinished && (
          <Badge variant="finalizado" label={t("status.finalizado")} />
        )}
        {!isFinished && isGoing && <AttendanceIndicator attendance="going" />}
        {!isFinished && isNotGoing && <AttendanceIndicator attendance="not-going" />}
        {!isFinished && isPending && (
          <button
            type="button"
            className="event-card__confirm-chip"
            aria-label={t("card.pending")}
            onClick={(clickEvent) => {
              clickEvent.preventDefault();
              navigate(`/events/${event.id}`, { state: { openVoteSheet: true } });
            }}
          >
            <Icon name="clock" aria-hidden size={16} />
            {t("card.confirm")}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(EventCard);
