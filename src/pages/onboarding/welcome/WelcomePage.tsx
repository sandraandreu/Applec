import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./WelcomePage.scss";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../../components/ui/button/Button";
import BaseLayout from "../../../components/layout/baseLayout/BaseLayout";

const WelcomePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  return (
    <BaseLayout>
      <h1>{t("welcome.title", { name: profile?.username })}</h1>
      <p>{t("welcome.subtitle")}</p>
      <p>{t("welcome.description")}</p>
      <Button
        text={tc("buttons.start")}
        onClick={() => navigate("/onboarding/language")}
      />
    </BaseLayout>
  );
};

export default WelcomePage;
