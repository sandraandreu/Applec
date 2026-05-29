import "./pill-selector.scss";
import { memo } from "react";

interface PillOption {
  value: string;
  label: string;
  description?: string;
}

interface PillSelectorProps {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
}

const PillSelector = ({ options, value, onChange, "aria-label": ariaLabel }: PillSelectorProps) => {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="pill-selector" role="group" aria-label={ariaLabel}>
      <div className="pill-selector__options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`pill-selector__btn${value === option.value ? " pill-selector__btn--active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected?.description && (
        <p className="pill-selector__desc">{selected.description}</p>
      )}
    </div>
  );
};

export default memo(PillSelector);
