import "./invite-group.scss";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../ui-kit/button/Button";

const InviteGroup = () => {
  const { t } = useTranslation("groups");
  const { group } = useGroupContext();
  const inviteCode = group?.inviteCode ?? null;
  const navigate = useNavigate();

  const location = useLocation();
  const fromCreate = location.state?.fromCreate === true;

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
    <div className="invite-group">
      <div className="invite-group__header">
        <h1>{fromCreate ? t("invite.titleCreate") : t("invite.titleInvite")}</h1>
        <p>{fromCreate ? t("invite.subtitleCreate") : t("invite.subtitleInvite")}</p>
      </div>

      <div className="invite-group__code">
        <p className="invite-group__code-label">{t("invite.code")}</p>
        <p className="invite-group__code-value">{inviteCode}</p>
      </div>

      <div className="invite-group__actions">
        <Button
          text={copied ? t("invite.copied") : t("invite.copy")}
          onClick={handleCopy}
        />
        <Button
          text={t("invite.share")}
          onClick={handleShare}
        />
      </div>

      <a className="invite-group__skip" onClick={() => navigate("/home")}>
        {t("invite.skip")}
      </a>
    </div>
  );
};

export default InviteGroup;
