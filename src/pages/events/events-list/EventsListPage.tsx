import { useEffect, useMemo, useState } from "react";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { listenEvents } from "../../../services/event.service";
import { getMyAttendances } from "../../../services/attendance.service";
import { clearJoinAcceptedFlag } from "../../../services/user.service";
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
    !!(location.state as { eventUpdated?: boolean; eventCreated?: boolean } | null)?.eventUpdated
  );
  const [showEventCreated, setShowEventCreated] = useState(
    !!(location.state as { eventCreated?: boolean } | null)?.eventCreated
  );
  const [showJoinAccepted, setShowJoinAccepted] = useState(
    profile?.joinAccepted === true
  );

  useLayoutBackground(profile?.role);

  useEffect(() => {
    if (showEventUpdated || showEventCreated) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [showEventUpdated, showEventCreated, navigate, location.pathname]);

  useEffect(() => {
    if (showJoinAccepted && user?.uid) {
      clearJoinAcceptedFlag(user.uid);
    }
  }, [showJoinAccepted, user?.uid]);

  useEffect(() => {
    if (!profile?.groupId || !user) return;

    let isMounted = true;
    setHasError(false);

    const groupId = profile.groupId;
    const uid = user.uid;

    const unsubscribe = listenEvents(groupId, async (eventsData) => {
      if (!isMounted) return;
      if (eventsData === null) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      setEvents(eventsData);

      if (eventsData.length > 0) {
        const eventIds = eventsData.map(event => event.id);
        const attendancesData = await getMyAttendances(groupId, uid, eventIds);
        if (!isMounted) return;
        setAttendances(attendancesData ?? {});
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [profile?.groupId, user]);

  const upcomingEvents = useMemo(
    () => events.filter(event => getEventStatus(event) !== "finalizado"),
    [events]
  );

  return (
    <div className="events-list-page">
      {showJoinAccepted && (
        <SuccessBanner
          message={t("joinAccepted.message")}
          onDismiss={() => setShowJoinAccepted(false)}
        />
      )}
      {showEventCreated && (
        <SuccessBanner message={t("create.success")} onDismiss={() => setShowEventCreated(false)} />
      )}
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
