import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../../models/event.model";
import { formatDayLabel, getIntlLocale, toLocalDateKey } from "../../../utils/dates";
import EventCard from "../../../components/events/EventCard";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./weekly-view.scss";

interface WeeklyViewProps {
  eventsByDate: Record<string, FallesEvent[]>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  canCreateEvent: boolean;
}

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDays = (weekStart: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

const WeeklyView = ({ eventsByDate, selectedDate, onDateSelect, canCreateEvent }: WeeklyViewProps) => {
  const { t, i18n } = useTranslation("events");
  const locale = useMemo(() => getIntlLocale(i18n.language), [i18n.language]);
  const navigate = useNavigate();

  const todayKey = toLocalDateKey(new Date());
  const selectedDateKey = toLocalDateKey(selectedDate);

  const weekStart = useMemo(() => getWeekStart(selectedDate), [selectedDate]);
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekEnd = weekDays[6];

  const handlePrev = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    onDateSelect(prev);
  };

  const handleNext = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    onDateSelect(next);
  };

  const weekRangeLabel = useMemo(() => {
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();
    const sameMonth = sameYear && weekStart.getMonth() === weekEnd.getMonth();

    if (sameMonth) {
      const month = weekStart.toLocaleDateString(locale, { month: "short" });
      return `${startDay}-${endDay} ${month} ${weekStart.getFullYear()}`;
    }
    if (sameYear) {
      const startMonth = weekStart.toLocaleDateString(locale, { month: "short" });
      const endMonth = weekEnd.toLocaleDateString(locale, { month: "short" });
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${weekStart.getFullYear()}`;
    }
    const startMonth = weekStart.toLocaleDateString(locale, { month: "short" });
    const endMonth = weekEnd.toLocaleDateString(locale, { month: "short" });
    return `${startDay} ${startMonth} ${weekStart.getFullYear()} - ${endDay} ${endMonth} ${weekEnd.getFullYear()}`;
  }, [weekStart, weekEnd, locale]);

  const daysWithEvents = useMemo(
    () => weekDays.filter(day => !!eventsByDate[toLocalDateKey(day)]),
    [weekDays, eventsByDate]
  );
  const hasAnyEvents = daysWithEvents.length > 0;

  return (
    <div className="weekly-view">
      <div className="weekly-view__card">
        <div className="weekly-view__nav">
          <button
            className="calendar-page__nav-btn"
            onClick={handlePrev}
            aria-label={t("calendar.nav.prevWeek")}
          >
            <Icon name="chevron-left" size={18} aria-hidden />
          </button>
          <span className="weekly-view__range">{weekRangeLabel}</span>
          <button
            className="calendar-page__nav-btn"
            onClick={handleNext}
            aria-label={t("calendar.nav.nextWeek")}
          >
            <Icon name="chevron-right" size={18} aria-hidden />
          </button>
        </div>

        <div className="weekly-view__strip">
          {weekDays.map(day => {
            const key = toLocalDateKey(day);
            const hasEvents = !!eventsByDate[key];
            const isToday = key === todayKey;
            const isSelected = key === selectedDateKey && !isToday;
            const isSunday = day.getDay() === 0;
            const isSundayNotToday = isSunday && !isToday;

            const narrowWeekday = day
              .toLocaleDateString(locale, { weekday: "narrow" })
              .toUpperCase();

            return (
              <button
                key={key}
                type="button"
                className="weekly-view__strip-day"
                onClick={() => onDateSelect(day)}
                aria-label={day.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
              >
                <span
                  className={`weekly-view__strip-letter${isSundayNotToday ? " weekly-view__strip-letter--sunday" : ""}`}
                >
                  {narrowWeekday}
                </span>
                <span
                  className={[
                    "weekly-view__strip-number",
                    isToday ? "weekly-view__strip-number--today" :
                    isSelected ? "weekly-view__strip-number--selected" :
                    isSundayNotToday ? "weekly-view__strip-number--sunday" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {day.getDate()}
                </span>
                <span
                  className={`weekly-view__strip-dot${hasEvents ? " weekly-view__strip-dot--visible" : ""}`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      {hasAnyEvents ? (
        <div className="weekly-view__agenda">
          {daysWithEvents.map(day => {
            const key = toLocalDateKey(day);
            const dayEvents: FallesEvent[] = eventsByDate[key] ?? [];

            return (
              <div key={key} className="weekly-view__section">
                <p className="weekly-view__section-title">{formatDayLabel(day, locale)}</p>
                <div className="weekly-view__section-events">
                  {dayEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="weekly-view__empty">
          <EmptyState
            expand
            title={t("calendar.empty.week")}
            cta={canCreateEvent ? { text: t("calendar.create"), onClick: () => navigate("/create-events") } : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default WeeklyView;
