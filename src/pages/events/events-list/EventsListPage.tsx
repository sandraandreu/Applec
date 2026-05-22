import { useEffect, useMemo, useState } from "react";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { getEvents } from "../../../services/event.service";
import { getMyAttendances } from "../../../services/attendance.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import EventList from "../../../components/events/EventList";
import EventsFilter from "../../../components/events/EventsFilter";
import type { FilterKey, FilterOption } from "../../../components/events/EventsFilter";
import Loading from "../../../components/loading/Loading";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Icon from "../../../ui-kit/icons/icon/Icon";
import { useLocation } from "react-router-dom";
import "./events-list.scss";

const EventsListPage = () => {
  const { user, profile } = useAuthContext();
  const { t } = useTranslation("events");
  const location = useLocation();

  const [events, setEvents] = useState<FallesEvent[]>([]);
  const [attendances, setAttendances] = useState<Record<string, "yes" | "no">>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("active");
  const [showEventUpdated, setShowEventUpdated] = useState(
    !!(location.state as { eventUpdated?: boolean } | null)?.eventUpdated
  );

  useLayoutBackground(profile?.role);

  useEffect(() => {
    if (showEventUpdated) {
      window.history.replaceState({}, "");
    }
  }, []);

  useEffect(() => {
    if (!profile?.groupId || !user) return;

    let isMounted = true;
    setHasError(false);

    const groupId = profile.groupId;

    (async () => {
      const eventsData = await getEvents(groupId);
      if (!isMounted) return;
      if (eventsData === null) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      setEvents(eventsData);

      if (eventsData.length > 0) {
        const eventIds = eventsData.map(e => e.id);
        const attendancesData = await getMyAttendances(groupId, user.uid, eventIds);
        if (!isMounted) return;
        setAttendances(attendancesData ?? {});
      }

      setIsLoading(false);
    })();

    return () => { isMounted = false; };
  }, [profile?.groupId, user]);

  const filterOptions: FilterOption[] = useMemo(() => {
    const countEvents = (predicate: (event: FallesEvent) => boolean) => events.filter(predicate).length;
    return [
      { key: "active",          label: t("events.filters.active"),          count: countEvents(event => getEventStatus(event) === "activo") },
      { key: "deadline-closed", label: t("events.filters.deadline-closed"), count: countEvents(event => getEventStatus(event) === "plazo-cerrado") },
      { key: "finished",        label: t("events.filters.finished"),        count: countEvents(event => getEventStatus(event) === "finalizado") },
      { key: "all",             label: t("events.filters.all"),             count: events.length },
    ];
  }, [events, t]);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case "active":          return events.filter(event => getEventStatus(event) === "activo");
      case "deadline-closed": return events.filter(event => getEventStatus(event) === "plazo-cerrado");
      case "finished":        return events.filter(event => getEventStatus(event) === "finalizado");
      default:                return events;
    }
  }, [events, filter]);

  return (
    <div className="events-list-page">
      {showEventUpdated && (
        <SuccessBanner message={t("edit.success")} onDismiss={() => setShowEventUpdated(false)} />
      )}
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
        <EventList events={filteredEvents} permissions={user.permissions} attendances={attendances} hasAnyEvents={events.length > 0} />
      )}
    </div>
  );
};

export default EventsListPage;
