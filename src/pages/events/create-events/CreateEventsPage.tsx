import "./createEvents.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import { useState } from "react";

interface CreateEventFormData {
  eventName: string;
  description: string;
}

const CreateEventPage = () => {
  const { t } = useTranslation("events");
  const [eventType, setEventType] = useState<"normal" | "special">("normal");
  const { register } = useForm<CreateEventFormData>();

  return (
    <div className="create-events-page">
      <div className="create-events-page__gradient-zone">
        <div className="create-events-page__topbar">
          <BackButton />
          <Stepper currentStep={1} totalSteps={3} />
          <span className="create-events-page__topbar-spacer" aria-hidden="true" />
        </div>

        <div className="create-events-page__header">
          <h1 className="create-events-page__title">{t("create.step1Title")}</h1>
          <p className="create-events-page__description">{t("create.step1Description")}</p>
          <div className="create-events-page__types">
            <button
              className={`create-events-page__type-btn${eventType === "special" ? " create-events-page__type-btn--active" : ""}`}
              onClick={() => setEventType("special")}
            >
              {t("create.type.special")}
            </button>
            <button
              className={`create-events-page__type-btn${eventType === "normal" ? " create-events-page__type-btn--active" : ""}`}
              onClick={() => setEventType("normal")}
            >
              {t("create.type.normal")}
            </button>
          </div>
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
              registration={register("eventName")}
            />
            <Input
              id="event-description"
              label={t("create.descriptionLabel")}
              placeholder={t("create.descriptionPlaceholder")}
              multiline
              registration={register("description")}
            />
          </div>
        </div>

        <Button text={t("create.continue")} variant="primary" />
      </div>
    </div>
  );
};

export default CreateEventPage;
