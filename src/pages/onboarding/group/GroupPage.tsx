import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import "./group.scss";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import SlideTransition from "../../../ui-kit/slide-transition/SlideTransition";
import groupIllustration from "../../../assets/images/group-onboarding-illustration.png";

const GroupPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();
  const location = useLocation();

  const direction = location.state?.direction ?? "forward";

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate("/onboarding/language", { state: { direction: "backward" } }),
    onSwiping: ({ event, dir }) => {
      if (dir === "Left" || dir === "Right") event.preventDefault();
    },
    trackTouch: true,
    trackMouse: false,
    swipeDuration: 500,
    preventScrollOnSwipe: false,
    touchEventOptions: { passive: false },
  });

  return (
    <SlideTransition direction={direction}>
      <div {...swipeHandlers} className="group-page">
        <BackButton to="/onboarding/language" state={{ direction: "backward" }} />

        <div className="group-page__content">
          <div className="group-page__header">
            <h1 className="group-page__title h1--large">{t("group.title")}</h1>
            <p className="group-page__description">{t("group.description")}</p>
          </div>

          <div className="group-page__img">
            <img src={groupIllustration} alt="" />
          </div>

          <div className="group-page__actions">
            <Button
              variant="secondary"
              text={t("group.createGroup")}
              to="/create-group"
            />
            <Button
              text={t("group.joinGroup")}
              to="/join-group"
            />
          </div>
        </div>
        <Stepper currentStep={3} totalSteps={3} />
      </div>
    </SlideTransition>
  );
};

export default GroupPage;
