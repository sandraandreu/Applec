import "./create-event.scss";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import ToggleRow from "../../../ui-kit/toggle-row/ToggleRow";
import Icon from "../../../ui-kit/icons/icon/Icon";

export interface StepHandle {
  submit: () => void;
  back: () => void;
}

export interface CreateEventStep1Data {
  eventType: "normal" | "special";
  eventName: string;
  description: string;
}

interface FormFields {
  eventName: string;
  description: string;
}

interface Props {
  onComplete: (data: CreateEventStep1Data) => void;
  initialData?: CreateEventStep1Data;
}

const CreateEventStep1Page = forwardRef<StepHandle, Props>(({ onComplete, initialData }, ref) => {
  const { t } = useTranslation("events");
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<"normal" | "special">(initialData?.eventType ?? "normal");
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      eventName: initialData?.eventName ?? "",
      description: initialData?.description ?? "",
    },
  });

  const eventNameLength = watch("eventName")?.length ?? 0;
  const descriptionLength = watch("description")?.length ?? 0;

  const onSubmit = (fields: FormFields) => {
    onComplete({
      eventType,
      eventName: fields.eventName,
      description: fields.description,
    });
  };

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
    back: () => navigate(-1),
  }));

  return (
    <div className={`create-events-page${eventType === "special" ? " create-events-page--special" : ""}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="create-events-page__scroll-area">
          <div className="create-events-page__gradient-zone">
            <div className="create-events-page__topbar">
              <BackButton />
              <Stepper currentStep={1} totalSteps={3} />
              <span className="create-events-page__topbar-spacer" aria-hidden="true" />
            </div>
            <div className="create-events-page__header">
              <h1 className="create-events-page__title">{t("create.step1Title")}</h1>
              <p className="create-events-page__description">{t("create.step1Description")}</p>
            </div>
          </div>
          <div className="create-events-page__content">
            <div className="create-events-page__form-section">
              <p className="create-events-page__section-title">
                {t("create.infoSection")}
              </p>
              <div className="create-events-page__form">
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
                  required
                  multiline
                  maxLength={300}
                  currentLength={descriptionLength}
                  registration={register("description", { required: true, maxLength: 300 })}
                  error={errors.description ? t("validation.descriptionRequired") : undefined}
                />
              </div>
              <ToggleRow
                label={t("create.isSpecial")}
                hint={t("create.type.specialDesc")}
                checked={eventType === "special"}
                onChange={(checked) => setEventType(checked ? "special" : "normal")}
              />
            </div>
          </div>
        </div>
        <div className="create-events-page__actions">
          <Button type="submit" text={t("create.continue")} variant="secondary" iconRight={<Icon name="arrow-right" size={24} aria-hidden />} />
        </div>
      </form>
    </div>
  );
});

CreateEventStep1Page.displayName = "CreateEventStep1Page";

export default CreateEventStep1Page;
