import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import { getEventStatus } from "../../models/event.model";
import type { UserPermissions } from "../../models/user.model";
import Icon from "../../ui-kit/icons/icon/Icon";
import Badge from "../../ui-kit/badge/Badge";
import "./events.scss";

type AttendanceResponse = "yes" | "no" | null;

interface EventCardProps {
  event: FallesEvent;
  permissions: UserPermissions;
  userId: string;
  attendanceResponse?: AttendanceResponse;
}

const EventCard = ({ event, permissions, userId, attendanceResponse = null }: EventCardProps) => {
  const { t, i18n } = useTranslation("events");

  const status = getEventStatus(event);
  const isFinished = status === "finalizado";

  const isEditable = permissions.canEditAllEvents || (permissions.canEditOwnEvents && event.createdBy === userId);
  const showIndicator = !permissions.canCreateEvents && event.requiresConfirmation;
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

      <div className="event-card__action">
        {isFinished && (
          <Badge variant="finalizado" label={t("status.finalizado")} />
        )}
        {!isFinished && isEditable && (
          <Link
            to={`/events/${event.id}/edit`}
            className="event-card__edit"
            aria-label={t("card.edit")}
          >
            <Icon name="edit" size={24} />
          </Link>
        )}
        {!isFinished && isGoing && (
          <span role="img" aria-label={t("card.going")} className="event-card__indicator event-card__indicator--going">
            <Icon name="check" aria-hidden={true} size={14} />
          </span>
        )}
        {!isFinished && isNotGoing && (
          <span role="img" aria-label={t("card.notGoing")} className="event-card__indicator event-card__indicator--not-going">
            <Icon name="x-mark" aria-hidden={true} size={14} />
          </span>
        )}
        {!isFinished && isPending && (
          <span role="img" aria-label={t("card.pending")} className="event-card__indicator event-card__indicator--pending">
            <Icon name="clock" size={28} aria-hidden={true} />
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(EventCard);
