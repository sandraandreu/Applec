import { memo } from "react";
import { useTranslation } from "react-i18next";
import "./attendance-donut.scss";

interface AttendanceDonutProps {
  goingCount: number;
  notGoingCount: number;
  pendingCount: number;
  total: number;
}

const AttendanceDonut = ({ goingCount, notGoingCount, pendingCount, total }: AttendanceDonutProps) => {
  const { t } = useTranslation("events");

  return (
    <div className="attendance-donut">
      <div className="attendance-donut__bar" role="img" aria-label={t("attendanceList.title")}>
        {goingCount > 0 && (
          <div
            className="attendance-donut__bar-segment attendance-donut__bar-segment--going"
            style={{ flex: goingCount }}
          />
        )}
        {notGoingCount > 0 && (
          <div
            className="attendance-donut__bar-segment attendance-donut__bar-segment--not-going"
            style={{ flex: notGoingCount }}
          />
        )}
        {pendingCount > 0 && (
          <div
            className="attendance-donut__bar-segment attendance-donut__bar-segment--pending"
            style={{ flex: pendingCount }}
          />
        )}
        {total === 0 && (
          <div className="attendance-donut__bar-segment attendance-donut__bar-segment--empty" style={{ flex: 1 }} />
        )}
      </div>
      <div className="attendance-donut__stats">
        <div className="attendance-donut__stat">
          <span className="attendance-donut__stat-dot attendance-donut__stat-dot--total" />
          <span className="attendance-donut__stat-count">{total}</span>
          <span className="attendance-donut__stat-label">{t("attendanceList.total")}</span>
        </div>
        <div className="attendance-donut__stat">
          <span className="attendance-donut__stat-dot attendance-donut__stat-dot--going" />
          <span className="attendance-donut__stat-count">{goingCount}</span>
          <span className="attendance-donut__stat-label">{t("attendanceList.going")}</span>
        </div>
        <div className="attendance-donut__stat">
          <span className="attendance-donut__stat-dot attendance-donut__stat-dot--not-going" />
          <span className="attendance-donut__stat-count">{notGoingCount}</span>
          <span className="attendance-donut__stat-label">{t("attendanceList.notGoing")}</span>
        </div>
        <div className="attendance-donut__stat">
          <span className="attendance-donut__stat-dot attendance-donut__stat-dot--pending" />
          <span className="attendance-donut__stat-count">{pendingCount}</span>
          <span className="attendance-donut__stat-label">{t("attendanceList.noResponse")}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(AttendanceDonut);
