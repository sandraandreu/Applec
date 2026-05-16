import "./badge.scss";

type BadgeVariant = "activo" | "plazo-cerrado" | "finalizado";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const Badge = ({ variant, label }: BadgeProps) => (
  <span className={`badge badge--${variant}`}>{label}</span>
);

export default Badge;
