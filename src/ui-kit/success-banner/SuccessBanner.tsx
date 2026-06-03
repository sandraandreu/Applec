import { useEffect, useState } from "react";
import Icon from "../icons/icon/Icon";
import "./success-banner.scss";

interface SuccessBannerProps {
  message: string;
  onDismiss: () => void;
}

const SuccessBanner = ({ message, onDismiss }: SuccessBannerProps) => {
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDismissing(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isDismissing) return;
    const timer = setTimeout(onDismiss, 250);
    return () => clearTimeout(timer);
  }, [isDismissing, onDismiss]);

  return (
    <div className={`success-banner${isDismissing ? " success-banner--dismissing" : ""}`} role="status">
      <Icon name="check-bold" size={20} />
      {message}
    </div>
  );
};

export default SuccessBanner;
