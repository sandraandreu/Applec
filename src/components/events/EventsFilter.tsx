import { useState } from "react";
import "./events.scss";

export type FilterKey = "all" | "active" | "deadline-closed" | "finished" | "upcoming" | "pending" | "past";

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

  const selectedOption = options.find(o => o.key === selected);

  const handleSelect = (key: FilterKey) => {
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div className="events-filter">
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
        <svg
          className={`events-filter__chevron${isOpen ? " events-filter__chevron--open" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3.9375 6.46558L9 11.5281L14.0625 6.46558" stroke="#0068FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
