import "./Button.scss";
import Loading from "../../feedback/loading/Loading";

interface ButtonProps {
  text: string;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "secondary" | "danger" | "language";
  isActive?:boolean;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button = ({
  text,
  type = "submit",
  variant = "primary",
  isActive,
  onClick,
  disabled = false,
  isLoading = false,
}: ButtonProps) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`button ${variant} ${isActive ? "active" : ""}`}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
