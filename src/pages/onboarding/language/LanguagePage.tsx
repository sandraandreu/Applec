import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./language.scss";
import LanguageSelector from "../../../components/language-selector/LanguageSelector";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/buttons/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";

const LanguagePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <div className="language-page">
      <BackButton />

      <div className="language-page__content">
        <div className="language-page__header">
          <h1 className="language-page__title">{t("language.title")}</h1>
          <p className="language-page__description">
            {t("language.description")}
          </p>
        </div>

        <LanguageSelector />

        <Button
          text={tc("buttons.continue")}
          onClick={() => navigate("/onboarding/group")}
        />
      </div>

      <Stepper currentStep={2} totalSteps={3} />
    </div>
  );
};

export default LanguagePage;
