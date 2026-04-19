import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./welcome.scss";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../../ui-kit/button/Button";

const WelcomePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  return (
<<<<<<< HEAD
    <BaseLayout>
      <h1>{t("welcome.title", { name: profile?.firstName })}</h1>
=======
    <div className="welcome-page">
      <h1>{t("welcome.title", { name: profile?.username })}</h1>
>>>>>>> feature/styles-final-design
      <p>{t("welcome.subtitle")}</p>
      <p>{t("welcome.description")}</p>
      <Button
        text={tc("buttons.start")}
        onClick={() => navigate("/onboarding/language")}
      />
    </div>
  );
};

export default WelcomePage;
