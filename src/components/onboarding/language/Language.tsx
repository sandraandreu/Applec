import { useHistory } from "react-router-dom";
import LanguageSelector from "../../ui/language/LanguageSelector";
import "./Language.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

const Language = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

  return (
    <>
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <Button
          text={tc("buttons.continue")}
          onClick={() => history.push("/onboarding/group")}
        />
    </>
  );
};

export default Language;
