import { useTranslation } from "react-i18next";
import "./InviteGroup.scss";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../ui/button/Button";

const InviteGroup = () => {
  const { t } = useTranslation("groups");
  const { group } = useGroupContext();
  const inviteCode = group?.inviteCode ?? null;
  const history = useHistory();

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!inviteCode) return;
    if (navigator.share) {
      await navigator.share({
        title: "Applec",
        text: `Únete a mi falla con el código: ${inviteCode}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <h1>{t("invite.title")}</h1>
      <p>{t("invite.subtitle")}</p>

      <div>
        <p>{t("invite.code")}</p>
        <p>{inviteCode}</p>
      </div>

      <Button
        text={copied ? t("invite.copied") : t("invite.copy")}
        onClick={handleCopy}
      />

      <Button
        text={t("invite.share")}
        onClick={handleShare}
      />

      <a onClick={() => history.push("/home")}>
        {t("invite.skip")}
      </a>
    </>
  );
};

export default InviteGroup;
