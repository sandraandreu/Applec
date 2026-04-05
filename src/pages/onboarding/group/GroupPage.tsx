import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./GroupPage.scss";
import Button from "../../../components/ui/button/Button";

const GroupPage = () => {
  const { t } = useTranslation("onboarding");
  const history = useHistory();

  return (
    <div className="page">
      <main className="page-content">
        <h1>{t("group.title")}</h1>
        <p>{t("group.description")}</p>
        <Button
          text={t("group.createGroup")}
          onClick={() => history.push("/create-group")}
        />
        <Button
          text={t("group.joinGroup")}
          onClick={() => history.push("/join-group")}
        />
      </main>
    </div>
  );
};

export default GroupPage;
