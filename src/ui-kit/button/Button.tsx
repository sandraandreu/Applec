import { ReactNode } from "react";
import "./button.scss";

interface ButtonProps {
  text: string;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "secondary" | "language";
  icon?: ReactNode;
  isActiveLanguage?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button = ({
  text,
  type = "button",
  variant = "primary",
  icon,
  isActiveLanguage,
  onClick,
  disabled = false,
  isLoading = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`button button--${variant} ${isActiveLanguage ? "button--language--active" : ""}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
