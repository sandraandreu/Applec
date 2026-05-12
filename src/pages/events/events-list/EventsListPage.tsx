import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { getEvents } from "../../../services/event.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import EventList from "../../../components/events/EventList";
import EventsFilter from "../../../components/events/EventsFilter";
import type { FilterKey, FilterOption } from "../../../components/events/EventsFilter";
import Loading from "../../../components/loading/Loading";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./events-list.scss";

const EventsListPage = () => {
  const { user, profile } = useAuthContext();
  const { t } = useTranslation("events");

  const [events, setEvents] = useState<FallesEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    if (!profile?.groupId) return;

    let isMounted = true;
    setHasError(false);

    getEvents(profile.groupId).then(data => {
      if (!isMounted) return;
      setIsLoading(false);
      if (data === null) { setHasError(true); return; }
      setEvents(data);
    });

    return () => { isMounted = false; };
  }, [profile?.groupId]);

  const filterOptions: FilterOption[] = useMemo(() => {
    const countEvents = (predicate: (event: FallesEvent) => boolean) => events.filter(predicate).length;

    if (!user?.permissions.canSeeDetailedFilters) {
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
  }, [events, user?.permissions.canSeeDetailedFilters, t]);

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
          <Icon name="error-circle" size={24} />
          {t("events.error")}
        </p>
      )}

      {!isLoading && !hasError && user && (
        <EventList events={filteredEvents} permissions={user.permissions} userId={user.uid} />
      )}
    </div>
  );
};

export default EventsListPage;
