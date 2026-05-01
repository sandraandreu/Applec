import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import { getEventStatus } from "../../models/event.model";
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
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 10.5005V19.1255C18 19.3717 17.9515 19.6155 17.8573 19.843C17.763 20.0705 17.6249 20.2772 17.4508 20.4513C17.2767 20.6254 17.07 20.7635 16.8425 20.8578C16.615 20.952 16.3712 21.0005 16.125 21.0005H4.875C4.37772 21.0005 3.90081 20.8029 3.54917 20.4513C3.19754 20.0997 3 19.6228 3 19.1255V7.87549C3 7.37821 3.19754 6.90129 3.54917 6.54966C3.90081 6.19803 4.37772 6.00049 4.875 6.00049H12.7256" stroke="#0068FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.5597 2.4966C21.4913 2.42133 21.4082 2.36074 21.3156 2.31848C21.2231 2.27622 21.1229 2.25316 21.0211 2.25071C20.9194 2.24825 20.8182 2.26645 20.7237 2.3042C20.6292 2.34195 20.5434 2.39847 20.4713 2.47035L19.8915 3.04738C19.8212 3.1177 19.7817 3.21304 19.7817 3.31246C19.7817 3.41187 19.8212 3.50721 19.8915 3.57753L20.423 4.10816C20.4579 4.14317 20.4993 4.17094 20.5449 4.1899C20.5905 4.20885 20.6394 4.21861 20.6888 4.21861C20.7382 4.21861 20.7871 4.20885 20.8327 4.1899C20.8783 4.17094 20.9197 4.14317 20.9546 4.10816L21.5199 3.54566C21.8058 3.26019 21.8326 2.79519 21.5597 2.4966ZM18.7191 4.21925L10.2572 12.6661C10.2059 12.7172 10.1686 12.7807 10.149 12.8503L9.75756 14.0161C9.74818 14.0478 9.74752 14.0813 9.75564 14.1133C9.76375 14.1453 9.78035 14.1745 9.80368 14.1978C9.82701 14.2211 9.85621 14.2377 9.88818 14.2459C9.92016 14.254 9.95374 14.2533 9.98537 14.2439L11.1502 13.8525C11.2199 13.8328 11.2833 13.7956 11.3344 13.7443L19.7813 5.28144C19.8595 5.20246 19.9033 5.09583 19.9033 4.98472C19.9033 4.87361 19.8595 4.76699 19.7813 4.688L19.3149 4.21925C19.2358 4.14039 19.1287 4.09611 19.017 4.09611C18.9053 4.09611 18.7982 4.14039 18.7191 4.21925Z" fill="#0068FF"/>
            </svg>
          </Link>
        )}

        {isGoing && (
          <div className="event-card__indicator event-card__indicator--going" aria-label={t("card.going")}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {isPending && (
          <div className="event-card__indicator event-card__indicator--pending" aria-label={t("card.pending")} />
        )}
      </div>}
    </div>
  );
};

export default EventCard;
