import "./edit-profile.scss";
import { useState, useRef, type ChangeEvent } from "react";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import { uploadProfilePhoto, updateUserFields } from "../../../services/user.service";
import { updateMemberFields } from "../../../services/group.service";
import PageHeader from "../../../components/layout/PageHeader";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Input from "../../../ui-kit/input/Input";
import Button from "../../../ui-kit/button/Button";
import Icon from "../../../ui-kit/icons/icon/Icon";

interface FormFields {
  firstName: string;
  lastName: string;
}

const EditProfilePage = () => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const { profile, user, refreshProfile } = useAuthContext();
  const { refreshGroup } = useGroupContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutBackground(profile?.role);

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
    },
  });

  if (!profile || !user) return null;

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setPhotoSuccess(false);
    try {
      const photoUrl = await uploadProfilePhoto(user.uid, file);
      await updateUserFields(user.uid, { photoUrl });
      if (profile.groupId) await updateMemberFields(profile.groupId, user.uid, { photoUrl });
      await Promise.all([refreshProfile(), refreshGroup()]);
      setPhotoSuccess(true);
    } catch {
      setError(t("editProfile.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormFields) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateUserFields(user.uid, { firstName: data.firstName, lastName: data.lastName });
      if (profile.groupId) {
        await updateMemberFields(profile.groupId, user.uid, { firstName: data.firstName, lastName: data.lastName });
      }
      await Promise.all([refreshProfile(), refreshGroup()]);
      navigate("/profile", { replace: true, state: { profileUpdated: true } });
    } catch {
      setError(t("editProfile.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      {photoSuccess && (
        <SuccessBanner message={t("editProfile.photoSuccess")} onDismiss={() => setPhotoSuccess(false)} />
      )}
      <PageHeader title={t("editProfile.title")} onBack={() => navigate(-1)} />
      <div className="edit-profile-page__avatar-section">
        <button
          className="edit-profile-page__avatar-wrapper"
          onClick={handlePhotoClick}
          disabled={isLoading}
          aria-label={t("editProfile.changePhoto")}
        >
          <Avatar
            firstName={profile.firstName}
            lastName={profile.lastName}
            role={profile.role}
            size="lg"
            photoUrl={profile.photoUrl}
          />
          <div className="edit-profile-page__avatar-overlay">
            <Icon name="camera" size={28} aria-hidden />
          </div>
        </button>
        <span className="edit-profile-page__avatar-label">
          {t("editProfile.changePhoto")}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="edit-profile-page__file-input"
          onChange={handleFileChange}
        />
      </div>

      <form className="edit-profile-page__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-profile-page__fields">
          <Input
            id="firstName"
            label={t("editProfile.firstName")}
            registration={register("firstName", { required: true })}
            error={errors.firstName ? tCommon("errors.required") : undefined}
          />
          <Input
            id="lastName"
            label={t("editProfile.lastName")}
            registration={register("lastName", { required: true })}
            error={errors.lastName ? tCommon("errors.required") : undefined}
          />
          <Input
            id="email"
            label={t("editProfile.email")}
            defaultValue={profile.email ?? ""}
            disabled
          />
          {error && (
            <p className="edit-profile-page__error">
              <Icon name="error-circle" size={20} aria-hidden />
              {error}
            </p>
          )}
        </div>
        <Button
          text={t("editProfile.save")}
          type="submit"
          isLoading={isLoading}
        />
      </form>

    </div>
  );
};

export default EditProfilePage;
