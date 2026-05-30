import Button from "../button/Button";
import "./empty-state.scss";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  cta?: {
    text: string;
    onClick: () => void;
  };
  variant?: "default" | "light";
  expand?: boolean;
}

const EmptyState = ({ title, subtitle, cta, variant = "default", expand = false }: EmptyStateProps) => {
  const classes = [
    "empty-state",
    variant === "light" ? "empty-state--light" : "",
    expand ? "empty-state--expand" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="empty-state__text">
        <p className="empty-state__title">{title}</p>
        {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      </div>
      {cta && (
        <Button
          variant="primary"
          className="button--compact"
          text={cta.text}
          onClick={cta.onClick}
        />
      )}
    </div>
  );
};

export default EmptyState;
