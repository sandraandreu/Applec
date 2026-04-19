import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./landing.scss";
import Button from "../../../ui-kit/button/Button";
import landingIlustration from "../../../assets/images/landing-ilustration.png";

const LandingPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-page__header">
        <h1 className="landing-page__tittle">{t("landing.title")}</h1>
        <p className="landing-page__description">{t("landing.subtitle")}</p>
      </div>

      <div className="landing-page__img">
        <img src={landingIlustration} alt="" />
      </div>

      <div className="landing-page__actions">
        <Button
          text={t("landing.register")}
          onClick={() => navigate("/register")}
        />
        <Button
          variant="secondary"
          text={t("landing.login")}
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default LandingPage;
