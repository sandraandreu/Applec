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
import { updateUserGroup, updateUserRole } from "../../../services/user.service";
import BackButton from "../../../ui-kit/icons/BackButton";

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
  } | null>(null);
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

  const handleJoin = async () => {
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

  return (
    <div className="join-group-page">
      {isLoading && <Loading />}

      <BackButton />

      <div className="join-group-page__content">
        <div className="join-group-page__header">
          <h1 className="join-group-page__title">{t("joinGroup.title")}</h1>
          <p className="join-group-page__description">
            {t("joinGroup.subtitle")}
          </p>
        </div>

        {!groupFound ? (
          <form
            className="join-group-page__form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              id="code"
              label={t("joinGroup.code")}
              placeholder={t("joinGroup.codePlaceholder")}
              type="text"
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
              <span className="join-group-page__error">{errorConnection}</span>
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
        ) : (
          <div>
            <h2>{t("joinGroup.groupFound")}</h2>
            <p>{groupFound.name}</p>
            <Button
              text={t("joinGroup.joinButton")}
              onClick={handleJoin}
              isLoading={isLoading}
            />
            <Button text={tc("cancel")} onClick={() => setGroupFound(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
