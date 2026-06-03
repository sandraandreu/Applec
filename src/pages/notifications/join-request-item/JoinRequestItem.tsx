import { memo, useState } from "react";
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
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

const JoinRequestItem = ({ iconName, iconBg, title, message, onAccept, onReject }: JoinRequestItemProps) => {
  const { t } = useTranslation("common");
  const { t: tNotif } = useTranslation("notifications");

  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = isAccepting || isRejecting;

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);
    try {
      await onAccept();
    } catch {
      setError(tNotif("requestsPage.acceptError"));
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    setError(null);
    try {
      await onReject();
    } catch {
      setError(tNotif("requestsPage.rejectError"));
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="join-request-item">
      <div className={`join-request-item__icon join-request-item__icon--${iconBg}`}>
        <Icon name={iconName} size={28} aria-hidden="true" />
      </div>
      <div className="join-request-item__info">
        <span className="join-request-item__title">{title}</span>
        <p className="join-request-item__message">{message}</p>
        {error && (
          <p className="join-request-item__error">
            <Icon name="error-circle" size={18} aria-hidden="true" />
            {error}
          </p>
        )}
        <div className="join-request-item__actions">
          <Button
            text={t("buttons.reject")}
            variant="secondary"
            className="button--compact"
            onClick={handleReject}
            isLoading={isRejecting}
            disabled={isLoading}
          />
          <Button
            text={t("buttons.accept")}
            variant="primary"
            className="button--compact"
            onClick={handleAccept}
            isLoading={isAccepting}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(JoinRequestItem);
