import "./join-group.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../../components/loading/Loading";
import Input from "../../../ui-kit/input/Input";
import Button from "../../../ui-kit/button/Button";
import { isFirebaseError } from "../../../utils/firebase-errors";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  findGroupByInviteCode,
  sendJoinRequest,
} from "../../../services/group.service";
import { updateUserFields } from "../../../services/user.service";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Icon from "../../../ui-kit/icons/icon/Icon";
import joinRequestIllustration from "../../../assets/images/join-request-illustration.png";

interface JoinGroupFormData {
  code: string;
}

const JoinGroupPage = () => {
  const { t } = useTranslation("groups");
  const { t: tCommon } = useTranslation("common");
  const { user, profile, refreshProfile } = useAuthContext();
  const navigate = useNavigate();

  const [groupFound, setGroupFound] = useState<{
    id: string;
    name: string;
    imageUrl?: string;
  } | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [submitState, setSubmitState] = useState({ isLoading: false, errorConnection: "", errorCode: "" });

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
      setSubmitState({ isLoading: true, errorConnection: "", errorCode: "" });
      setGroupFound(null);

      const group = await findGroupByInviteCode(code);

      if (!group) {
        setSubmitState(prev => ({ ...prev, errorCode: t("joinGroup.errors.codeNotFound") }));
        return;
      }

      setGroupFound(group);
    } catch (error: unknown) {
      if (isFirebaseError(error) && error.code === "unavailable") {
        setSubmitState(prev => ({ ...prev, errorConnection: tCommon("errors.noConnection") }));
      }
    } finally {
      setSubmitState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSendRequest = async () => {
    if (!user || !groupFound || !profile) return;
    try {
      setSubmitState({ isLoading: true, errorConnection: "", errorCode: "" });
      await sendJoinRequest(groupFound.id, user.uid, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email ?? "",
      });
      await updateUserFields(user.uid, { pendingJoinGroupId: groupFound.id });
      await refreshProfile();
      setRequestSent(true);
    } catch {
      setSubmitState(prev => ({ ...prev, errorConnection: t("joinGroup.errors.sendError") }));
    } finally {
      setSubmitState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (requestSent) {
    return (
      <div className="join-group-page join-group-page--sent">
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
            src={joinRequestIllustration}
            alt=""
            aria-hidden="true"
            className="join-group-page__pending-illustration"
          />
          <Button
            text={t("joinGroup.requestSent.button")}
            onClick={() => navigate("/onboarding/group", { replace: true })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="join-group-page">
      {submitState.isLoading && <Loading />}

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
                    : submitState.errorCode
                      ? submitState.errorCode
                      : undefined
                }
              />

              {submitState.errorConnection && (
                <span className="join-group-page__error inline-error">
                  <Icon name="error-circle" size={24} className="icon" />
                  {submitState.errorConnection}
                </span>
              )}

              <div className="join-group-page__button">
                <Button
                  text={t("joinGroup.button")}
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  isLoading={submitState.isLoading}
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
                isLoading={submitState.isLoading}
              />
              <Button
                variant="secondary"
                text={tCommon("buttons.cancel")}
                onClick={() => setGroupFound(null)}
              />
            </div>
            {submitState.errorConnection && (
              <span className="join-group-page__error inline-error">
                <Icon name="error-circle" size={24} className="icon" />
                {submitState.errorConnection}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
