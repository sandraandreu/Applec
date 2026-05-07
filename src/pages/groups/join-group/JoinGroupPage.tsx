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
import BackButton from "../../../ui-kit/icons/BackButton";
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
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18V18.75C15 19.5457 14.6839 20.3087 14.1213 20.8713C13.5587 21.4339 12.7956 21.75 12 21.75C11.2043 21.75 10.4413 21.4339 9.87867 20.8713C9.31606 20.3087 8.99999 19.5457 8.99999 18.75V18M20.0475 16.4733C18.8437 15 17.9939 14.25 17.9939 10.1883C17.9939 6.46875 16.0945 5.14359 14.5312 4.5C14.3236 4.41469 14.1281 4.21875 14.0648 4.00547C13.7906 3.07219 13.0219 2.25 12 2.25C10.9781 2.25 10.2089 3.07266 9.93749 4.00641C9.87421 4.22203 9.67874 4.41469 9.47108 4.5C7.90593 5.14453 6.00843 6.465 6.00843 10.1883C6.00608 14.25 5.15624 15 3.95249 16.4733C3.45374 17.0836 3.89061 18 4.76296 18H19.2417C20.1094 18 20.5434 17.0808 20.0475 16.4733Z"
                stroke="#0068FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/></svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5.5C12.9283 5.5 13.8185 5.86875 14.4749 6.52513C15.1313 7.1815 15.5 8.07174 15.5 9C15.5 9.92826 15.1313 10.8185 14.4749 11.4749C13.8185 12.1313 12.9283 12.5 12 12.5C11.0717 12.5 10.1815 12.1313 9.52513 11.4749C8.86875 10.8185 8.5 9.92826 8.5 9C8.5 8.07174 8.86875 7.1815 9.52513 6.52513C10.1815 5.86875 11.0717 5.5 12 5.5ZM5 8C5.56 8 6.08 8.15 6.53 8.42C6.38 9.85 6.8 11.27 7.66 12.38C7.16 13.34 6.16 14 5 14C4.20435 14 3.44129 13.6839 2.87868 13.1213C2.31607 12.5587 2 11.7956 2 11C2 10.2044 2.31607 9.44129 2.87868 8.87868C3.44129 8.31607 4.20435 8 5 8ZM19 8C19.7956 8 20.5587 8.31607 21.1213 8.87868C21.6839 9.44129 22 10.2044 22 11C22 11.7956 21.6839 12.5587 21.1213 13.1213C20.5587 13.6839 19.7956 14 19 14C17.84 14 16.84 13.34 16.34 12.38C17.2 11.27 17.62 9.85 17.47 8.42C17.92 8.15 18.44 8 19 8ZM5.5 18.25C5.5 16.18 8.41 14.5 12 14.5C15.59 14.5 18.5 16.18 18.5 18.25V20H5.5V18.25ZM0 20V18.5C0 17.11 1.89 15.94 4.45 15.6C3.86 16.28 3.5 17.22 3.5 18.25V20H0ZM24 20H20.5V18.25C20.5 17.22 20.14 16.28 19.55 15.6C22.11 15.94 24 17.11 24 18.5V20Z"
                      fill="#4C4C4C"
                    />
                  </svg>
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
