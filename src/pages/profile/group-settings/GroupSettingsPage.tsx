import "./group-settings.scss";
import { useState, useRef, type ChangeEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import {
  updateGroupSettings,
  uploadGroupImage,
  updateGroupImage,
  deleteGroup,
} from "../../../services/group.service";
import PageHeader from "../../../components/layout/PageHeader";
import Input from "../../../ui-kit/input/Input";
import Button from "../../../ui-kit/button/Button";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Modal from "../../../components/modal/Modal";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";

interface FormFields {
  name: string;
}

const GroupSettingsPage = () => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const { profile, user, refreshProfile } = useAuthContext();
  const { group, refreshGroup } = useGroupContext();
  const navigate = useNavigate();

  const [saveState, setSaveState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });
  const [imageSuccess, setImageSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    defaultValues: { name: group?.name ?? "" },
  });

  if (!profile || !user || !group) return null;
  if (!user.permissions.canManageGroup) return <Navigate to="/profile" replace />;

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaveState({ isLoading: true, error: null });
    setImageSuccess(false);
    try {
      const imageUrl = await uploadGroupImage(file, group.groupId);
      await updateGroupImage(group.groupId, imageUrl);
      await refreshGroup();
      setSaveState({ isLoading: false, error: null });
      setImageSuccess(true);
    } catch {
      setSaveState({ isLoading: false, error: t("groupSettings.saveError") });
    }
  };

  const onSubmit = async (data: FormFields) => {
    setSaveState({ isLoading: true, error: null });
    try {
      await updateGroupSettings(group.groupId, { name: data.name });
      await refreshGroup();
      navigate("/profile", { replace: true, state: { groupUpdated: true } });
    } catch {
      setSaveState({ isLoading: false, error: t("groupSettings.saveError") });
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const allMemberUids = group.members.map((m) => m.uid);
      const nonAdminUids = group.members.filter((m) => m.uid !== user.uid).map((m) => m.uid);
      await deleteGroup(group.groupId, allMemberUids, nonAdminUids);
      await refreshProfile();
      navigate("/onboarding/group", { replace: true });
    } catch {
      setDeleteError(t("groupSettings.deleteError"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="group-settings-page">
      {imageSuccess && (
        <SuccessBanner message={t("groupSettings.imageSuccess")} onDismiss={() => setImageSuccess(false)} />
      )}
      <PageHeader title={t("groupSettings.title")} onBack={() => navigate(-1)} />

      <div className="group-settings-page__image-section">
        <button
          type="button"
          className="group-settings-page__image-btn"
          onClick={handleImageClick}
          disabled={saveState.isLoading}
          aria-label={t("groupSettings.changeImage")}
        >
          {group.imageUrl ? (
            <img className="group-settings-page__image" src={group.imageUrl} alt="" />
          ) : (
            <div className="group-settings-page__image-placeholder">
              <Icon name="users" size={40} aria-hidden="true" />
            </div>
          )}
          <div className="group-settings-page__image-overlay">
            <Icon name="camera" size={28} aria-hidden="true" />
          </div>
        </button>
        <span className="group-settings-page__image-label">
          {t("groupSettings.changeImage")}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="group-settings-page__file-input"
          onChange={handleFileChange}
        />
      </div>

      <form className="group-settings-page__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="group-settings-page__fields">
          <Input
            id="group-name"
            label={t("groupSettings.groupName")}
            required
            maxLength={60}
            registration={register("name", {
              required: true,
              maxLength: 60,
            })}
            error={
              errors.name?.type === "required"
                ? tCommon("errors.required")
                : errors.name?.type === "maxLength"
                  ? t("groupSettings.errors.nameTooLong")
                  : undefined
            }
          />
          {saveState.error && (
            <p className="inline-error">
              <Icon name="error-circle" size={20} aria-hidden />
              {saveState.error}
            </p>
          )}
        </div>
        <Button
          text={t("groupSettings.save")}
          type="submit"
          isLoading={saveState.isLoading}
        />
      </form>

      <div className="group-settings-page__danger-zone">
        <button
          type="button"
          className="group-settings-page__delete-btn"
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
        >
          {t("groupSettings.deleteGroup")}
        </button>
        {deleteError && (
          <p className="inline-error">
            <Icon name="error-circle" size={20} aria-hidden />
            {deleteError}
          </p>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        header={t("groupSettings.deleteConfirmTitle")}
        message={t("groupSettings.deleteConfirmMessage")}
        onDismiss={() => setShowDeleteModal(false)}
        buttons={[
          { text: t("groupSettings.deleteConfirm"), role: "danger", handler: handleDeleteConfirm },
          { text: t("groupSettings.deleteCancel"), role: "cancel" },
        ]}
      />
    </div>
  );
};

export default GroupSettingsPage;
