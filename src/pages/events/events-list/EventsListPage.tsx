import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import useRole from "../../../hooks/useRole";
import { getEvents } from "../../../services/event.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import EventList from "../../../components/events/EventList";
import EventsFilter from "../../../components/events/EventsFilter";
import type { FilterKey, FilterOption } from "../../../components/events/EventsFilter";
import Loading from "../../../components/loading/Loading";
import "./events-list.scss";

const EventsListPage = () => {
  const { user, profile } = useAuthContext();
  const { isAdmin, isOrganizer } = useRole();
  const { t } = useTranslation("events");

  const [events, setEvents] = useState<FallesEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    if (!profile?.groupId) return;
    getEvents(profile.groupId).then(data => {
      setIsLoading(false);
      if (data === null) { setHasError(true); return; }
      setEvents(data);
    });
  }, [profile?.groupId]);

  const role = isAdmin ? "admin" : isOrganizer ? "organizer" : "member";

  const filterOptions: FilterOption[] = useMemo(() => {
    const countEvents = (predicate: (event: FallesEvent) => boolean) => events.filter(predicate).length;

    if (role === "member") {
      return [
        { key: "all",      label: t("events.filters.all"),      count: events.length },
        { key: "upcoming", label: t("events.filters.upcoming"), count: countEvents(event => getEventStatus(event) !== "finalizado") },
        { key: "past",     label: t("events.filters.past"),     count: countEvents(event => getEventStatus(event) === "finalizado") },
      ];
    }
    return [
      { key: "all",             label: t("events.filters.all"),             count: events.length },
      { key: "active",          label: t("events.filters.active"),          count: countEvents(event => getEventStatus(event) === "activo") },
      { key: "deadline-closed", label: t("events.filters.deadline-closed"), count: countEvents(event => getEventStatus(event) === "plazo-cerrado") },
      { key: "finished",        label: t("events.filters.finished"),        count: countEvents(event => getEventStatus(event) === "finalizado") },
    ];
  }, [events, role, t]);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case "active":          return events.filter(event => getEventStatus(event) === "activo");
      case "deadline-closed": return events.filter(event => getEventStatus(event) === "plazo-cerrado");
      case "finished":        return events.filter(event => getEventStatus(event) === "finalizado");
      case "upcoming":        return events.filter(event => getEventStatus(event) !== "finalizado");
      case "past":            return events.filter(event => getEventStatus(event) === "finalizado");
      default:                return events;
    }
  }, [events, filter]);

  return (
    <div className="events-list-page">
      <div className="events-list-page__header">
        <h1 className="events-list-page__title">{t("events.title")}</h1>
        {!isLoading && !hasError && (
          <EventsFilter options={filterOptions} selected={filter} onChange={setFilter} />
        )}
      </div>

      {isLoading && <Loading />}

      {!isLoading && hasError && (
        <p className="events-list-page__error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/>
          </svg>
          {t("events.error")}
        </p>
      )}

      {!isLoading && !hasError && (
        <EventList events={filteredEvents} role={role} userId={user?.uid ?? ""} />
      )}
    </div>
  );
};

export default EventsListPage;
