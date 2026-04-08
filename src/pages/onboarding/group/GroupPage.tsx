import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./GroupPage.scss";
import Button from "../../../components/ui/button/Button";

const GroupPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  return (
    <div className="page">
      <main className="page-content">
        <h1>{t("group.title")}</h1>
        <p>{t("group.description")}</p>
        <Button
          text={t("group.createGroup")}
          onClick={() => navigate("/create-group")}
        />
        <Button
          text={t("group.joinGroup")}
          onClick={() => navigate("/join-group")}
        />
      </main>
    </div>
  );
};

export default GroupPage;
