import "./create-event.scss";
import { forwardRef, useImperativeHandle, useState } from "react";
import { format } from "date-fns";
import { combineDateAndTime, getDateFnsLocale } from "../../../utils/dates";
import { useTranslation } from "react-i18next";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Toggle from "../../../ui-kit/toggle/Toggle";
import type { CreateEventStep1Data } from "./CreateEventStep1Page";
import type { StepHandle } from "./CreateEventStep1Page";
import type { CreateEventStep2Data } from "./CreateEventStep2Page";
import EventCalendar from "../../../components/event-calendar/EventCalendar";

export interface CreateEventStep3Data {
  requiresConfirmation: boolean;
  sendReminder: boolean;
  confirmationDeadline?: Date;
  allowExternalGuests: boolean;
  maxExternalGuests?: number;
}

export interface CreateEventStep3Draft {
  requiresConfirmation: boolean;
  sendReminder: boolean;
  deadlineOpen: boolean;
  deadlineDate?: Date;
  deadlineTime: string;
  allowExternalGuests: boolean;
  maxExternalGuests?: number;
}

interface Props {
  step1Data: CreateEventStep1Data;
  step2Data: CreateEventStep2Data;
  onComplete: (data: CreateEventStep3Data) => void;
  onBack: (draft: CreateEventStep3Draft) => void;
  initialData?: CreateEventStep3Draft;
  isLoading?: boolean;
  errorKey?: string;
}

const CreateEventStep3Page = forwardRef<StepHandle, Props>(({
  step1Data,
  step2Data,
  onComplete,
  onBack,
  initialData,
  isLoading,
  errorKey,
}, ref) => {
  const { t, i18n } = useTranslation(["events", "common"]);
  const dateLocale = getDateFnsLocale(i18n.language);

  const [requiresConfirmation, setRequiresConfirmation] = useState(initialData?.requiresConfirmation ?? true);
  const [sendReminder, setSendReminder] = useState(initialData?.sendReminder ?? true);
  const [allowExternalGuests, setAllowExternalGuests] = useState(initialData?.allowExternalGuests ?? false);
  const [maxExternalGuests, setMaxExternalGuests] = useState<number | undefined>(initialData?.maxExternalGuests);
  const [deadlineOpen, setDeadlineOpen] = useState(initialData?.deadlineOpen ?? false);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(initialData?.deadlineDate);
  const [deadlineTime, setDeadlineTime] = useState(initialData?.deadlineTime ?? "23:59");
  const [deadlineMonth, setDeadlineMonth] = useState(initialData?.deadlineDate ?? new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineMax = new Date(step2Data.date);
  deadlineMax.setDate(deadlineMax.getDate() - 1);
  deadlineMax.setHours(23, 59, 59, 999);

  const rawDate = format(step2Data.date, "EEEE d MMMM", { locale: dateLocale });
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  const timeDisplay = step2Data.endTime
    ? `${step2Data.startTime} - ${step2Data.endTime}`
    : step2Data.startTime;

  const buildAndSubmit = () => {
    let confirmationDeadline: Date | undefined;
    if (deadlineDate) {
      confirmationDeadline = deadlineTime
        ? combineDateAndTime(deadlineDate, deadlineTime)
        : new Date(deadlineDate);
    }
    onComplete({ requiresConfirmation, sendReminder, confirmationDeadline, allowExternalGuests, maxExternalGuests });
  };

  const handleBack = () => {
    onBack({ requiresConfirmation, sendReminder, deadlineOpen, deadlineDate, deadlineTime, allowExternalGuests, maxExternalGuests });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    buildAndSubmit();
  };

  useImperativeHandle(ref, () => ({
    submit: () => buildAndSubmit(),
    back: () => handleBack(),
  }));

  return (
    <div className={`create-events-step3${step1Data.eventType === "special" ? " create-events-step3--special" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="create-events-step3__scroll-area">
          <div className="create-events-step3__gradient-zone">
            <div className="create-events-step3__topbar">
              <BackButton onClick={handleBack} />
              <Stepper currentStep={3} totalSteps={3} />
              <span className="create-events-step3__topbar-spacer" aria-hidden="true" />
            </div>
            <div className="create-events-step3__header">
              <h1 className="create-events-step3__title">{t("create.step3Title")}</h1>
              <p className="create-events-step3__description">{t("create.step3Description")}</p>
            </div>
          </div>
          <div className="create-events-step3__content">

        <div className="create-events-step3__summary">
          <p className="create-events-step3__summary-name">{step1Data.eventName}</p>
          <span className={`create-events-step3__type-chip create-events-step3__type-chip--${step1Data.eventType}`}>
            {t(`create.type.${step1Data.eventType}`)}
          </span>
          <div className="create-events-step3__field">
            <div className="create-events-step3__field-icon">
              <Icon name="calendar" size={28} />
            </div>
            <div className="create-events-step3__field-content">
              <span className="create-events-step3__field-value">{formattedDate} · {timeDisplay}</span>
              <span className="create-events-step3__field-label">{t("detail.dateTime")}</span>
            </div>
          </div>
          <div className="create-events-step3__field">
            <div className="create-events-step3__field-icon">
              <Icon name="location" size={28} />
            </div>
            <div className="create-events-step3__field-content">
              <span className="create-events-step3__field-value">{step2Data.location}</span>
              <span className="create-events-step3__field-label">{t("detail.location")}</span>
            </div>
          </div>
        </div>

        <div className="create-events-step3__settings">

          <div className="create-events-step3__form-section">
          <p className="create-events-step3__section-label">{t("create.sectionConfirmation")}</p>
          <div className="event-form__settings-group">
            <div className="event-form__setting-row">
              <div className="event-form__setting-text">
                <span className="event-form__setting-label">{t("create.requiresConfirmation")}</span>
                <span className="event-form__setting-hint">{t("create.requiresConfirmationHint")}</span>
              </div>
              <Toggle
                checked={requiresConfirmation}
                onChange={setRequiresConfirmation}
                aria-label={t("create.requiresConfirmation")}
              />
            </div>

            {requiresConfirmation && (
              <div className="event-form__deadline">
                <button
                  type="button"
                  className="event-form__setting-row event-form__setting-row--button"
                  onClick={() => setDeadlineOpen(!deadlineOpen)}
                  aria-expanded={deadlineOpen}
                >
                  <span className="event-form__setting-label">{t("create.deadline")}</span>
                  <Icon
                    name="chevron-right"
                    size={20}
                    className={`event-form__chevron${deadlineOpen ? " event-form__chevron--open" : ""}`}
                  />
                </button>

                {deadlineOpen && (
                  <div className="event-form__deadline-panel">
                    <div className="event-form__calendar-card">
                      <EventCalendar
                        selected={deadlineDate}
                        month={deadlineMonth}
                        onMonthChange={setDeadlineMonth}
                        onSelect={(date) => {
                          setDeadlineDate(date);
                          if (date) setDeadlineMonth(date);
                        }}
                        disabled={[{ before: today }, { after: deadlineMax }]}
                      />
                    </div>
                    <div className="event-form__time-box">
                      <Icon name="clock" size={24} className="event-form__time-icon" />
                      <input
                        id="deadline-time"
                        type="time"
                        className="event-form__time-input"
                        aria-label={t("create.deadlineTime")}
                        value={deadlineTime}
                        onChange={(event) => setDeadlineTime(event.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>

          <div className="create-events-step3__form-section">
          <p className="create-events-step3__section-label">{t("create.sectionGuests")}</p>
          <div className="event-form__settings-group">
            <div className="event-form__setting-row">
              <div className="event-form__setting-text">
                <span className="event-form__setting-label">{t("create.allowExternalGuests")}</span>
                <span className="event-form__setting-hint">{t("create.allowExternalGuestsHint")}</span>
              </div>
              <Toggle
                checked={allowExternalGuests}
                onChange={(value) => {
                  setAllowExternalGuests(value);
                  if (!value) setMaxExternalGuests(undefined);
                }}
                aria-label={t("create.allowExternalGuests")}
              />
            </div>

            {allowExternalGuests && (
              <div className="event-form__setting-row">
                <div className="event-form__setting-text">
                  <span className="event-form__setting-label">{t("create.maxExternalGuests")}</span>
                  <span className="event-form__setting-hint">{t("create.maxExternalGuestsHint")}</span>
                </div>
                <input
                  type="number"
                  className="create-events-step3__number-input"
                  min={1}
                  max={99}
                  value={maxExternalGuests ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setMaxExternalGuests(value === "" ? undefined : Number(value));
                  }}
                  aria-label={t("create.maxExternalGuests")}
                />
              </div>
            )}
          </div>
          </div>

          <div className="create-events-step3__form-section">
          <p className="create-events-step3__section-label">{t("create.sectionReminder")}</p>
          <div className="event-form__settings-group">
            <div className="event-form__setting-row">
              <div className="event-form__setting-text">
                <span className="event-form__setting-label">{t("create.sendReminder")}</span>
                <span className="event-form__setting-hint">{t("create.sendReminderHint")}</span>
              </div>
              <Toggle
                checked={sendReminder}
                onChange={setSendReminder}
                aria-label={t("create.sendReminder")}
              />
            </div>
          </div>
          </div>

        </div>

          </div>
        </div>
        <div className="create-events-step3__actions">
          {errorKey && (
            <span className="create-events-step3__error">{i18n.t(errorKey)}</span>
          )}
          <Button
            type="submit"
            text={t("create.submit")}
            variant="primary"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
});

CreateEventStep3Page.displayName = "CreateEventStep3Page";

export default CreateEventStep3Page;
