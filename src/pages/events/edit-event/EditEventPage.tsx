import "./edit-event.scss";
import { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { getEventById, updateEvent } from "../../../services/event.service";
import { getErrorKey } from "../../../utils/firebase-errors";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Toggle from "../../../ui-kit/toggle/Toggle";
import Icon from "../../../ui-kit/icons/icon/Icon";
import EventCalendar from "../../../components/event-calendar/EventCalendar";
import { editEventReducer, initialState } from "./edit-event.reducer";

interface FormFields {
  eventName: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("events");
  const { t: tc } = useTranslation("common");
  const { profile } = useAuthContext();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [state, dispatch] = useReducer(editEventReducer, initialState);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormFields>();
  const eventNameLength = watch("eventName")?.length ?? 0;
  const descriptionLength = watch("description")?.length ?? 0;
  const locationLength = watch("location")?.length ?? 0;

  useEffect(() => {
    if (!profile?.groupId || !id) {
      navigate("/events", { replace: true });
      return;
    }
    let isMounted = true;
    getEventById(profile.groupId, id).then((data) => {
      if (!isMounted) return;
      if (!data) {
        navigate("/events", { replace: true });
        return;
      }
      dispatch({ type: "SET_EVENT_DATA", payload: data });
      reset({
        eventName: data.name,
        description: data.description ?? "",
        startTime: data.startTime,
        endTime: data.endTime ?? "",
        location: data.location,
      });
    });
    return () => {
      isMounted = false;
    };
  }, [profile?.groupId, id, navigate, reset]);

  const onSubmit = async (fields: FormFields) => {
    if (!state.selectedDate) {
      dispatch({ type: "SET_DATE_ERROR" });
      return;
    }
    if (!profile?.groupId || !state.event?.id) return;

    let confirmationDeadline: Date | undefined;
    if (state.deadlineDate) {
      const combined = new Date(state.deadlineDate);
      const [hours, minutes] = state.deadlineTime.split(":").map(Number);
      combined.setHours(hours, minutes, 0, 0);
      confirmationDeadline = combined;
    }

    dispatch({ type: "SET_SUBMITTING" });
    try {
      await updateEvent(profile.groupId, state.event.id, {
        name: fields.eventName,
        location: fields.location,
        date: state.selectedDate,
        startTime: fields.startTime,
        isSpecial: state.eventType === "special",
        requiresConfirmation: state.requiresConfirmation,
        sendReminder: state.sendReminder,
        ...(fields.description && { description: fields.description }),
        ...(fields.endTime && { endTime: fields.endTime }),
        ...(confirmationDeadline && { confirmationDeadline }),
      });
      navigate(`/events/${state.event.id}`);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: getErrorKey(error) });
    }
  };

  if (state.isLoading) return <Loading />;
  if (!state.event) return null;

  const eventId = state.event.id;

  return (
    <div
      className={`edit-event${state.eventType === "special" ? " edit-event--special" : ""}`}
    >
      <div className="edit-event__gradient-zone">
        <BackButton />

        <h1 className="edit-event__title">{t("edit.title")}</h1>

        <div className="edit-event__types">
          <button
            type="button"
            className={`edit-event__type-btn${state.eventType === "special" ? " edit-event__type-btn--active" : ""}`}
            onClick={() => dispatch({ type: "SET_EVENT_TYPE", payload: "special" })}
          >
            {t("create.type.special")}
          </button>
          <button
            type="button"
            className={`edit-event__type-btn${state.eventType === "normal" ? " edit-event__type-btn--active" : ""}`}
            onClick={() => dispatch({ type: "SET_EVENT_TYPE", payload: "normal" })}
          >
            {t("create.type.normal")}
          </button>
        </div>
      </div>

      <form
        className="edit-event__content"
        onSubmit={handleSubmit(onSubmit, () => {
          if (!state.selectedDate) dispatch({ type: "SET_DATE_ERROR" });
        })}
      >
        <div className="edit-event__section">
          <p className="edit-event__section-title">{t("create.infoSection")}</p>
          <div className="edit-event__form">
            <Input
              id="event-name"
              label={t("create.name")}
              placeholder={t("create.namePlaceholder")}
              required
              maxLength={50}
              currentLength={eventNameLength}
              registration={register("eventName", { required: true, maxLength: 50 })}
              error={errors.eventName ? t("validation.nameRequired") : undefined}
            />
            <Input
              id="event-description"
              label={t("create.descriptionLabel")}
              placeholder={t("create.descriptionPlaceholder")}
              optional
              multiline
              maxLength={300}
              currentLength={descriptionLength}
              registration={register("description", { maxLength: 300 })}
            />
          </div>
        </div>

        <div className="edit-event__section">
          <p className="edit-event__section-title">{t("create.step2Title")}</p>
          <div className="edit-event__form">
            <div className="field">
              <label className="field__label">
                {t("create.date")}
              </label>
              <div
                className={`edit-event__calendar-card${state.dateError ? " edit-event__calendar-card--error" : ""}`}
              >
                <EventCalendar
                  selected={state.selectedDate}
                  month={state.currentMonth}
                  onMonthChange={(month) => dispatch({ type: "SET_CURRENT_MONTH", payload: month })}
                  onSelect={(date) => dispatch({ type: "SET_DATE", payload: date })}
                />
              </div>
              {state.dateError && (
                <span className="field__error">{t("validation.dateRequired")}</span>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="start-time">
                {t("create.startTime")}
              </label>
              <div className="edit-event__time-box">
                <Icon name="clock" size={24} className="edit-event__time-icon" />
                <input
                  id="start-time"
                  type="time"
                  className="edit-event__time-input"
                  {...register("startTime", { required: true })}
                />
              </div>
              {errors.startTime && (
                <span className="field__error">{t("validation.timeRequired")}</span>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="end-time">
                {t("create.endTime")}<span className="field__optional"> ({tc("fields.optional")})</span>
              </label>
              <div className="edit-event__time-box">
                <Icon name="clock" size={24} className="edit-event__time-icon" />
                <input
                  id="end-time"
                  type="time"
                  className="edit-event__time-input"
                  {...register("endTime")}
                />
              </div>
            </div>

            <Input
              id="location"
              label={t("create.location")}
              placeholder={t("create.locationPlaceholder")}
              required
              maxLength={100}
              currentLength={locationLength}
              registration={register("location", { required: true, maxLength: 100 })}
              error={errors.location ? t("validation.locationRequired") : undefined}
            />
          </div>
        </div>

        <div className="edit-event__settings">
          <div className="edit-event__setting-row">
            <div className="edit-event__setting-text">
              <span className="edit-event__setting-label">
                {t("create.requiresConfirmation")}
              </span>
              <span className="edit-event__setting-hint">
                {t("create.requiresConfirmationHint")}
              </span>
            </div>
            <Toggle
              checked={state.requiresConfirmation}
              onChange={(value) => dispatch({ type: "SET_CONFIRMATION", payload: value })}
              aria-label={t("create.requiresConfirmation")}
            />
          </div>

          <div className="edit-event__setting-row">
            <div className="edit-event__setting-text">
              <span className="edit-event__setting-label">
                {t("create.sendReminder")}
              </span>
              <span className="edit-event__setting-hint">
                {t("create.sendReminderHint")}
              </span>
            </div>
            <Toggle
              checked={state.sendReminder}
              onChange={(value) => dispatch({ type: "SET_REMINDER", payload: value })}
              aria-label={t("create.sendReminder")}
            />
          </div>

          <div className="edit-event__deadline">
            <button
              type="button"
              className="edit-event__setting-row edit-event__setting-row--button"
              onClick={() => dispatch({ type: "TOGGLE_DEADLINE" })}
              aria-expanded={state.deadlineOpen}
            >
              <span className="edit-event__setting-label">
                {t("create.deadline")}
              </span>
              <Icon
                name="chevron-right"
                size={20}
                className={`edit-event__chevron${state.deadlineOpen ? " edit-event__chevron--open" : ""}`}
              />
            </button>

            {state.deadlineOpen && (
              <div className="edit-event__deadline-panel">
                <div className="edit-event__calendar-card">
                  <EventCalendar
                    selected={state.deadlineDate}
                    month={state.deadlineMonth}
                    onMonthChange={(month) => dispatch({ type: "SET_DEADLINE_MONTH", payload: month })}
                    onSelect={(date) => dispatch({ type: "SET_DEADLINE_DATE", payload: date })}
                    disabled={{ before: today }}
                  />
                </div>
                <div className="edit-event__time-box">
                  <Icon name="clock" size={24} className="edit-event__time-icon" />
                  <input
                    type="time"
                    className="edit-event__time-input"
                    aria-label={t("create.deadlineTime")}
                    value={state.deadlineTime}
                    onChange={(e) => dispatch({ type: "SET_DEADLINE_TIME", payload: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {state.errorKey && (
          <span className="edit-event__error">{i18n.t(state.errorKey)}</span>
        )}

        <div className="edit-event__actions">
          <Button
            type="submit"
            text={t("edit.submit")}
            variant="especial"
            disabled={state.isSubmitting}
          />
          <Button
            type="button"
            text={t("edit.cancel")}
            variant="secondary"
            onClick={() => navigate(`/events/${eventId}`)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
