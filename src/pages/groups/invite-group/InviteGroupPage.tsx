import "./invite-group.scss";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import illustration from "../../../assets/images/invite-group-illustration.png";
import Icon from "../../../ui-kit/icons/icon/Icon";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";

const InviteGroupPage = () => {
  const { t: tGroups } = useTranslation("groups");
  const { group } = useGroupContext();
  const inviteCode = group?.inviteCode ?? null;
  const location = useLocation();
  const fromCreate = location.state?.fromCreate === true;

  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!inviteCode) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tGroups("invite.shareTitle"),
          text: tGroups("invite.shareText", { inviteCode }),
        });
      } catch {
        // user cancelled or share not allowed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="invite-group-page">
      {!fromCreate && (
        <div className="invite-group-page__back">
          <BackButton />
        </div>
      )}
      <div className="invite-group-page__header">
        <h1 className="invite-group-page__title">
          {fromCreate ? tGroups("invite.titleCreate") : tGroups("invite.titleInvite")}
        </h1>
        <p className="invite-group-page__description">
          {tGroups("invite.subtitle")}
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
            {tGroups("invite.code")}
          </span>
          <span className="invite-group-page__code-value">
            {copied ? tGroups("invite.copied") : inviteCode}
          </span>
        </button>

        <button
          className="invite-group-page__share"
          onClick={handleShare}
          type="button"
        >
          <Icon name="share" size={24} className="invite-group-page__share-icon" />
          {tGroups("invite.share")}
        </button>
      </div>

      {fromCreate && (
        <Link to="/events" className="invite-group-page__skip">{tGroups("invite.skip")}</Link>
      )}
    </div>
  );
};

export default InviteGroupPage;
