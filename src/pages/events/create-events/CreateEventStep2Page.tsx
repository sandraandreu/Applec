import "./create-event.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import Icon from "../../../ui-kit/icons/icon/Icon";
import EventCalendar from "../../../components/event-calendar/EventCalendar";

export interface CreateEventStep2Data {
  date: Date;
  startTime: string;
  endTime?: string;
  location: string;
}

export interface CreateEventStep2Draft {
  date?: Date;
  startTime: string;
  endTime: string;
  location: string;
}

interface FormFields {
  startTime: string;
  endTime: string;
  location: string;
}

interface Props {
  onComplete: (data: CreateEventStep2Data) => void;
  onBack: (draft: CreateEventStep2Draft) => void;
  initialData?: CreateEventStep2Draft;
  eventType: "normal" | "special";
}

const CreateEventStep2Page = ({ onComplete, onBack, initialData, eventType }: Props) => {
  const { t } = useTranslation("events");
  const { t: tc } = useTranslation("common");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData?.date);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialData?.date ?? new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dateError, setDateError] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      startTime: initialData?.startTime ?? "16:00",
      endTime: initialData?.endTime ?? "",
      location: initialData?.location ?? "",
    },
  });

  const handleBack = () => {
    const fields = getValues();
    onBack({
      date: selectedDate,
      startTime: fields.startTime,
      endTime: fields.endTime,
      location: fields.location,
    });
  };

  const onSubmit = (fields: FormFields) => {
    if (!selectedDate) {
      setDateError(true);
      return;
    }
    onComplete({
      date: selectedDate,
      startTime: fields.startTime,
      endTime: fields.endTime || undefined,
      location: fields.location,
    });
  };

  return (
    <div className={`create-events-step2${eventType === "special" ? " create-events-step2--special" : ""}`}>
      <div className="create-events-step2__gradient-zone">
        <div className="create-events-step2__topbar">
          <BackButton onClick={handleBack} />
          <Stepper currentStep={2} totalSteps={3} />
          <span className="create-events-step2__topbar-spacer" aria-hidden="true" />
        </div>

        <div className="create-events-step2__header">
          <h1 className="create-events-step2__title">{t("create.step2Title")}</h1>
          <p className="create-events-step2__description">{t("create.step2Description")}</p>
        </div>
      </div>

      <form className="create-events-step2__content" onSubmit={handleSubmit(onSubmit, () => { if (!selectedDate) setDateError(true); })}>

        <div className="create-events-step2__form">
          <div className="field">
            <label className="field__label">
              {t("create.date")}
            </label>
            <div className={`create-events-step2__calendar-card${dateError ? " create-events-step2__calendar-card--error" : ""}`}>
              <EventCalendar
                selected={selectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setDateError(false);
                    setCurrentMonth(date);
                  }
                }}
                disabled={{ before: today }}
              />
            </div>
            {dateError && <span className="field__error">{t("validation.dateRequired")}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="start-time">
              {t("create.startTime")}
            </label>
            <div className="create-events-step2__time-box">
              <Icon name="clock" size={24} className="create-events-step2__time-icon" />
              <input
                id="start-time"
                type="time"
                className="create-events-step2__time-input"
                {...register("startTime", { required: true })}
              />
            </div>
            {errors.startTime && <span className="field__error">{t("validation.timeRequired")}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="end-time">
              {t("create.endTime")}<span className="field__optional"> ({tc("fields.optional")})</span>
            </label>
            <div className="create-events-step2__time-box">
              <Icon name="clock" size={24} className="create-events-step2__time-icon" />
              <input
                id="end-time"
                type="time"
                className="create-events-step2__time-input"
                {...register("endTime")}
              />
            </div>
          </div>

          <Input
            id="location"
            label={t("create.location")}
            placeholder={t("create.locationPlaceholder")}
            required
            registration={register("location", { required: true })}
            error={errors.location ? t("validation.locationRequired") : undefined}
          />
        </div>

        <Button type="submit" text={t("create.continue")} variant="secondary" />
      </form>
    </div>
  );
};

export default CreateEventStep2Page;
