import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { updateMemberRole, removeMemberFromGroup } from "../../../services/group.service";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Chip from "../../../ui-kit/chip/Chip";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Button from "../../../ui-kit/button/Button";
import Icon from "../../../ui-kit/icons/icon/Icon";
import MemberCard from "../../../components/members/MemberCard";
import Modal from "../../../components/modal/Modal";
import Loading from "../../../components/loading/Loading";
import "./member-detail.scss";

const MemberDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("members");
  const { profile, user } = useAuthContext();
  const { group, isLoading, refreshGroup } = useGroupContext();

  const [pendingRole, setPendingRole] = useState<"organizer" | "member" | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const member = group?.members.find(m => m.uid === uid) ?? null;

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  useEffect(() => {
    if (!isLoading && !member) {
      navigate("/members", { replace: true });
    }
  }, [isLoading, member, navigate]);

  if (isLoading || !member) return <Loading />;

  const canManage = (user?.permissions.canManageMembers ?? false) && member.role !== "admin";
  const targetRole: "organizer" | "member" = member.role === "member" ? "organizer" : "member";
  const memberLinked = group?.linkedMembers.filter(lm => lm.ownerUid === uid) ?? [];

  const handleSave = async () => {
    if (!pendingRole || !profile?.groupId) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateMemberRole(profile.groupId, member.uid, pendingRole);
      await refreshGroup();
      navigate("/members");
    } catch {
      setIsSaving(false);
      setSaveError(t("detail.saveError"));
    }
  };

  const handleDelete = async () => {
    if (!profile?.groupId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await removeMemberFromGroup(profile.groupId, member.uid);
      await refreshGroup();
      navigate("/members");
    } catch {
      setIsDeleting(false);
      setDeleteError(t("detail.deleteError"));
    }
  };

  return (
    <div className="member-detail-page" {...swipeHandlers}>
      <div className={`member-detail-page__gradient-zone member-detail-page__gradient-zone--${member.role}`}>
        <div className="member-detail-page__top-bar">
          <BackButton />
        </div>
        <div className="member-detail-page__profile">
          <Avatar firstName={member.firstName} lastName={member.lastName} role={member.role} size="lg" />
          <div className="member-detail-page__profile-info">
            <h1 className="member-detail-page__name">{member.firstName} {member.lastName}</h1>
            <span className="member-detail-page__email">{member.email}</span>
          </div>
          <Chip role={member.role} variant="full" />
        </div>
      </div>

      <div className="member-detail-page__content">
        {memberLinked.length > 0 && (
          <div className="member-detail-page__section">
            <h2 className="member-detail-page__section-title">{t("detail.linked")}</h2>
            <div className="member-detail-page__linked-list">
              {memberLinked.map(linked => (
                <MemberCard
                  key={linked.id}
                  firstName={linked.firstName}
                  lastName={linked.lastName}
                  relationship={linked.relationship}
                  role="member"
                  showChevron={false}
                  showRole={false}
                />
              ))}
            </div>
          </div>
        )}

        {canManage && (
          <>
            <div className="member-detail-page__section">
              <div className="member-detail-page__action-card">
                <button
                  className={`member-detail-page__action-row${pendingRole ? " member-detail-page__action-row--selected" : ""}`}
                  onClick={() => setPendingRole(prev => prev ? null : targetRole)}
                >
                  <Icon name="info-circle" size={22} className="member-detail-page__action-icon" />
                  <span className="member-detail-page__action-text">
                    {t(`detail.makeRole.${targetRole}`)}
                  </span>
                  <Icon
                    name={pendingRole ? "check" : "chevron-right"}
                    size={20}
                    className={pendingRole ? "member-detail-page__action-check" : "member-detail-page__action-chevron"}
                  />
                </button>
              </div>

              {pendingRole && (
                <div className="member-detail-page__buttons">
                  <Button
                    text={t("detail.save")}
                    onClick={handleSave}
                    isLoading={isSaving}
                  />
                  <Button
                    text={t("detail.cancel")}
                    variant="secondary"
                    onClick={() => setPendingRole(null)}
                  />
                </div>
              )}

              {saveError && (
                <p className="member-detail-page__error">
                  <Icon name="error-circle" size={20} />
                  {saveError}
                </p>
              )}
            </div>

            <div className="member-detail-page__section">
              <div className="member-detail-page__action-card">
                <button
                  className="member-detail-page__action-row member-detail-page__action-row--danger"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Icon name="trash" size={24} className="member-detail-page__action-icon" />
                  <span className="member-detail-page__action-text">{t("detail.removeMember")}</span>
                  <Icon name="chevron-right" size={20} className="member-detail-page__action-chevron" />
                </button>
              </div>
              {deleteError && (
                <p className="member-detail-page__error">
                  <Icon name="error-circle" size={20} />
                  {deleteError}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showDeleteAlert}
        header={t("detail.deleteConfirm")}
        message={t("detail.deleteMessage")}
        onDismiss={() => setShowDeleteAlert(false)}
        buttons={[
          { text: t("detail.deleteCancel") },
          {
            text: t("detail.deleteSubmit"),
            role: "cancel",
            handler: handleDelete,
          },
        ]}
      />

      {isDeleting && <Loading />}
    </div>
  );
};

export default MemberDetailPage;
