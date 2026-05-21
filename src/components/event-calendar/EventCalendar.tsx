import "react-day-picker/style.css";
import "./event-calendar.scss";
import { DayPicker, useDayPicker } from "react-day-picker";
import type { MonthCaptionProps, Matcher } from "react-day-picker";
import { format } from "date-fns";
import { getDateFnsLocale } from "../../utils/dates";
import { useTranslation } from "react-i18next";
import Icon from "../../ui-kit/icons/icon/Icon";

const Caption = ({ calendarMonth }: MonthCaptionProps) => {
  const { previousMonth, nextMonth, goToMonth } = useDayPicker();
  const { i18n, t } = useTranslation("common");
  const dateLocale = getDateFnsLocale(i18n.language);
  const label = format(calendarMonth.date, "LLLL y", { locale: dateLocale });
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="rdp-month_caption">
      <button
        type="button"
        className="rdp-button_previous"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        aria-label={t("calendar.previousMonth")}
      >
        <Icon name="chevron-left-circle" size={24} aria-hidden />
      </button>
      <span className="rdp-caption_label">{capitalized}</span>
      <button
        type="button"
        className="rdp-button_next"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        aria-label={t("calendar.nextMonth")}
      >
        <Icon name="chevron-right-circle" size={24} aria-hidden />
      </button>
    </div>
  );
};

interface Props {
  selected: Date | undefined;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
}

const EventCalendar = ({ selected, month, onMonthChange, onSelect, disabled }: Props) => {
  const { i18n } = useTranslation();
  const locale = getDateFnsLocale(i18n.language);

  return (
    <DayPicker
      mode="single"
      locale={locale}
      selected={selected}
      month={month}
      onMonthChange={onMonthChange}
      onSelect={onSelect}
      disabled={disabled}
      showOutsideDays
      hideNavigation
      modifiers={{ sunday: (date: Date) => date.getDay() === 0 }}
      modifiersClassNames={{ sunday: "rdp-day--sunday" }}
      components={{ MonthCaption: Caption }}
    />
  );
};

export default EventCalendar;
