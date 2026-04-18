import { useTranslation } from "react-i18next";
import "./chip.scss";

type ChipRole = "admin" | "organizer" | "member";
type ChipVariant = "short" | "full";

interface ChipProps {
  role: ChipRole;
  variant?: ChipVariant;
}

const SHORT_LABELS: Record<ChipRole, string | null> = {
  admin: "Admin",
  organizer: "Org.",
  member: null,
};

const Chip = ({ role, variant = "short" }: ChipProps) => {
  const { t } = useTranslation("members");

  if (role === "member") return null;

  const label =
    variant === "short"
      ? SHORT_LABELS[role]
      : t(`members.roles.${role}`);

  return (
    <span className={`chip chip--${role}`}>{label}</span>
  );
};

export default Chip;
