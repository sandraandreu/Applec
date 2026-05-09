import "./join-group.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../../components/loading/Loading";
import Input from "../../../ui-kit/input/Input";
import Button from "../../../ui-kit/button/Button";
import { FirebaseError } from "firebase/app";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useNavigate } from "react-router-dom";
import {
  findGroupByInviteCode,
  addMemberToGroup,
} from "../../../services/group.service";
import {
  updateUserGroup,
  updateUserRole,
} from "../../../services/user.service";
import BackButton from "../../../ui-kit/buttons/icon-buttons/back-button/BackButton";
import Icon from "../../../ui-kit/icons/icon/Icon";
import requestPendingIllustration from "../../../assets/images/request-pending-illustration.png";

interface JoinGroupFormData {
  code: string;
}

const JoinGroupPage = () => {
  const { t } = useTranslation("groups");
  const { t: tc } = useTranslation("common");
  const { user, profile, refreshProfile } = useAuthContext();
  const { refreshGroup } = useGroupContext();
  const navigate = useNavigate();

  const [groupFound, setGroupFound] = useState<{
    id: string;
    name: string;
    imageUrl?: string;
  } | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorConnection, setErrorConnection] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGroupFormData>();

  const onSubmit = (data: JoinGroupFormData) => {
    handleSearch(data.code);
  };

  const handleSearch = async (code: string) => {
    try {
      setIsLoading(true);
      setErrorCode("");
      setGroupFound(null);

      const group = await findGroupByInviteCode(code);

      if (!group) {
        setErrorCode(t("joinGroup.errors.codeNotFound"));
        return;
      }

      setGroupFound(group);
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === "unavailable") {
        setErrorConnection(tc("errors.noConnection"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = () => {
    setRequestSent(true);
  };

  // TODO T14: replace with actual request logic (send join request, wait for admin approval)
  const handleConfirmJoin = async () => {
    try {
      setIsLoading(true);

      await Promise.all([
        addMemberToGroup(
          groupFound!.id,
          user!.uid,
          profile?.username ?? "",
          profile?.firstName ?? "",
          profile?.lastName ?? "",
          user!.email ?? "",
        ),
        updateUserGroup(user!.uid, groupFound!.id),
        updateUserRole(user!.uid, "member"),
      ]);
      await Promise.all([refreshGroup(), refreshProfile()]);
      navigate("/events");
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === "unavailable") {
        setErrorConnection(tc("errors.noConnection"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (requestSent) {
    return (
      <div className="join-group-page join-group-page--sent">
        {isLoading && <Loading />}
        <div className="join-group-page__pending">
          <div className="join-group-page__pending-header">
            <h1 className="join-group-page__pending-title">
              {t("joinGroup.requestSent.title")}
            </h1>
            <p className="join-group-page__pending-subtitle">
              {t("joinGroup.requestSent.subtitle")}
            </p>
          </div>
          <img
            src={requestPendingIllustration}
            alt=""
            aria-hidden="true"
            className="join-group-page__pending-illustration"
          />
          <div className="join-group-page__pending-notice">
            <Icon name="bell" size={24} className="icon" />
            <p className="join-group-page__pending-notice-text">
              {t("joinGroup.requestSent.notice")}
            </p>
          </div>
          <Button
            text={t("joinGroup.requestSent.button")}
            onClick={handleConfirmJoin}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="join-group-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="join-group-page__content">
        {!groupFound ? (
          <>
            <div className="join-group-page__header">
              <h1 className="join-group-page__title">{t("joinGroup.title")}</h1>
              <p className="join-group-page__description">
                {t("joinGroup.subtitle")}
              </p>
            </div>

            <form
              className="join-group-page__form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                id="code"
                label={t("joinGroup.code")}
                placeholder={t("joinGroup.codePlaceholder")}
                type="text"
                required
                registration={register("code", { required: true })}
                error={
                  errors.code?.type === "required"
                    ? t("joinGroup.errors.codeRequired")
                    : errorCode
                      ? errorCode
                      : undefined
                }
              />

              {errorConnection && (
                <span className="join-group-page__error">
                  <Icon name="error-circle" size={24} className="icon" />
                  {errorConnection}
                </span>
              )}

              <div className="create-group-page__button">
                <Button
                  text={t("joinGroup.button")}
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  isLoading={isLoading}
                />
              </div>
            </form>
          </>
        ) : (
          <div className="join-group-page__result">
            <h2 className="join-group-page__found-label">
              {t("joinGroup.groupFound")}
            </h2>
            <div className="join-group-page__card">
              <div className="join-group-page__avatar">
                {groupFound.imageUrl ? (
                  <img
                    src={groupFound.imageUrl}
                    alt={groupFound.name}
                    className="join-group-page__avatar-photo"
                  />
                ) : (
                  <Icon name="users" size={40} />
                )}
              </div>
              <p className="join-group-page__group-name">{groupFound.name}</p>
            </div>
            <div className="join-group-page__actions">
              <Button
                text={t("joinGroup.joinButton")}
                onClick={handleSendRequest}
              />
              <Button
                text={tc("buttons.cancel")}
                onClick={() => setGroupFound(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
