import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LandingPage.scss";
import Button from "../../../components/ui/button/Button";
import BaseLayout from "../../../components/layout/baseLayout/BaseLayout";

const LandingPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <div className="landing">
        <div className="landing__header">
          <h1>{t("landing.title")}</h1>
          <p>{t("landing.subtitle")}</p>
        </div>

        <div className="landing__actions">
          <Button
            text={t("landing.register")}
            onClick={() => navigate("/register")}
          />
          <Button
            text={t("landing.login")}
            onClick={() => navigate("/login")}
          />
        </div>

        <p className="landing__terms">
          {t("landing.terms")}
          <a href="/terms">{t("landing.termsLink")}</a>
        </p>
      </div>
    </BaseLayout>
  );
};

export default LandingPage;
