import { useState, useRef, useEffect } from "react";
import Icon from "../../ui-kit/icons/icon/Icon";
import "./events.scss";

export type FilterKey = string;

export interface FilterOption {
  key: FilterKey;
  label: string;
  count: number;
}

interface EventsFilterProps {
  options: FilterOption[];
  selected: FilterKey;
  onChange: (key: FilterKey) => void;
}

const EventsFilter = ({ options, selected, onChange }: EventsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.key === selected);

  const handleSelect = (key: FilterKey) => {
    onChange(key);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  return (
    <div className="events-filter" ref={containerRef}>
      <button
        type="button"
        className="events-filter__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <span className="events-filter__label">
          {selectedOption?.label}
        </span>
        <span className="events-filter__count">
          {selectedOption?.count}
        </span>
        <Icon
          name="chevron-down"
          size={18}
          className={`events-filter__chevron${isOpen ? " events-filter__chevron--open" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="events-filter__dropdown">
          {options.map(option => (
            <li key={option.key}>
              <button
                type="button"
                className={`events-filter__option-btn${option.key === selected ? " events-filter__option-btn--selected" : ""}`}
                onClick={() => handleSelect(option.key)}
              >
                <span className="events-filter__label">{option.label}</span>
                <span className="events-filter__count">{option.count}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsFilter;
