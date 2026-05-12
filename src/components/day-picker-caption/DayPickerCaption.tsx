import "react-day-picker/style.css";
import "./day-picker-caption.scss";
import { useDayPicker } from "react-day-picker";
import type { MonthCaptionProps } from "react-day-picker";
import { es, ca } from "react-day-picker/locale";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import Icon from "../../ui-kit/icons/icon/Icon";

const DayPickerCaption = ({ calendarMonth }: MonthCaptionProps) => {
  const { previousMonth, nextMonth, goToMonth } = useDayPicker();
  const { i18n, t } = useTranslation("common");
  const dateLocale = i18n.language === "ca" ? ca : es;
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

export default DayPickerCaption;
