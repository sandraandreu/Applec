import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";
import "./CreateGroup.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "../../feedback/Loading";
import {
  getFirestore,
  doc,
  addDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import app from "../../../plugins/firebase";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "../../../context/group/GroupContext";

const db = getFirestore(app);
interface CreateGroupFormData {
  name: string;
  description: string;
}

const CreateGroup = () => {
  const { t } = useTranslation("groups");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { refreshGroup } = useGroupContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorConnection, setErrorConnection] = useState<string>("");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>();

  const name = watch("name", "");
  const description = watch("description", "");

  const onSubmit = (data: CreateGroupFormData) => {
    handleCreateGroup(data.name, data.description);
  };

  const handleCreateGroup = async (name: string, description: string) => {
    try {
      setIsLoading(true);

      const inviteCode = crypto.randomUUID();

      const groupRef = await addDoc(collection(db, "groups"), {
        name: name,
        description: description,
        inviteCode: inviteCode,
        adminId: user?.uid,
        members: [{ uid: user?.uid, role: "admin" }],
        createdAt: new Date(),
      });

      await updateDoc(doc(db, "users", user!.uid), {
        groupId: groupRef.id,
      });

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

        <Input
          id="group-description"
          label={t("createGroup.description")}
          placeholder={t("createGroup.descriptionPlaceholder")}
          type="text"
          registration={register("description", {
            maxLength: 200,
          })}
          maxLength={200}
          currentLength={description.length}
          error={
            errors.description?.type === "maxLength"
              ? t("createGroup.errors.descriptionTooLong")
              : undefined
          }
        />
        <Button
          text={t("createGroup.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}
      </form>
    </>
  );
};

export default CreateGroup;
