import { memo } from "react";
import "./event-status-badge.scss";

type EventStatusVariant = "plazo-cerrado" | "finalizado";

interface EventStatusBadgeProps {
  variant: EventStatusVariant;
  label: string;
}

const EventStatusBadge = ({ variant, label }: EventStatusBadgeProps) => (
  <span className={`event-status-badge event-status-badge--${variant}`}>{label}</span>
);

export default memo(EventStatusBadge);
