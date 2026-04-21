import "./create-group.scss";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import BackButton from "../../../ui-kit/icons/BackButton";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "../../../components/loading/Loading";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "../../../context/group/GroupContext";
import {
  createGroup,
  uploadGroupImage,
  updateGroupImage,
} from "../../../services/group.service";
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
                  alt="preview"
                  className="create-group-page__image-preview"
                />
                <div className="create-group-page__image-edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.0001 10.5V19.125C18.0001 19.3712 17.9516 19.615 17.8573 19.8425C17.7631 20.07 17.625 20.2767 17.4509 20.4508C17.2768 20.6249 17.0701 20.763 16.8426 20.8573C16.6151 20.9515 16.3713 21 16.1251 21H4.87506C4.37778 21 3.90087 20.8025 3.54924 20.4508C3.19761 20.0992 3.00006 19.6223 3.00006 19.125V7.875C3.00006 7.37772 3.19761 6.90081 3.54924 6.54917C3.90087 6.19754 4.37778 6 4.87506 6H12.7257" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21.5598 2.49611C21.4913 2.42085 21.4083 2.36025 21.3157 2.31799C21.2231 2.27573 21.1229 2.25267 21.0212 2.25022C20.9195 2.24777 20.8183 2.26596 20.7238 2.30371C20.6293 2.34147 20.5434 2.39798 20.4714 2.46986L19.8915 3.04689C19.8213 3.11721 19.7818 3.21255 19.7818 3.31197C19.7818 3.41138 19.8213 3.50673 19.8915 3.57704L20.4231 4.10767C20.4579 4.14268 20.4994 4.17046 20.545 4.18941C20.5906 4.20837 20.6395 4.21812 20.6889 4.21812C20.7383 4.21812 20.7872 4.20837 20.8328 4.18941C20.8784 4.17046 20.9198 4.14268 20.9547 4.10767L21.52 3.54517C21.8059 3.2597 21.8326 2.7947 21.5598 2.49611ZM18.7192 4.21876L10.2573 12.6656C10.206 12.7167 10.1687 12.7802 10.149 12.8499L9.75762 14.0156C9.74824 14.0473 9.74758 14.0808 9.7557 14.1128C9.76381 14.1448 9.78041 14.174 9.80374 14.1973C9.82707 14.2207 9.85627 14.2373 9.88824 14.2454C9.92022 14.2535 9.9538 14.2528 9.98543 14.2435L11.1503 13.852C11.22 13.8324 11.2834 13.7951 11.3345 13.7438L19.7814 5.28095C19.8595 5.20197 19.9034 5.09534 19.9034 4.98423C19.9034 4.87312 19.8595 4.7665 19.7814 4.68751L19.315 4.21876C19.2359 4.1399 19.1288 4.09562 19.0171 4.09562C18.9054 4.09562 18.7983 4.1399 18.7192 4.21876Z" fill="#666666"/>
                  </svg>
                </div>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.4316 6.96669L15.1838 4.99513C14.9208 4.68856 14.5603 4.49731 14.1563 4.49731H9.84375C9.43969 4.49731 9.07922 4.68856 8.81625 4.99513L7.56844 6.96669C7.30547 7.27372 6.96656 7.49732 6.5625 7.49732H3.75C3.35218 7.49732 2.97064 7.65535 2.68934 7.93666C2.40804 8.21796 2.25 8.59949 2.25 8.99732V17.9973C2.25 18.3951 2.40804 18.7767 2.68934 19.058C2.97064 19.3393 3.35218 19.4973 3.75 19.4973H20.25C20.6478 19.4973 21.0294 19.3393 21.3107 19.058C21.592 18.7767 21.75 18.3951 21.75 17.9973V8.99732C21.75 8.59949 21.592 8.21796 21.3107 7.93666C21.0294 7.65535 20.6478 7.49732 20.25 7.49732H17.4844C17.0789 7.49732 16.6945 7.27372 16.4316 6.96669Z"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.5C14.0711 16.5 15.75 14.8211 15.75 12.75C15.75 10.6789 14.0711 9 12 9C9.92893 9 8.25 10.6789 8.25 12.75C8.25 14.8211 9.92893 16.5 12 16.5Z"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
                <path
                  d="M5.8125 7.40356V6.37231H4.6875V7.40356"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
            <span className="create-group-page__image-error">{imageError}</span>
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
            <span className="create-group-page__error">{errorConnection}</span>
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
