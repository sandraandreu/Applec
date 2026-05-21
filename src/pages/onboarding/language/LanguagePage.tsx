import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import "./language.scss";
import LanguageSelector from "../../../components/language-selector/LanguageSelector";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import SlideTransition from "../../../ui-kit/slide-transition/SlideTransition";

const LanguagePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();

  const direction = location.state?.direction ?? "forward";

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("/onboarding/group", { state: { direction: "forward" } }),
    onSwipedRight: () => navigate("/onboarding/welcome", { state: { direction: "backward" } }),
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
      <div {...swipeHandlers} className="language-page">
        <BackButton onClick={() => navigate("/onboarding/welcome", { state: { direction: "backward" } })} />

        <div className="language-page__content">
          <div className="language-page__header">
            <h1 className="language-page__title">{t("language.title")}</h1>
            <p className="language-page__description">
              {t("language.description")}
            </p>
          </div>

          <LanguageSelector />

          <Button
            text={tCommon("buttons.continue")}
            onClick={() => navigate("/onboarding/group", { state: { direction: "forward" } })}
          />
        </div>

        <Stepper currentStep={2} totalSteps={3} />
      </div>
    </SlideTransition>
  );
};

export default LanguagePage;
