import { useEffect, useMemo, useState } from "react";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { getEvents } from "../../../services/event.service";
import { getMyAttendances } from "../../../services/attendance.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import EventList from "../../../components/events/EventList";
import Loading from "../../../components/loading/Loading";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Icon from "../../../ui-kit/icons/icon/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import "./events-list.scss";

const EventsListPage = () => {
  const { user, profile } = useAuthContext();
  const { t } = useTranslation("events");
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState<FallesEvent[]>([]);
  const [attendances, setAttendances] = useState<Record<string, "going" | "not-going">>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEventUpdated, setShowEventUpdated] = useState(
    !!(location.state as { eventUpdated?: boolean } | null)?.eventUpdated
  );

  useLayoutBackground(profile?.role);

  useEffect(() => {
    if (showEventUpdated) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [showEventUpdated, navigate, location.pathname]);

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
        const eventIds = eventsData.map(event => event.id);
        const attendancesData = await getMyAttendances(groupId, user.uid, eventIds);
        if (!isMounted) return;
        setAttendances(attendancesData ?? {});
      }

      setIsLoading(false);
    })();

    return () => { isMounted = false; };
  }, [profile?.groupId, user]);

  const upcomingEvents = useMemo(
    () => events.filter(event => getEventStatus(event) !== "finalizado"),
    [events]
  );

  return (
    <div className="events-list-page">
      {showEventUpdated && (
        <SuccessBanner message={t("edit.success")} onDismiss={() => setShowEventUpdated(false)} />
      )}
      <div className="events-list-page__header">
        <h1 className="events-list-page__title">{t("events.title")}</h1>
      </div>

      {isLoading && <Loading />}

      {!isLoading && hasError && (
        <p className="events-list-page__error">
          <Icon name="error-circle" size={24} />
          {t("events.error")}
        </p>
      )}

      {!isLoading && !hasError && user && (
        <EventList events={upcomingEvents} permissions={user.permissions} attendances={attendances} hasAnyEvents={events.length > 0} />
      )}
    </div>
  );
};

export default EventsListPage;
