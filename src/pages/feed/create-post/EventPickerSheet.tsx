import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import Search from "../../../ui-kit/search/Search";
import Icon from "../../../ui-kit/icons/icon/Icon";
import type { FeedLinkedEvent } from "../feed.mock";

const noopSearch = () => { return; };

const MOCK_EVENTS: FeedLinkedEvent[] = [
  { name: "Sopar de Germandat", day: "14", month: "JUN", location: "Local social de la falla", time: "21:00" },
  { name: "Processó del Corpus", day: "19", month: "JUN", location: "Carrer Major, València", time: "18:30" },
  { name: "Excursió a Morella", day: "5", month: "JUL", location: "Estació del Nord, València", time: "09:00" },
];

interface EventPickerSheetProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSelect: (event: FeedLinkedEvent) => void;
  selectedEventName?: string;
}

const EventPickerSheet = ({ isOpen, onDismiss, onSelect, selectedEventName }: EventPickerSheetProps) => {
  const { t } = useTranslation("feed");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.transition = "";
      }
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
    onSwiping: ({ deltaY }) => {
      if (!sheetRef.current || deltaY <= 0) return;
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    },
    onSwipedDown: ({ deltaY, velocity }) => {
      if (!sheetRef.current) return;
      if (velocity > 0.5 || deltaY > 100) {
        onDismiss();
      } else {
        sheetRef.current.style.transition = "transform 0.22s ease";
        sheetRef.current.style.transform = "translateY(0)";
      }
    },
    onSwiped: ({ dir }) => {
      if (dir !== "Down" && sheetRef.current) {
        sheetRef.current.style.transition = "transform 0.22s ease";
        sheetRef.current.style.transform = "translateY(0)";
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return createPortal(
    <dialog
      ref={dialogRef}
      className="event-picker-sheet"
      onClose={onDismiss}
      aria-labelledby="event-picker-title"
    >
      <div
        className="event-picker-sheet__panel"
        ref={(node) => {
          swipeRef(node);
          sheetRef.current = node;
        }}
        {...swipeHandlers}
      >
        <div className="event-picker-sheet__handle" aria-hidden="true" />
        <div className="event-picker-sheet__scroll">
          <div className="event-picker-sheet__header">
            <h2 id="event-picker-title" className="event-picker-sheet__title">
              {t("createPost.eventSheet.title")}
            </h2>
            <p className="event-picker-sheet__desc">
              {t("createPost.eventSheet.description")}
            </p>
          </div>

          <Search
            placeholder={t("createPost.eventSheet.searchPlaceholder")}
            onChange={noopSearch}
          />

          <ul className="event-picker-sheet__list">
            {MOCK_EVENTS.map((event) => {
              const isSelected = event.name === selectedEventName;
              return (
                <li key={event.name}>
                  <button
                    type="button"
                    className={`event-picker-sheet__event${isSelected ? " event-picker-sheet__event--selected" : ""}`}
                    onClick={() => onSelect(event)}
                    aria-pressed={isSelected}
                  >
                    <div className="event-picker-sheet__event-date-block">
                      <span className="event-picker-sheet__event-day">{event.day}</span>
                      <span className="event-picker-sheet__event-month">{event.month}</span>
                    </div>
                    <div className="event-picker-sheet__event-info">
                      <span className="event-picker-sheet__event-name">{event.name}</span>
                      <span className="event-picker-sheet__event-meta">{event.location} · {event.time}</span>
                    </div>
                    <div
                      className={`event-picker-sheet__radio${isSelected ? " event-picker-sheet__radio--selected" : ""}`}
                      aria-hidden="true"
                    >
                      {isSelected && <Icon name="check-bold" size={14} />}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default EventPickerSheet;
