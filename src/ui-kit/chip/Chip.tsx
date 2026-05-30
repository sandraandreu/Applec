import { memo } from "react";
import { useTranslation } from "react-i18next";
import "./chip.scss";

type ChipRole = "admin" | "organizer" | "member";
type ChipVariant = "short" | "full";

interface ChipProps {
  role: ChipRole;
  variant?: ChipVariant;
}

const Chip = ({ role, variant = "short" }: ChipProps) => {
  const { t } = useTranslation("members");

  if (role === "member" && variant === "short") return null;

  const label =
    variant === "short"
      ? t(`members.chips.${role}`)
      : t(`members.roles.${role}`);

  return (
    <span className={`chip chip--${role}`}>{label}</span>
  );
};

export default memo(Chip);
