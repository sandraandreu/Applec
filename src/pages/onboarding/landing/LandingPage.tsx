import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LandingPage.scss";
import Button from "../../../components/ui/button/Button";

const LandingPage = () => {
  const { t } = useTranslation("onboarding");
  const history = useHistory();

  return (
    <div className="page">
      <main className="page-content">
        <div className="landing">
          <div className="landing__header">
            <h1>{t("landing.title")}</h1>
            <p>{t("landing.subtitle")}</p>
          </div>

          <div className="landing__actions">
            <Button
              text={t("landing.register")}
              onClick={() => history.push("/register")}
            />
            <Button
              text={t("landing.login")}
              onClick={() => history.push("/login")}
            />
          </div>

          <p className="landing__terms">
            {t("landing.terms")}
            <a href="/terms">{t("landing.termsLink")}</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
