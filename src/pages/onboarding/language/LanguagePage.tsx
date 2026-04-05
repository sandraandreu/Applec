import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LanguagePage.scss";
import LanguageSelector from "../../../components/ui/language/LanguageSelector";
import Button from "../../../components/ui/button/Button";

const LanguagePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

  return (
    <div className="page">
      <main className="page-content">
        <h1>{t("language.title")}</h1>
        <p>{t("language.description")}</p>
        <LanguageSelector />
        <Button
          text={tc("buttons.continue")}
          onClick={() => history.push("/onboarding/group")}
        />
      </main>
    </div>
  );
};

export default LanguagePage;
