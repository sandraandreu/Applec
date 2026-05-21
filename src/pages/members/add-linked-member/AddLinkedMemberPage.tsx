import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { addLinkedMember } from "../../../services/linked-member.service";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import Loading from "../../../components/loading/Loading";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./add-linked-member.scss";

interface LocationState {
  returnTo?: string;
  openVoteSheet?: boolean;
}

interface AddLinkedMemberFormData {
  firstName: string;
  lastName: string;
  relationship: string;
}

const AddLinkedMemberPage = () => {
  const { t } = useTranslation("events");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;
  const { user, profile } = useAuthContext();
  const { refreshGroup } = useGroupContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorConnection, setErrorConnection] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLinkedMemberFormData>();

  const handleBack = () => {
    if (locationState.returnTo) {
      navigate(locationState.returnTo, {
        state: locationState.openVoteSheet ? { openVoteSheet: true } : null,
      });
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (data: AddLinkedMemberFormData) => {
    if (!profile?.groupId || !user?.uid) return;
    try {
      setIsLoading(true);
      await addLinkedMember(profile.groupId, user.uid, data);
      await refreshGroup();
      handleBack();
    } catch {
      setErrorConnection(t("linked.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: handleBack,
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  return (
    <div className="add-linked-member-page" {...swipeHandlers}>
      {isLoading && <Loading />}

      <div className="add-linked-member-page__gradient-zone">
        <div className="add-linked-member-page__top-bar">
          <BackButton onClick={handleBack} />
        </div>
        <div className="add-linked-member-page__header">
          <h1 className="add-linked-member-page__title">{t("linked.title")}</h1>
          <p className="add-linked-member-page__description">{t("linked.description")}</p>
        </div>
      </div>

      <div className="add-linked-member-page__content">
        <form
          className="add-linked-member-page__fields"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label={t("linked.firstName")}
            id="linked-first-name"
            placeholder={t("linked.firstNamePlaceholder")}
            required
            registration={register("firstName", { required: true })}
            error={errors.firstName?.type === "required" ? tc("errors.required") : undefined}
          />
          <Input
            label={t("linked.lastName")}
            id="linked-last-name"
            placeholder={t("linked.lastNamePlaceholder")}
            required
            registration={register("lastName", { required: true })}
            error={errors.lastName?.type === "required" ? tc("errors.required") : undefined}
          />
          <Input
            label={t("linked.relationship")}
            id="linked-relationship"
            placeholder={t("linked.relationshipPlaceholder")}
            required
            registration={register("relationship", { required: true })}
            error={errors.relationship?.type === "required" ? tc("errors.required") : undefined}
          />

          {errorConnection && (
            <span className="add-linked-member-page__error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection}
            </span>
          )}

          <div className="add-linked-member-page__actions">
            <Button
              variant="secondary"
              text={t("linked.cancel")}
              onClick={handleBack}
            />
            <Button
              variant="primary"
              text={t("linked.save")}
              type="submit"
              disabled={Object.keys(errors).length > 0}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkedMemberPage;
