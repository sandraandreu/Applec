import { memo } from "react";
import { Link } from "react-router-dom";
import type { IconName } from "../../../ui-kit/icons/icon/Icon";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./notification-item.scss";

export type NotificationIconBg = "blue" | "red" | "teal" | "purple" | "orange" | "brand";

interface NotificationItemProps {
  iconName: IconName;
  iconBg: NotificationIconBg;
  title: string;
  message: string;
  cta?: { label: string; to: string };
}

const NotificationItem = ({ iconName, iconBg, title, message, cta }: NotificationItemProps) => (
  <div className="notification-item">
    <div className={`notification-item__icon notification-item__icon--${iconBg}`}>
      <Icon name={iconName} size={28} aria-hidden="true" />
    </div>
    <div className="notification-item__info">
      <span className="notification-item__title">{title}</span>
      <p className="notification-item__message">{message}</p>
      {cta && (
        <Link to={cta.to} className="notification-item__cta">
          {cta.label}
        </Link>
      )}
    </div>
  </div>
);

export default memo(NotificationItem);
