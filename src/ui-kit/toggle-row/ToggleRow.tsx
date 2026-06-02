import Toggle from "../toggle/Toggle";
import "./toggle-row.scss";

interface ToggleRowProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow = ({ label, hint, checked, onChange }: ToggleRowProps) => (
  <div className="toggle-row">
    <div className="toggle-row__text">
      <span className="toggle-row__label">{label}</span>
      {hint && <span className="toggle-row__hint">{hint}</span>}
    </div>
    <Toggle
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
  </div>
);

export default ToggleRow;
