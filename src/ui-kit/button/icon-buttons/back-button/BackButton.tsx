import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "../../../icons/icon-button/IconButton";
import Icon from "../../../icons/icon/Icon";
import "./back-button.scss";

interface BackButtonProps {
  onClick?: () => void;
  to?: string;
  state?: unknown;
}

const BackButton = ({ onClick, to, state }: BackButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  if (to) {
    return (
      <Link to={to} state={state} aria-label={t("buttons.back")} className="icon-button back-button">
        <Icon name="arrow-left" size={32} />
      </Link>
    );
  }

  return (
    <IconButton
      name="arrow-left"
      ariaLabel={t("buttons.back")}
      onClick={onClick ?? (() => navigate(-1))}
      size={32}
      className="back-button"
    />
  );
};

export default BackButton;
