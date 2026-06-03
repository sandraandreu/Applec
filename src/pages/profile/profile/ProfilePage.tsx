import "./profile.scss";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Chip from "../../../ui-kit/chip/Chip";
import SettingsRow from "../../../components/settings-row/SettingsRow";
import Modal from "../../../components/modal/Modal";

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const { user, profile, logout } = useAuthContext();
  const navigate = useNavigate();

  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileUpdated, setShowProfileUpdated] = useState(
    !!(location.state as { profileUpdated?: boolean } | null)?.profileUpdated
  );
  const [showPasswordUpdated, setShowPasswordUpdated] = useState(
    !!(location.state as { passwordUpdated?: boolean } | null)?.passwordUpdated
  );
  const [showGroupUpdated, setShowGroupUpdated] = useState(
    !!(location.state as { groupUpdated?: boolean } | null)?.groupUpdated
  );

  useLayoutBackground(profile?.role, "top");

  useEffect(() => {
    if (showProfileUpdated || showPasswordUpdated || showGroupUpdated) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [showProfileUpdated, showPasswordUpdated, showGroupUpdated, navigate, location.pathname]);

  if (!profile || !user) return null;

  return (
    <div className="profile-page">
      {showProfileUpdated && (
        <SuccessBanner
          message={t("editProfile.saveSuccess")}
          onDismiss={() => setShowProfileUpdated(false)}
        />
      )}
      {showPasswordUpdated && (
        <SuccessBanner
          message={t("changePassword.saveSuccess")}
          onDismiss={() => setShowPasswordUpdated(false)}
        />
      )}
      {showGroupUpdated && (
        <SuccessBanner
          message={t("groupSettings.saveSuccess")}
          onDismiss={() => setShowGroupUpdated(false)}
        />
      )}
      <div className="profile-page__header">
        <Avatar
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          size="lg"
          photoUrl={profile.photoUrl}
        />
        <div className="profile-page__info">
          <h1 className="profile-page__name">{profile.firstName} {profile.lastName}</h1>
          <p className="profile-page__email">{profile.email}</p>
        </div>
        <Chip role={profile.role} variant="full" />
      </div>

      <div className="profile-page__content">
        <section className="profile-page__section">
          <h2 className="profile-page__section-title">{t("profile.myAccount")}</h2>
          <div className="profile-page__card">
            <SettingsRow label={t("profile.editProfile")} iconName="edit" to="/profile/edit" />
            <SettingsRow label={t("profile.changePassword")} iconName="lock" to="/profile/change-password" />
            <SettingsRow label={t("profile.linkedMembers")} iconName="link" to="/members/linked" />
            <SettingsRow label={t("profile.notifications")} iconName="bell" to="/profile/notifications-settings" />
            <SettingsRow label={t("profile.language")} iconName="globe" to="/profile/language" />
          </div>
        </section>

        <section className="profile-page__section">
          <h2 className="profile-page__section-title">{t("profile.myGroup")}</h2>
          <div className="profile-page__card">
            {user.permissions.canShareAccess && (
              <SettingsRow
                label={t("profile.shareAccess")}
                iconName="person-add"
                onClick={() => navigate("/invite-group", { state: { fromProfile: true } })}
              />
            )}
            {user.permissions.canManageGroup && (
              <SettingsRow
                label={t("profile.groupSettings")}
                iconName="settings"
                to="/profile/group-settings"
              />
            )}
            <SettingsRow
              label={t("profile.logout")}
              iconName="logout"
              onClick={() => setShowLogoutModal(true)}
              danger
            />
          </div>
        </section>
      </div>

      <Modal
        isOpen={showLogoutModal}
        header={t("profile.logoutConfirmTitle")}
        message={t("profile.logoutConfirmMessage")}
        onDismiss={() => setShowLogoutModal(false)}
        buttons={[
          { text: t("profile.logoutConfirm"), role: "danger", handler: logout },
          { text: t("profile.logoutCancel"), role: "cancel" },
        ]}
      />
    </div>
  );
};

export default ProfilePage;
