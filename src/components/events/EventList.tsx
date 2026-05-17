import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import type { UserPermissions } from "../../models/user.model";
import EventCard from "./EventCard";
import Button from "../../ui-kit/button/Button";
import "./events.scss";

interface EventListProps {
  events: FallesEvent[];
  permissions: UserPermissions;
  userId: string;
  attendances?: Record<string, "yes" | "no">;
  hasAnyEvents: boolean;
}

const EventList = ({ events, permissions, userId, attendances, hasAnyEvents }: EventListProps) => {
  const { t } = useTranslation("events");
  const navigate = useNavigate();

  if (events.length === 0) {
    if (!hasAnyEvents) {
      return (
        <div className="events-list__empty">
          <p>{t("events.empty")}</p>
          {permissions.canCreateEvents && (
            <Button
              variant="primary"
              text={t("events.emptyGroupCta")}
              onClick={() => navigate("/events/create")}
            />
          )}
        </div>
      );
    }
    return <p className="events-list__empty">{t("events.emptyFilter")}</p>;
  }

  return (
    <ul className="events-list">
      {events.map(event => (
        <li key={event.id}>
          <EventCard
            event={event}
            permissions={permissions}
            userId={userId}
            attendanceResponse={attendances?.[event.id] ?? null}
          />
        </li>
      ))}
    </ul>
  );
};

export default EventList;
