import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../models/event.model";
import type { UserPermissions } from "../../models/user.model";
import EventCard from "./EventCard";
import EmptyState from "../../ui-kit/empty-state/EmptyState";
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
        <EmptyState
          title={t("events.empty")}
          subtitle={permissions.canCreateEvents ? t("events.emptySubtitleAdmin") : t("events.emptySubtitleMember")}
          cta={permissions.canCreateEvents ? { text: t("events.emptyGroupCta"), onClick: () => navigate("/events/create") } : undefined}
          expand
        />
      );
    }
    return <EmptyState title={t("events.emptyFilter")} variant="light" expand />;
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

export default React.memo(EventList);
