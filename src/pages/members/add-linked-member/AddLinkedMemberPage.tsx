import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import "./add-linked-member.scss";

interface LocationState {
  returnTo?: string;
  openVoteSheet?: boolean;
}

const AddLinkedMemberPage = () => {
  const { t } = useTranslation("events");
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  const handleCancel = () => navigate(-1);

  const handleSubmit = () => {
    if (locationState.returnTo) {
      navigate(locationState.returnTo, {
        state: locationState.openVoteSheet ? { openVoteSheet: true } : null,
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="add-linked-member-page" {...swipeHandlers}>
      <div className="add-linked-member-page__gradient-zone">
        <div className="add-linked-member-page__top-bar">
          <BackButton />
        </div>
        <div className="add-linked-member-page__header">
          <h1 className="add-linked-member-page__title">{t("linked.title")}</h1>
          <p className="add-linked-member-page__description">{t("linked.description")}</p>
        </div>
      </div>

      <div className="add-linked-member-page__content">
        <div className="add-linked-member-page__fields">
          <Input
            label={t("linked.firstName")}
            id="linked-first-name"
            placeholder={t("linked.firstNamePlaceholder")}
          />
          <Input
            label={t("linked.lastName")}
            id="linked-last-name"
            placeholder={t("linked.lastNamePlaceholder")}
          />
          <Input
            label={t("linked.relationship")}
            id="linked-relationship"
            placeholder={t("linked.relationshipPlaceholder")}
          />
        </div>
        <div className="add-linked-member-page__actions">
          <Button variant="secondary" text={t("linked.cancel")} onClick={handleCancel} />
          <Button variant="primary" text={t("linked.save")} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddLinkedMemberPage;
