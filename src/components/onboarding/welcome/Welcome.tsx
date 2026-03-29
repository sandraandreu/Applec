import "./Welcome.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../../context/auth/AuthContext";
import Button from "../../ui/button/Button";

const Welcome = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();
  const { userName } = useAuthContext();

  return (
    <>
      <h1>{t("welcome.title", { name: userName })}</h1>
      <p>{t("welcome.subtitle")}</p>
      <p>{t("welcome.description")}</p>
      <Button
          text={tc("buttons.start")}
          onClick={() => history.push("/onboarding/language")}
        />
    </>
  );
};

export default Welcome;
