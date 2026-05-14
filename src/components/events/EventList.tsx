import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import type { UserPermissions } from "../../models/user.model";
import EventCard from "./EventCard";
import "./events.scss";

interface EventListProps {
  events: FallesEvent[];
  permissions: UserPermissions;
  userId: string;
  attendances?: Record<string, "yes" | "no">;
}

const EventList = ({ events, permissions, userId, attendances }: EventListProps) => {
  const { t } = useTranslation("events");

  if (events.length === 0) {
    return <p className="events-list__empty">{t("events.empty")}</p>;
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
