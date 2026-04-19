import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./language.scss";
import LanguageSelector from "../../../components/language-selector/LanguageSelector";
import Button from "../../../ui-kit/button/Button";

const LanguagePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <div className="language-page">
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <Button
        text={tc("buttons.continue")}
        onClick={() => navigate("/onboarding/group")}
      />
    </div>
  );
};

export default LanguagePage;
