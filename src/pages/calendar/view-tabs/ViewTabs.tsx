import { useTranslation } from "react-i18next";
import type { CalendarView } from "../CalendarPage";
import "./view-tabs.scss";

interface ViewTabsProps {
  activeView: CalendarView;
  onChange: (view: CalendarView) => void;
}

const VIEWS: { key: CalendarView; labelKey: string }[] = [
  { key: "month", labelKey: "calendar.tabs.month" },
  { key: "week",  labelKey: "calendar.tabs.week" },
  { key: "day",   labelKey: "calendar.tabs.day" },
];

const ViewTabs = ({ activeView, onChange }: ViewTabsProps) => {
  const { t } = useTranslation("events");

  return (
    <div className="view-tabs" role="tablist">
      {VIEWS.map(({ key, labelKey }) => (
        <button
          key={key}
          role="tab"
          aria-selected={activeView === key}
          className={`view-tabs__tab${activeView === key ? " view-tabs__tab--active" : ""}`}
          onClick={() => onChange(key)}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
