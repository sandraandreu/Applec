import { memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../icons/icon/Icon";
import "./attendance-indicator.scss";

export type AttendanceStatus = "going" | "not-going" | "pending";

interface AttendanceIndicatorProps {
  attendance: AttendanceStatus;
  showPendingLabel?: boolean;
}

const AttendanceIndicator = ({ attendance }: AttendanceIndicatorProps) => {
  const { t } = useTranslation("events");

  const ariaLabel = attendance === "going"
    ? t("card.going")
    : attendance === "not-going"
      ? t("card.notGoing")
      : t("card.pending");

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`attendance-indicator attendance-indicator--${attendance}`}
    >
      {attendance === "going" && (
        <>
          <Icon name="check" aria-hidden size={16} />
          {t("attendance.going")}
        </>
      )}
      {attendance === "not-going" && (
        <>
          <Icon name="x-mark" aria-hidden size={16} />
          {t("attendance.notGoing")}
        </>
      )}
      {attendance === "pending" && t("attendance.pending")}
    </span>
  );
};

export default memo(AttendanceIndicator);
