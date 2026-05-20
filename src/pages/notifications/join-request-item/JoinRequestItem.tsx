import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { NotificationIconBg } from "../notification-item/NotificationItem";
import type { IconName } from "../../../ui-kit/icons/icon/Icon";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Button from "../../../ui-kit/button/Button";
import "./join-request-item.scss";

interface JoinRequestItemProps {
  iconName: IconName;
  iconBg: NotificationIconBg;
  title: string;
  message: string;
}

const JoinRequestItem = ({ iconName, iconBg, title, message }: JoinRequestItemProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="join-request-item">
      <div className={`join-request-item__icon join-request-item__icon--${iconBg}`}>
        <Icon name={iconName} size={28} aria-hidden="true" />
      </div>
      <div className="join-request-item__info">
        <span className="join-request-item__title">{title}</span>
        <p className="join-request-item__message">{message}</p>
        <div className="join-request-item__actions">
          <Button text={t("buttons.reject")} variant="secondary" className="button--compact" />
          <Button text={t("buttons.accept")} variant="primary" className="button--compact" />
        </div>
      </div>
    </div>
  );
};

export default memo(JoinRequestItem);
