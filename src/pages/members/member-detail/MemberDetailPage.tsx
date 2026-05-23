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
import IconButton from "../../../ui-kit/icons/icon-button/IconButton";
import MemberCard from "../../../components/members/MemberCard";
import Modal from "../../../components/modal/Modal";
import Loading from "../../../components/loading/Loading";
import RadioCircle from "../../../ui-kit/radio-circle/RadioCircle";
import "./member-detail.scss";

const MemberDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("members");
  const { profile, user } = useAuthContext();
  const { group, isLoading, refreshGroup } = useGroupContext();

  const [pendingRole, setPendingRole] = useState<"admin" | "organizer" | "member" | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<"admin" | "organizer" | "member" | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [saveState, setSaveState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });
  const [deleteState, setDeleteState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });

  const member = group?.members.find(member => member.uid === uid) ?? null;

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

  const canManage = (user?.permissions.canManageMembers ?? false) && member.uid !== user?.uid;
  const availableRoles = (["admin", "organizer", "member"] as const).filter(role => role !== member.role);
  const adminCount = group?.members.filter(member => member.role === "admin").length ?? 0;
  const isAdminLimitReached = adminCount >= 3;
  const memberLinked = group?.linkedMembers.filter(linkedMember => linkedMember.ownerUid === uid) ?? [];

  const executeSave = async () => {
    if (!pendingRole || !profile?.groupId) return;
    setSaveState({ isLoading: true, error: null });
    try {
      await updateMemberRole(profile.groupId, member.uid, pendingRole);
      await refreshGroup();
      navigate("/members", { state: { roleUpdated: true }, replace: true });
    } catch {
      setSaveState({ isLoading: false, error: t("detail.saveError") });
    }
  };

  const handleSave = () => {
    if (!pendingRole) return;
    if (pendingRole === "admin") {
      setShowAdminConfirm(true);
      return;
    }
    executeSave();
  };

  const handleDelete = async () => {
    if (!profile?.groupId) return;
    setDeleteState({ isLoading: true, error: null });
    try {
      await removeMemberFromGroup(profile.groupId, member.uid);
      await refreshGroup();
      navigate("/members", { state: { memberDeleted: true }, replace: true });
    } catch {
      setDeleteState({ isLoading: false, error: t("detail.deleteError") });
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
              <div className="member-detail-page__section-header">
                <h2 className="member-detail-page__section-title">{t("detail.changeRoleTitle")}</h2>
                <Chip role={member.role} variant="full" />
              </div>
              <div className="member-detail-page__action-card">
                {availableRoles.map((role, index) => {
                  const isDisabled = role === "admin" && isAdminLimitReached;
                  return (
                    <div
                      key={role}
                      className={[
                        "member-detail-page__role-option",
                        index > 0 ? "member-detail-page__role-option--bordered" : "",
                        pendingRole === role ? "member-detail-page__role-option--selected" : "",
                        isDisabled ? "member-detail-page__role-option--disabled" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      <div className="member-detail-page__role-option-row">
                        <button
                          className="member-detail-page__role-option-select"
                          onClick={() => {
                            if (isDisabled) return;
                            setPendingRole(prev => prev === role ? null : role);
                            setExpandedDescription(null);
                          }}
                          aria-pressed={pendingRole === role}
                          aria-disabled={isDisabled}
                        >
                          <RadioCircle selected={pendingRole === role} />
                          {t(`detail.makeRole.${role}`)}
                        </button>
                        <IconButton
                          name="info-circle"
                          size={26}
                          ariaLabel={t("detail.roleInfoLabel")}
                          onClick={() => setExpandedDescription(prev => prev === role ? null : role)}
                          className="member-detail-page__role-info-btn"
                        />
                      </div>
                      {expandedDescription === role && (
                        <p className="member-detail-page__role-option-description">
                          {t(`detail.roleDescription.${role}`)}
                        </p>
                      )}
                      {isDisabled && (
                        <p className="member-detail-page__role-option-warning">
                          {t("detail.adminLimitReached")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {pendingRole && (
                <div className="member-detail-page__buttons">
                  <Button
                    text={t("detail.save")}
                    onClick={handleSave}
                    isLoading={saveState.isLoading}
                  />
                  <Button
                    text={t("detail.cancel")}
                    variant="secondary"
                    onClick={() => setPendingRole(null)}
                  />
                </div>
              )}

              {saveState.error && (
                <p className="member-detail-page__error">
                  <Icon name="error-circle" size={20} />
                  {saveState.error}
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
              {deleteState.error && (
                <p className="member-detail-page__error">
                  <Icon name="error-circle" size={20} />
                  {deleteState.error}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showAdminConfirm}
        header={t("detail.adminConfirmHeader")}
        message={t("detail.adminConfirmMessage")}
        onDismiss={() => setShowAdminConfirm(false)}
        buttons={[
          { text: t("detail.adminConfirmCancel"), role: "cancel" },
          {
            text: t("detail.adminConfirmSubmit"),
            handler: executeSave,
          },
        ]}
      />

      <Modal
        isOpen={showDeleteAlert}
        header={t("detail.deleteConfirm")}
        message={t("detail.deleteMessage")}
        onDismiss={() => setShowDeleteAlert(false)}
        buttons={[
          { text: t("detail.deleteCancel"), role: "cancel" },
          {
            text: t("detail.deleteSubmit"),
            role: "danger",
            handler: handleDelete,
          },
        ]}
      />

      {deleteState.isLoading && <Loading />}
    </div>
  );
};

export default MemberDetailPage;
