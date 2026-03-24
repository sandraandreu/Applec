import "./Welcome.scss";
import { useTranslation } from "react-i18next";
import { useIonRouter } from "@ionic/react";
import { useAuthContext } from "../../context/auth/AuthContext";

const Welcome = () => {
  const { t } = useTranslation("welcome");
  const router = useIonRouter();
  const { userName } = useAuthContext();

  return (
    <>
      <h1>{t("title", { name: userName })}</h1>
      <p>{t("subtitle")}</p>
      <p>{t("description")}</p>
      <button onClick={() => router.push("/onboarding")}>
        {t("button")}
      </button>
    </>
  );
};

export default Welcome;