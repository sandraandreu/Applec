import { useIonRouter } from "@ionic/react";
import "./Group.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

const Group = () => {
  const { t } = useTranslation("onboarding");
  const router = useIonRouter();

  return (
    <>
      <h1>{t("group.title")}</h1>
      <p>{t("group.description")}</p>
      <Button
        text={t("group.createGroup")}
        onClick={() => router.push("/create-group")}
      />
      <Button text={t("group.joinGroup")} onClick={() => router.push("")} />
    </>
  );
};

export default Group;
