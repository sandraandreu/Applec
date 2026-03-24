import "./Welcome.scss";
import { useTranslation } from "react-i18next";
import { useIonRouter } from "@ionic/react";
import { useAuthContext } from "../../../context/auth/AuthContext";

const Welcome = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const router = useIonRouter();
  const { userName } = useAuthContext();

  return (
    <>
      <h1>{t("welcome.title", { name: userName })}</h1>
      <p>{t("welcome.subtitle")}</p>
      <p>{t("welcome.description")}</p>
      <button onClick={() => router.push("/onboarding/language")}>{tc("buttons.start")}</button>
    </>
  );
};

export default Welcome;
