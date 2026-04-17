import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./group.scss";
import Button from "../../../ui-kit/button/Button";
import BaseLayout from "../../../components/base-layout/BaseLayout";

const GroupPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  return (
    <BaseLayout>
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
    </BaseLayout>
  );
};

export default GroupPage;
