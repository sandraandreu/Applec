import "./invite-group.scss";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import illustration from "../../../assets/images/invite-group-illustration.png";

const InviteGroupPage = () => {
  const { t } = useTranslation("groups");
  const { group } = useGroupContext();
  const inviteCode = group?.inviteCode ?? null;
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
    <div className="invite-group-page">
      <div className="invite-group-page__header">
        <h1 className="invite-group-page__title">
          {fromCreate ? t("invite.titleCreate") : t("invite.titleInvite")}
        </h1>
        <p className="invite-group-page__description">
          {fromCreate ? t("invite.subtitleCreate") : t("invite.subtitleInvite")}
        </p>
      </div>

      <img
        className="invite-group-page__illustration"
        src={illustration}
        alt=""
      />

      <div className="invite-group-page__actions">
        <button
          className="invite-group-page__code"
          onClick={handleCopy}
          type="button"
        >
          <span className="invite-group-page__code-label">
            {t("invite.code")}
          </span>
          <span className="invite-group-page__code-value">
            {copied ? t("invite.copied") : inviteCode}
          </span>
        </button>

        <button
          className="invite-group-page__share"
          onClick={handleShare}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 14.25C7.24264 14.25 8.25 13.2426 8.25 12C8.25 10.7574 7.24264 9.75 6 9.75C4.75736 9.75 3.75 10.7574 3.75 12C3.75 13.2426 4.75736 14.25 6 14.25Z"
              stroke="#0068FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 7.50269C19.2426 7.50269 20.25 6.49533 20.25 5.25269C20.25 4.01004 19.2426 3.00269 18 3.00269C16.7574 3.00269 15.75 4.01004 15.75 5.25269C15.75 6.49533 16.7574 7.50269 18 7.50269Z"
              stroke="#0068FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 21.0017C19.2426 21.0017 20.25 19.9943 20.25 18.7517C20.25 17.5091 19.2426 16.5017 18 16.5017C16.7574 16.5017 15.75 17.5091 15.75 18.7517C15.75 19.9943 16.7574 21.0017 18 21.0017Z"
              stroke="#0068FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.0391 6.3562L7.96069 10.9003M7.96069 13.1062L16.0391 17.6503L7.96069 13.1062Z"
              stroke="#0068FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("invite.share")}
        </button>
      </div>

      <a href="/home">{t("invite.skip")}</a>
    </div>
  );
};

export default InviteGroupPage;
