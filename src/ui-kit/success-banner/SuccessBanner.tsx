import { useEffect } from "react";
import Icon from "../icons/icon/Icon";
import "./success-banner.scss";

interface SuccessBannerProps {
  message: string;
  onDismiss: () => void;
}

const SuccessBanner = ({ message, onDismiss }: SuccessBannerProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="success-banner" role="status">
      <Icon name="check-bold" size={18} />
      {message}
    </div>
  );
};

export default SuccessBanner;
