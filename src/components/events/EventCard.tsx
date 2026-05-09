import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import { getEventStatus } from "../../models/event.model";
import Icon from "../../ui-kit/icons/icon/Icon";
import "./events.scss";

type AttendanceResponse = "yes" | "no" | null;

interface EventCardProps {
  event: FallesEvent;
  role: "admin" | "organizer" | "member";
  userId: string;
  attendanceResponse?: AttendanceResponse;
}

const EventCard = ({ event, role, userId, attendanceResponse = null }: EventCardProps) => {
  const { t, i18n } = useTranslation("events");

  const status = getEventStatus(event);
  const isFinished = status === "finalizado";

  const isEditable = role === "admin" || (role === "organizer" && event.createdBy === userId);
  const showIndicator = role === "member" && event.requiresConfirmation;
  const isNotGoing = showIndicator && attendanceResponse === "no";
  const isGoing = showIndicator && attendanceResponse === "yes";
  const isPending = showIndicator && attendanceResponse === null;

  const day = event.date.getDate();
  const month = event.date.toLocaleDateString(
    i18n.language === "ca" ? "ca-ES" : "es-ES",
    { month: "short" },
  );

  const cardClass = [
    "event-card",
    event.isSpecial ? "event-card--special" : "",
    isNotGoing ? "event-card--not-going" : "",
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

      {!isFinished && <div className="event-card__action">
        {isEditable && (
          <Link
            to={`/events/${event.id}/edit`}
            className="event-card__edit"
            aria-label={t("card.edit")}
          >
            <Icon name="edit" size={24} />
          </Link>
        )}

        {isGoing && (
          <div className="event-card__indicator event-card__indicator--going" aria-label={t("card.going")}>
            <Icon name="check" size={10} />
          </div>
        )}

        {isPending && (
          <div className="event-card__indicator event-card__indicator--pending" aria-label={t("card.pending")} />
        )}
      </div>}
    </div>
  );
};

export default memo(EventCard);
