import "./create-group.scss";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "../../../components/loading/Loading";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "../../../context/group/GroupContext";
import { createGroup, uploadGroupImage, updateGroupImage } from "../../../services/group.service";
import { updateUserGroup } from "../../../services/user.service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface CreateGroupFormData {
  name: string;
}

const CreateGroupPage = () => {
  const { t } = useTranslation("groups");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { refreshGroup } = useGroupContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorConnection, setErrorConnection] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>();

  const name = watch("name", "");

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
    try {
      setIsLoading(true);

      const groupId = await createGroup({
        name,
        adminUid: user!.uid,
        adminUsername: profile?.username ?? "",
        adminFirstName: profile?.firstName ?? "",
        adminLastName: profile?.lastName ?? "",
        adminEmail: user!.email ?? "",
      });

      if (imageFile) {
        const imageUrl = await uploadGroupImage(imageFile, groupId);
        await updateGroupImage(groupId, imageUrl);
      }

      await updateUserGroup(user!.uid, groupId);
      await refreshGroup();
      navigate("/invite-group");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      console.error("Create group error:", firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("createGroup.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="group-name"
          label={t("createGroup.name")}
          placeholder={t("createGroup.namePlaceholder")}
          type="text"
          registration={register("name", {
            required: true,
            maxLength: 50,
          })}
          maxLength={50}
          currentLength={name.length}
          error={
            errors.name?.type === "required"
              ? tc("errors.required")
              : errors.name?.type === "maxLength"
                ? t("createGroup.errors.nameTooLong")
                : undefined
          }
        />

        <div className="create-group__image">
          <label className="create-group__image-label" htmlFor="group-image">
            {t("createGroup.image")}
          </label>
          {imagePreview && (
            <img
              className="create-group__image-preview"
              src={imagePreview}
              alt="preview"
            />
          )}
          <input
            id="group-image"
            className="create-group__image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageError && (
            <span className="create-group__image-error">{imageError}</span>
          )}
        </div>

        <Button
          text={t("createGroup.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0 || !!imageError}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}
      </form>
    </>
  );
};

export default CreateGroupPage;
