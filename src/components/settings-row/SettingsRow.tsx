import "./settings-row.scss";
import { Link } from "react-router-dom";
import Icon from "../../ui-kit/icons/icon/Icon";
import type { IconName } from "../../ui-kit/icons/icon/Icon";

interface SettingsRowProps {
  label: string;
  iconName: IconName;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
}

const SettingsRow = ({ label, iconName, to, onClick, danger }: SettingsRowProps) => {
  const modifier = danger ? " settings-row--danger" : "";
  const content = (
    <>
      <Icon name={iconName} size={28} className="settings-row__icon" aria-hidden="true" />
      <span className="settings-row__label">{label}</span>
      <Icon name="chevron-right" size={20} className="settings-row__chevron" aria-hidden="true" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`settings-row${modifier}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={`settings-row${modifier}`} onClick={onClick}>
      {content}
    </button>
  );
};

export default SettingsRow;
