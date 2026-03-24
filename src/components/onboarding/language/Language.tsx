import { useIonRouter } from "@ionic/react";
import LanguageSelector from "../../ui/language/LanguageSelector";
import "./Language.scss";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const router = useIonRouter();

  return (
    <>
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <button onClick={() => router.push("/onboarding/group")}>{tc("buttons.continue")}</button>
    </>
  );
};

export default Language;
