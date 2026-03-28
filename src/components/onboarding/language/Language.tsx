import { useIonRouter } from "@ionic/react";
import LanguageSelector from "../../ui/language/LanguageSelector";
import "./Language.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

const Language = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const router = useIonRouter();

  return (
    <>
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <Button
          text={tc("buttons.continue")}
          onClick={() => router.push("/onboarding/group")}
        />
    </>
  );
};

export default Language;
