import { useHistory } from "react-router-dom";
import "./Group.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

const Group = () => {
  const { t } = useTranslation("onboarding");
  const history = useHistory();

  return (
    <>
      <h1>{t("group.title")}</h1>
      <p>{t("group.description")}</p>
      <Button
        text={t("group.createGroup")}
        onClick={() => history.push("/create-group")}
      />
      <Button text={t("group.joinGroup")} onClick={() => history.push("/join-group")} />
    </>
  );
};

export default Group;
