import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import EventCard from "./EventCard";
import "./events.scss";

interface EventListProps {
  events: FallesEvent[];
  role: "admin" | "organizer" | "member";
  userId: string;
}

const EventList = ({ events, role, userId }: EventListProps) => {
  const { t } = useTranslation("events");

  if (events.length === 0) {
    return <p className="events-list__empty">{t("events.empty")}</p>;
  }

  return (
    <ul className="events-list">
      {events.map(event => (
        <li key={event.id}>
          <EventCard event={event} role={role} userId={userId} />
        </li>
      ))}
    </ul>
  );
};

export default EventList;
