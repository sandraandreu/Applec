import "./toggle.scss";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label": string;
}

const Toggle = ({ checked, onChange, disabled, "aria-label": ariaLabel }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    disabled={disabled}
    className={`toggle${checked ? " toggle--on" : ""}${disabled ? " toggle--disabled" : ""}`}
    onClick={() => onChange(!checked)}
  >
    <span className="toggle__indicator" />
  </button>
);

export default Toggle;
