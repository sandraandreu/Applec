import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FallesEvent } from "../../../models/event.model";
import { formatDayLabel, getIntlLocale, toLocalDateKey } from "../../../utils/dates";
import EventCard from "../../../components/events/EventCard";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./daily-view.scss";

interface DailyViewProps {
  eventsByDate: Record<string, FallesEvent[]>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  canCreateEvent: boolean;
}

const DailyView = ({ eventsByDate, selectedDate, onDateSelect, canCreateEvent }: DailyViewProps) => {
  const { t, i18n } = useTranslation("events");
  const locale = useMemo(() => getIntlLocale(i18n.language), [i18n.language]);
  const navigate = useNavigate();

  const handlePrev = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onDateSelect(prev);
  };

  const handleNext = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onDateSelect(next);
  };

  const dayLabel = useMemo(() => formatDayLabel(selectedDate, locale), [selectedDate, locale]);
  const dayEvents: FallesEvent[] = eventsByDate[toLocalDateKey(selectedDate)] ?? [];

  return (
    <div className="daily-view">
      <div className="daily-view__card">
        <div className="daily-view__nav">
          <button
            className="calendar-page__nav-btn"
            onClick={handlePrev}
            aria-label={t("calendar.nav.prevDay")}
          >
            <Icon name="chevron-left" size={18} aria-hidden />
          </button>
          <span className="daily-view__title">{dayLabel}</span>
          <button
            className="calendar-page__nav-btn"
            onClick={handleNext}
            aria-label={t("calendar.nav.nextDay")}
          >
            <Icon name="chevron-right" size={18} aria-hidden />
          </button>
        </div>
      </div>

      {dayEvents.length === 0 ? (
        <div className="daily-view__empty">
          <EmptyState
            expand
            title={t("calendar.empty.day")}
            cta={canCreateEvent ? { text: t("calendar.create"), onClick: () => navigate("/create-events") } : undefined}
          />
        </div>
      ) : (
        <div className="daily-view__events">
          {dayEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyView;
