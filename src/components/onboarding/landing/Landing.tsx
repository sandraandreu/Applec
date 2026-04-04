import { useHistory } from "react-router-dom";
import "./Landing.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

const Landing = () => {
  const { t } = useTranslation("onboarding");
  const history = useHistory();

  return (
    <>
      <h1>{t("landing.title")}</h1>
      <p>{t("landing.subtitle")}</p>

      <Button
        text={t("landing.register")}
        onClick={() => history.push("/register")}
      />

      <Button
        text={t("landing.login")}
        onClick={() => history.push("/login")}
      />

      <p>
        {t("landing.terms")}
        <a href="/terms">{t("landing.termsLink")}</a>
      </p>
    </>
  );
};

export default Landing;