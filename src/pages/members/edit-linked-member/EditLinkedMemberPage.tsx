import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { editLinkedMember } from "../../../services/linked-member.service";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Button from "../../../ui-kit/button/Button";
import Input from "../../../ui-kit/input/Input";
import Loading from "../../../components/loading/Loading";
import Modal from "../../../components/modal/Modal";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./edit-linked-member.scss";

interface EditLinkedMemberFormData {
  firstName: string;
  lastName: string;
  relationship: string;
}

const EditLinkedMemberPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("events");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { group, refreshGroup } = useGroupContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorConnection, setErrorConnection] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditLinkedMemberFormData>();

  useEffect(() => {
    if (!id || !group) return;
    const linked = group.linkedMembers.find((lm) => lm.id === id);
    if (!linked) {
      navigate("/members/linked", { replace: true });
      return;
    }
    reset({
      firstName: linked.firstName,
      lastName: linked.lastName,
      relationship: linked.relationship,
    });
  }, [id, group, reset, navigate]);

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardModal(true);
      return;
    }
    navigate("/members/linked");
  };

  const handleDiscard = () => navigate("/members/linked");

  const onSubmit = async (data: EditLinkedMemberFormData) => {
    if (!profile?.groupId || !user?.uid || !id) return;
    try {
      setIsLoading(true);
      await editLinkedMember(profile.groupId, id, user.uid, data);
      await refreshGroup();
      navigate("/members/linked");
    } catch {
      setErrorConnection(t("linked.editError"));
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
    <div className="edit-linked-member-page" {...swipeHandlers}>
      {isLoading && <Loading />}

      <div className="edit-linked-member-page__gradient-zone">
        <div className="edit-linked-member-page__top-bar">
          <BackButton onClick={handleBack} />
          <h1 className="edit-linked-member-page__title">{t("linked.editTitle")}</h1>
        </div>
      </div>

      <div className="edit-linked-member-page__content">
        <form
          className="edit-linked-member-page__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="edit-linked-member-page__fields">
            <Input
              label={t("linked.firstName")}
              id="edit-linked-first-name"
              placeholder={t("linked.firstNamePlaceholder")}
              required
              registration={register("firstName", { required: true })}
              error={errors.firstName?.type === "required" ? tc("errors.required") : undefined}
            />
            <Input
              label={t("linked.lastName")}
              id="edit-linked-last-name"
              placeholder={t("linked.lastNamePlaceholder")}
              required
              registration={register("lastName", { required: true })}
              error={errors.lastName?.type === "required" ? tc("errors.required") : undefined}
            />
            <Input
              label={t("linked.relationship")}
              id="edit-linked-relationship"
              placeholder={t("linked.relationshipPlaceholder")}
              required
              registration={register("relationship", { required: true })}
              error={errors.relationship?.type === "required" ? tc("errors.required") : undefined}
            />
          </div>

          {errorConnection && (
            <span className="edit-linked-member-page__error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection}
            </span>
          )}

          {isDirty && (
            <div className="edit-linked-member-page__actions">
              <Button
                variant="primary"
                text={t("linked.editSave")}
                type="submit"
                disabled={Object.keys(errors).length > 0}
                isLoading={isLoading}
              />
            </div>
          )}
        </form>
      </div>

      <Modal
        isOpen={showDiscardModal}
        header={tc("discard.title")}
        message={tc("discard.message")}
        onDismiss={() => setShowDiscardModal(false)}
        buttons={[
          { text: tc("buttons.cancel"), role: "cancel" },
          { text: tc("discard.confirm"), role: "danger", handler: handleDiscard },
        ]}
      />
    </div>
  );
};

export default EditLinkedMemberPage;
