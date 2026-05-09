import { useTranslation } from "react-i18next";
import IconButton from "../../../icons/icon-button/IconButton";

interface EyeToggleIconProps {
  showPassword: boolean;
  onToggle: () => void;
}

const EyeToggleIcon = ({ showPassword, onToggle }: EyeToggleIconProps) => {
  const { t } = useTranslation("common");

  return (
    <IconButton
      name={showPassword ? "eye-on" : "eye-off"}
      ariaLabel={showPassword ? t("buttons.hidePassword") : t("buttons.showPassword")}
      ariaPressed={showPassword}
      onClick={onToggle}
    />
  );
};

export default EyeToggleIcon;
