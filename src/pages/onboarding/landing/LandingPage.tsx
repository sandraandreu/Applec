import { useTranslation } from "react-i18next";
import "./landing.scss";
import Button from "../../../ui-kit/button/Button";
import landingIllustration from "../../../assets/images/landing-illustration.png";

const LandingPage = () => {
  const { t } = useTranslation("onboarding");

  return (
    <div className="landing-page">
      <div className="landing-page__header">
        <h1 className="landing-page__title">{t("landing.title")}</h1>
        <p className="landing-page__description">{t("landing.subtitle")}</p>
      </div>

      <div className="landing-page__img">
        <img src={landingIllustration} alt="" />
      </div>

      <div className="landing-page__actions">
        <Button
          text={t("landing.register")}
          to="/register"
        />
        <Button
          variant="secondary"
          text={t("landing.login")}
          to="/login"
        />
      </div>
    </div>
  );
};

export default LandingPage;
