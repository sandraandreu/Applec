import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../../models/event.model";
import { getIntlLocale, toLocalDateKey } from "../../../utils/dates";
import EventCard from "../../../components/events/EventCard";
import Button from "../../../ui-kit/button/Button";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./month-view.scss";

interface MonthViewProps {
  eventsByDate: Record<string, FallesEvent[]>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  canCreateEvent: boolean;
}

const MonthView = ({ eventsByDate, selectedDate, onDateSelect, canCreateEvent }: MonthViewProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { t, i18n } = useTranslation("events");

  const [currentMonthDate, setCurrentMonthDate] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    const apiDate = api.getDate();
    if (
      selectedDate.getMonth() !== apiDate.getMonth() ||
      selectedDate.getFullYear() !== apiDate.getFullYear()
    ) {
      api.gotoDate(selectedDate);
      setCurrentMonthDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (info: { date: Date }) => {
    onDateSelect(info.date);
    if (
      info.date.getMonth() !== currentMonthDate.getMonth() ||
      info.date.getFullYear() !== currentMonthDate.getFullYear()
    ) {
      calendarRef.current?.getApi().gotoDate(info.date);
      setCurrentMonthDate(new Date(info.date.getFullYear(), info.date.getMonth(), 1));
    }
  };

  const locale = getIntlLocale(i18n.language);

  const monthTitle = (() => {
    const month = currentMonthDate.toLocaleDateString(locale, { month: "long" });
    const year = currentMonthDate.getFullYear();
    return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
  })();

  const selectedDateKey = toLocalDateKey(selectedDate);
  const eventsForSelectedDay = eventsByDate[selectedDateKey] ?? [];

  const selectedDayLabel = (() => {
    const weekday = selectedDate
      .toLocaleDateString(locale, { weekday: "short" })
      .replace(".", "")
      .toUpperCase();
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleDateString(locale, { month: "long" });
    return `${weekday} ${day} de ${month}`;
  })();

  return (
    <div className="month-view">
      <div className="month-view__card">
        <div className="month-view__nav">
          <button
            className="month-view__nav-btn"
            onClick={handlePrev}
            aria-label={t("calendar.nav.prevMonth")}
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <span className="month-view__month-title">{monthTitle}</span>
          <button
            className="month-view__nav-btn"
            onClick={handleNext}
            aria-label={t("calendar.nav.nextMonth")}
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          firstDay={1}
          locale={i18n.language}
          initialDate={selectedDate}
          height="auto"
          fixedWeekCount={false}
          dayHeaderFormat={{ weekday: "narrow" }}
          dayCellContent={(info) => {
            const key = toLocalDateKey(info.date);
            const hasEvents = !!eventsByDate[key];
            const isSunday = info.date.getDay() === 0;
            return (
              <div className="month-view__day-cell">
                <span className={`month-view__day-number${isSunday ? " month-view__day-number--sunday" : ""}`}>
                  {info.date.getDate()}
                </span>
                {hasEvents && <span className="month-view__day-dot" aria-hidden="true" />}
              </div>
            );
          }}
          dayCellClassNames={(info) =>
            toLocalDateKey(info.date) === selectedDateKey ? ["month-view__day--selected"] : []
          }
          dateClick={handleDateClick}
          events={[]}
        />
      </div>

      <div className="month-view__selected-day">
        <div className="month-view__day-header">
          <span className="month-view__day-title">{selectedDayLabel}</span>
          <Link to="/events" className="month-view__see-all">{t("calendar.nav.seeAll")}</Link>
        </div>

        {eventsForSelectedDay.length === 0 ? (
          <div className="month-view__empty">
            <p className="month-view__empty-text">{t("calendar.empty.day")}</p>
            {canCreateEvent && (
              <Button to="/events/create" text={t("calendar.create")} variant="primary" />
            )}
          </div>
        ) : (
          <div className="month-view__events">
            {eventsForSelectedDay.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthView;
