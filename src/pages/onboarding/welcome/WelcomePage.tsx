import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./WelcomePage.scss";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../../components/ui/button/Button";

const WelcomePage = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();
  const { userName } = useAuthContext();

  return (
    <div className="page">
      <main className="page-content">
        <h1>{t("welcome.title", { name: userName })}</h1>
        <p>{t("welcome.subtitle")}</p>
        <p>{t("welcome.description")}</p>
        <Button
          text={tc("buttons.start")}
          onClick={() => history.push("/onboarding/language")}
        />
      </main>
    </div>
  );
};

export default WelcomePage;
