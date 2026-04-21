import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./welcome.scss";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../../ui-kit/button/Button";
import Stepper from "../../../ui-kit/stepper/Stepper";
import welcomeIlustration from "../../../assets/images/welcomeIlustration.png";

const WelcomePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  return (
    <div className="welcome-page">
      <div className="welcome-page__content">
        <div className="welcome-page__header">
          <h1 className="welcome-page__title h1--large">
            {t("welcome.title", { name: profile?.firstName })}
          </h1>
          <h2 className="welcome-page__subtitle">{t("welcome.subtitle")}</h2>
          <p className="welcome-page__description">{t("welcome.description")}</p>
        </div>

        <div className="welcome-page__img">
          <img src={welcomeIlustration} alt="" />
        </div>

        <Button
          text={tc("buttons.start")}
          onClick={() => navigate("/onboarding/language")}
        />
      </div>

      <Stepper currentStep={1} totalSteps={3} />
    </div>
  );
};

export default WelcomePage;
