import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "../../../icons/icon-button/IconButton";
import "./back-button.scss";

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

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
