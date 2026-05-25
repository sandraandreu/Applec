import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { editLinkedMember, deleteLinkedMember } from "../../../services/linked-member.service";
import PageHeader from "../../../components/layout/PageHeader";
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
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { group, refreshGroup } = useGroupContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorConnection, setErrorConnection] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteState, setDeleteState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditLinkedMemberFormData>();

  useEffect(() => {
    if (!id || !group) return;
    const linked = group.linkedMembers.find((linkedMember) => linkedMember.id === id);
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
    navigate("/members/linked", { replace: true });
  };

  const handleDiscard = () => navigate("/members/linked", { replace: true });

  const onSubmit = async (data: EditLinkedMemberFormData) => {
    if (!profile?.groupId || !user?.uid || !id) return;
    try {
      setIsLoading(true);
      await editLinkedMember(profile.groupId, id, user.uid, data);
      await refreshGroup();
      navigate("/members/linked", { replace: true, state: { linkedMemberUpdated: true } });
    } catch {
      setErrorConnection(t("linked.editError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile?.groupId || !user?.uid || !id) return;
    const linked = group?.linkedMembers.find((linkedMember) => linkedMember.id === id);
    if (!linked) return;
    setDeleteState({ isLoading: true, error: null });
    try {
      await deleteLinkedMember(profile.groupId, id, user.uid, {
        firstName: linked.firstName,
        lastName: linked.lastName,
        relationship: linked.relationship,
      });
      await refreshGroup();
      navigate("/members/linked", { replace: true });
    } catch {
      setDeleteState({ isLoading: false, error: t("linked.deleteError") });
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
        <PageHeader title={t("linked.editTitle")} onBack={handleBack} />
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
              error={errors.firstName?.type === "required" ? tCommon("errors.required") : undefined}
            />
            <Input
              label={t("linked.lastName")}
              id="edit-linked-last-name"
              placeholder={t("linked.lastNamePlaceholder")}
              required
              registration={register("lastName", { required: true })}
              error={errors.lastName?.type === "required" ? tCommon("errors.required") : undefined}
            />
            <Input
              label={t("linked.relationship")}
              id="edit-linked-relationship"
              placeholder={t("linked.relationshipPlaceholder")}
              required
              registration={register("relationship", { required: true })}
              error={errors.relationship?.type === "required" ? tCommon("errors.required") : undefined}
            />
          </div>

          {(errorConnection || deleteState.error) && (
            <span className="edit-linked-member-page__error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection || deleteState.error}
            </span>
          )}

          <button
            type="button"
            className="edit-linked-member-page__delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            {t("linked.deleteBtn")}
          </button>

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
        header={tCommon("discard.title")}
        message={tCommon("discard.message")}
        onDismiss={() => setShowDiscardModal(false)}
        buttons={[
          { text: tCommon("buttons.cancel"), role: "cancel" },
          { text: tCommon("discard.confirm"), role: "danger", handler: handleDiscard },
        ]}
      />

      <Modal
        isOpen={showDeleteModal}
        header={t("linked.deleteConfirm")}
        message={t("linked.deleteMessage")}
        onDismiss={() => setShowDeleteModal(false)}
        buttons={[
          { text: tCommon("buttons.cancel"), role: "cancel" },
          { text: t("linked.deleteSubmit"), role: "danger", handler: handleDelete },
        ]}
      />
      {deleteState.isLoading && <Loading />}
    </div>
  );
};

export default EditLinkedMemberPage;
