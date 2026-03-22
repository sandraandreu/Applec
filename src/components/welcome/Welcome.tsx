import "./Welcome.scss";
import { useTranslation } from "react-i18next";
import { useIonRouter } from "@ionic/react";
import { useAuthContext } from "../../context/auth/AuthContext";

const Welcome = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const { userName } = useAuthContext();

  return (
    <>
      <h1>{t("welcome_title", { name: userName })}</h1>
      <p>{t("welcome_subtitle")}</p>
      <p>{t("welcome_description")}</p>
      <button onClick={() => router.push("/onboarding")}>
        {t("welcome_button")}
      </button>
    </>
  );
};

export default Welcome;