import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import { getEventStatus } from "../../models/event.model";
import EventStatusBadge from "../../ui-kit/event-status-badge/EventStatusBadge";
import AttendanceIndicator from "../../ui-kit/attendance-indicator/AttendanceIndicator";
import Button from "../../ui-kit/button/Button";
import "./events.scss";
import { getIntlLocale } from "../../utils/dates";

type AttendanceResponse = "going" | "not-going" | null;

interface EventCardProps {
  event: FallesEvent;
  attendanceResponse?: AttendanceResponse;
}

const EventCard = ({ event, attendanceResponse = null }: EventCardProps) => {
  const { t, i18n } = useTranslation("events");

  const status = getEventStatus(event);
  const isFinished = status === "finalizado";
  const isDeadlineClosed = status === "plazo-cerrado";

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
      <Link to={`/events/${event.id}`} className="event-card__link" aria-label={event.name} />
      <div className="event-card__date">
        <span className="event-card__day">{day}</span>
        <span className="event-card__month">{month}</span>
      </div>
      <div className="event-card__info">
        <span className="event-card__name">{event.name}</span>
        <div className="event-card__bottom">
          <span className="event-card__meta">
            {event.startTime} · {event.location}
          </span>
          <div className="event-card__action">
            {isFinished && (
              <EventStatusBadge variant="finalizado" label={t("status.finalizado")} />
            )}
            {!isFinished && isGoing && <AttendanceIndicator attendance="going" />}
            {!isFinished && isNotGoing && <AttendanceIndicator attendance="not-going" />}
            {!isFinished && isPending && isDeadlineClosed && (
              <EventStatusBadge variant="plazo-cerrado" label={t("status.plazo-cerrado")} />
            )}
            {!isFinished && isPending && !isDeadlineClosed && (
              <Button
                variant="pending"
                className="button--compact"
                text={t("card.confirm")}
                to={`/events/${event.id}`}
                state={{ openVoteSheet: true }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
