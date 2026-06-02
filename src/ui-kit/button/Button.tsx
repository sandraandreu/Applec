import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./button.scss";

interface ButtonProps {
  text: string;
  to?: string;
  state?: unknown;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "secondary" | "language" | "danger" | "going-no-active" | "going-yes" | "going-yes-active" | "pending";
  icon?: ReactNode;
  iconRight?: ReactNode;
  isActiveLanguage?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const Button = ({
  text,
  to,
  state,
  type = "button",
  variant = "primary",
  icon,
  iconRight,
  isActiveLanguage,
  onClick,
  disabled = false,
  isLoading = false,
  className = "",
}: ButtonProps) => {
  const classes = [`button`, `button--${variant}`, isActiveLanguage ? "button--language--active" : "", className]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} state={state} className={classes}>
        {icon}
        {text}
        {iconRight}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
    >
      {icon}
      {text}
      {iconRight}
    </button>
  );
};

export default Button;
