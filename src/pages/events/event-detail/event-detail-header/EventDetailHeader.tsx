import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEventStatus } from "../../../../models/event.model";
import type { FallesEvent } from "../../../../models/event.model";
import BackButton from "../../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Icon from "../../../../ui-kit/icons/icon/Icon";
import EventStatusBadge from "../../../../ui-kit/event-status-badge/EventStatusBadge";

interface Props {
  event: FallesEvent;
  canEdit?: boolean;
  formattedDate: string;
  onDeleteRequest: () => void;
}

const EventDetailHeader = ({ event, canEdit, formattedDate, onDeleteRequest }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation("events");
  const [showMenu, setShowMenu] = useState(false);
  const eventStatus = getEventStatus(event);
  const isPast = eventStatus === "finalizado";

  return (
    <div className="event-detail-page__gradient-zone">
      <div className="event-detail-page__top-bar">
        <BackButton />
        {canEdit && (
          <div className="event-detail-page__menu-wrapper">
            <button
              className="event-detail-page__menu-trigger"
              aria-label={t("detail.menuOptions")}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <Icon name="menu-dots" size={32} />
            </button>
            {showMenu && (
              <>
                <button
                  className="event-detail-page__menu-overlay"
                  aria-label={t("common:buttons.close")}
                  onClick={() => setShowMenu(false)}
                />
                <ul className="event-detail-page__menu">
                  {!isPast && (
                    <li>
                      <button
                        type="button"
                        className="event-detail-page__menu-item"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                      >
                        {t("detail.edit")}
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      className="event-detail-page__menu-item"
                      onClick={() => {
                        setShowMenu(false);
                        onDeleteRequest();
                      }}
                    >
                      {t("detail.delete")}
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      <h1 className="event-detail-page__name">{event.name}</h1>

      {eventStatus !== "activo" && (
        <EventStatusBadge variant={eventStatus} label={t(`status.${eventStatus}`)} />
      )}

      <div className="event-detail-page__field">
        <div className="event-detail-page__field-icon">
          <Icon name="calendar" size={28} />
        </div>
        <div className="event-detail-page__field-content">
          <span className="event-detail-page__field-value">
            {formattedDate} · {event.startTime}
          </span>
          <span className="event-detail-page__field-label">
            {t("detail.dateTime")}
          </span>
        </div>
      </div>

      {event.location && (
        <div className="event-detail-page__field">
          <div className="event-detail-page__field-icon">
            <Icon name="location" size={28} />
          </div>
          <div className="event-detail-page__field-content">
            <span className="event-detail-page__field-value">
              {event.location}
            </span>
            <span className="event-detail-page__field-label">
              {t("detail.location")}
            </span>
          </div>
        </div>
      )}

      {!event.requiresConfirmation && (
        <div className="event-detail-page__field">
          <div className="event-detail-page__field-icon event-detail-page__field-icon--no-bg">
            <Icon name="info-circle" size={28} />
          </div>
          <div className="event-detail-page__field-content">
            <span className="event-detail-page__field-value">
              {t("detail.noConfirmationRequired")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailHeader;
