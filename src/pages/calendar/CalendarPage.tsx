import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import { getEvents } from "../../services/event.service";
import type { FallesEvent } from "../../models/event.model";
import useLayoutBackground from "../../hooks/useLayoutBackground";
import { toLocalDateKey } from "../../utils/dates";
import Loading from "../../components/loading/Loading";
import Icon from "../../ui-kit/icons/icon/Icon";
import ViewTabs from "./view-tabs/ViewTabs";
import MonthView from "./month-view/MonthView";
import "./calendar.scss";

export type CalendarView = "month" | "week" | "day";

const CalendarPage = () => {
  const { user, profile } = useAuthContext();
  const { t } = useTranslation("events");

  const [activeView, setActiveView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<FallesEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useLayoutBackground(profile?.role);

  useEffect(() => {
    if (!profile?.groupId || !user) return;

    let isMounted = true;
    setHasError(false);

    const groupId = profile.groupId;

    (async () => {
      const data = await getEvents(groupId);
      if (!isMounted) return;
      if (data === null) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      setEvents(data);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [profile?.groupId, user]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, FallesEvent[]> = {};
    for (const event of events) {
      const key = toLocalDateKey(event.date);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    }
    return map;
  }, [events]);

  const canCreateEvent = profile?.role === "admin" || profile?.role === "organizer";

  return (
    <div className="calendar-page">
      {isLoading && <Loading />}

      {!isLoading && hasError && (
        <p className="calendar-page__error">
          <Icon name="error-circle" size={24} />
          {t("calendar.error")}
        </p>
      )}

      {!isLoading && !hasError && (
        <div className="calendar-page__content">
          <div className="calendar-page__header">
            <h1 className="calendar-page__title">{t("calendar.title")}</h1>
          </div>
          <ViewTabs activeView={activeView} onChange={setActiveView} />
          {activeView === "month" && (
            <MonthView
              eventsByDate={eventsByDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              canCreateEvent={canCreateEvent}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
