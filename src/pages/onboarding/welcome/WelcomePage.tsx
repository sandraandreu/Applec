import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import "./welcome.scss";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../../ui-kit/button/Button";
import Stepper from "../../../ui-kit/stepper/Stepper";
import SlideTransition from "../../../ui-kit/slide-transition/SlideTransition";
import welcomeIllustration from "../../../assets/images/welcome-illustration.png";

const WelcomePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuthContext();

  const direction = location.state?.direction ?? "forward";

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("/onboarding/language", { state: { direction: "forward" } }),
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
      <div {...swipeHandlers} className="welcome-page">
        <div className="welcome-page__content">
          <div className="welcome-page__header">
            <h1 className="welcome-page__title h1--large">
              {t("welcome.title", { name: profile?.firstName })}
            </h1>
            <h2 className="welcome-page__subtitle">{t("welcome.subtitle")}</h2>
            <p className="welcome-page__description">{t("welcome.description")}</p>
          </div>

          <div className="welcome-page__img">
            <img src={welcomeIllustration} alt="" />
          </div>

          <Button
            text={tc("buttons.start")}
            onClick={() => navigate("/onboarding/language", { state: { direction: "forward" } })}
          />
        </div>

        <Stepper currentStep={1} totalSteps={3} />
      </div>
    </SlideTransition>
  );
};

export default WelcomePage;
