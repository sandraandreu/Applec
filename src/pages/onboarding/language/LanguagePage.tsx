import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LanguagePage.scss";
import LanguageSelector from "../../../components/common/language/LanguageSelector";
import Button from "../../../components/ui/button/Button";
import BaseLayout from "../../../components/layout/baseLayout/BaseLayout";

const LanguagePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <Button
        text={tc("buttons.continue")}
        onClick={() => navigate("/onboarding/group")}
      />
    </BaseLayout>
  );
};

export default LanguagePage;
