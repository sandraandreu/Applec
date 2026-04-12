import { useTranslation } from "react-i18next";
import "./JoinGroup.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../feedback/Loading";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import { FirebaseError } from "firebase/app";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useNavigate } from "react-router-dom";
import {
  findGroupByInviteCode,
  addMemberToGroup,
} from "../../../services/group.service";
import { updateUserGroup } from "../../../services/user.service";

interface JoinGroupFormData {
  code: string;
}

const JoinGroup = () => {
  const { t } = useTranslation("groups");
  const { t: tc } = useTranslation("common");
  const { user, userName, fullName } = useAuthContext();
  const { refreshGroup } = useGroupContext();
  const navigate = useNavigate();

  const [groupFound, setGroupFound] = useState<{
    id: string;
    name: string;
    description: string;
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

      await addMemberToGroup(
        groupFound!.id,
        user!.uid,
        userName ?? "",
        fullName ?? "",
        user!.email ?? "",
      );
      await updateUserGroup(user!.uid, groupFound!.id);
      await refreshGroup();
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === "unavailable") {
        setErrorConnection(tc("errors.noConnection"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("joinGroup.title")}</h1>

      {!groupFound ? (
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button
            text={t("joinGroup.button")}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
          />

          {errorConnection && <span>{errorConnection}</span>}
        </form>
      ) : (
        <div>
          <h2>{t("joinGroup.groupFound")}</h2>
          <p>{groupFound.name}</p>
          <p>{groupFound.description}</p>
          <Button
            text={t("joinGroup.joinButton")}
            onClick={handleJoin}
            isLoading={isLoading}
          />
          <Button text={tc("cancel")} onClick={() => setGroupFound(null)} />
        </div>
      )}
    </>
  );
};

export default JoinGroup;
