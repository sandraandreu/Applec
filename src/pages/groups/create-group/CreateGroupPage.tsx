import "./create-group.scss";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Loading from "../../../components/loading/Loading";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  createGroup,
  uploadGroupImage,
  updateGroupImage,
} from "../../../services/group.service";
import { updateUserFields } from "../../../services/user.service";
import Icon from "../../../ui-kit/icons/icon/Icon";
import type { FirebaseError } from "../../../models/error.model";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface CreateGroupFormData {
  name: string;
}

const CreateGroupPage = () => {
  const { t } = useTranslation("groups");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuthContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorConnection, setErrorConnection] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(t("createGroup.errors.imageTooLarge"));
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: CreateGroupFormData) => {
    handleCreateGroup(data.name);
  };

  const handleCreateGroup = async (name: string) => {
    if (!user) return;
    try {
      setIsLoading(true);

      const groupId = await createGroup({
        name,
        adminUid: user.uid,
        adminFirstName: profile?.firstName ?? "",
        adminLastName: profile?.lastName ?? "",
        adminEmail: user.email ?? "",
      });

      if (imageFile) {
        const imageUrl = await uploadGroupImage(imageFile, groupId);
        await updateGroupImage(groupId, imageUrl);
      }

      await updateUserFields(user.uid, { groupId, role: "admin" });
      navigate("/invite-group", { state: { fromCreate: true } });
      await refreshProfile();
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="create-group-page__content">
        <div className="create-group-page__header">
          <h1 className="create-group-page__title">{t("createGroup.title")}</h1>
          <p className="create-group-page__description">
            {t("createGroup.subtitle")}
          </p>
        </div>

        <div className="create-group-page__image-picker">
          <label
            htmlFor="group-image"
            className="create-group-page__image-circle"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Imagen del grupo seleccionada"
                  className="create-group-page__image-preview"
                />
                <div className="create-group-page__image-edit">
                  <Icon name="edit" size={24} />
                </div>
              </>
            ) : (
              <Icon name="camera" size={24} />
            )}
          </label>
          <input
            id="group-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="create-group-page__image-input"
          />
          <span className="create-group-page__image-caption">
            {t("createGroup.image")}
          </span>
          {imageError && (
            <span className="create-group-page__image-error">
              <Icon name="error-circle" size={24} className="icon" />
              {imageError}
            </span>
          )}
        </div>

        <form
          className="create-group-page__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="group-name"
            label={t("createGroup.name")}
            placeholder={t("createGroup.namePlaceholder")}
            type="text"
            required
            registration={register("name", {
              required: true,
              maxLength: 50,
            })}
            error={
              errors.name?.type === "required"
                ? tc("errors.required")
                : errors.name?.type === "maxLength"
                  ? t("createGroup.errors.nameTooLong")
                  : undefined
            }
          />

          {errorConnection && (
            <span className="create-group-page__error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection}
            </span>
          )}

          <div className="create-group-page__button">
            <Button
              text={t("createGroup.button")}
              type="submit"
              disabled={Object.keys(errors).length > 0 || !!imageError}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;
