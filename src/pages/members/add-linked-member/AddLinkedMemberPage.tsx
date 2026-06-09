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
import ToggleRow from "../../../ui-kit/toggle-row/ToggleRow";
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

interface PendingMember extends AddLinkedMemberFormData {
  id: string;
  isFallero: boolean;
}

const AddLinkedMemberPage = () => {
  const { t } = useTranslation("events");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;
  const { user, profile } = useAuthContext();
  const { refreshGroup } = useGroupContext();

  const [isFallero, setIsFallero] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorConnection, setErrorConnection] = useState("");
  const [queue, setQueue] = useState<PendingMember[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AddLinkedMemberFormData>({
    defaultValues: { firstName: "", lastName: "", relationship: "" },
  });

  const { firstName: wFirst, lastName: wLast, relationship: wRel } = watch();
  const isFormEmpty = !wFirst && !wLast && !wRel;

  const handleBack = (keepSheetState = false) => {
    if (locationState.returnTo) {
      navigate(locationState.returnTo, {
        replace: true,
        state: keepSheetState && locationState.openVoteSheet ? { openVoteSheet: true } : null,
      });
    } else {
      navigate(-1);
    }
  };

  const saveAll = async (members: PendingMember[]) => {
    const groupId = profile?.groupId;
    const uid = user?.uid;
    if (!groupId || !uid) return;
    setIsLoading(true);
    setErrorConnection("");
    try {
      await Promise.all(
        members.map(member =>
          addLinkedMember(groupId, uid, {
            firstName: member.firstName,
            lastName: member.lastName,
            relationship: member.relationship,
            type: member.isFallero ? "fallero" : "extern",
          })
        )
      );
      await refreshGroup();
      handleBack(true);
    } catch {
      setErrorConnection(t("linked.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToQueue = handleSubmit((data) => {
    setQueue(prev => [...prev, { id: Date.now().toString(), ...data, isFallero }]);
    reset();
    setIsFallero(true);
    setErrorConnection("");
  });

  const handleSave = async () => {
    if (isFormEmpty) {
      if (queue.length > 0) {
        await saveAll(queue);
      } else {
        await trigger();
      }
      return;
    }
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      await saveAll([...queue, { id: "current", ...values, isFallero }]);
    }
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(m => m.id !== id));
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => handleBack(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  return (
    <div className="add-linked-member-page" {...swipeHandlers}>
      {isLoading && <Loading />}

      <div className="add-linked-member-page__gradient-zone">
        <div className="add-linked-member-page__top-bar">
          <BackButton onClick={() => handleBack()} />
        </div>
        <div className="add-linked-member-page__header">
          <h1 className="add-linked-member-page__title">{t("linked.title")}</h1>
          <p className="add-linked-member-page__description">{t("linked.description")}</p>
        </div>
      </div>

      <div className="add-linked-member-page__content">
        <div className="add-linked-member-page__form">

          {queue.length > 0 && (
            <div className="add-linked-member-page__queue">
              <span className="add-linked-member-page__queue-label">{t("linked.pendingLabel")}</span>
              <ul className="add-linked-member-page__queue-list">
                {queue.map(member => (
                  <li key={member.id} className="add-linked-member-page__queue-item">
                    <span className="add-linked-member-page__queue-item-info">
                      <span className="add-linked-member-page__queue-item-name">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="add-linked-member-page__queue-item-rel">
                        {member.relationship}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="add-linked-member-page__queue-item-remove"
                      aria-label={t("linked.removeFromQueue")}
                      onClick={() => removeFromQueue(member.id)}
                    >
                      <Icon name="x-mark" size={24} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="add-linked-member-page__fields">
            <Input
              label={t("linked.firstName")}
              id="linked-first-name"
              required
              registration={register("firstName", { required: true })}
              error={errors.firstName?.type === "required" ? tCommon("errors.required") : undefined}
            />
            <Input
              label={t("linked.lastName")}
              id="linked-last-name"
              required
              registration={register("lastName", { required: true })}
              error={errors.lastName?.type === "required" ? tCommon("errors.required") : undefined}
            />
            <Input
              label={t("linked.relationship")}
              id="linked-relationship"
              placeholder={t("linked.relationshipPlaceholder")}
              required
              registration={register("relationship", { required: true })}
              error={errors.relationship?.type === "required" ? tCommon("errors.required") : undefined}
            />
          </div>

          <div className="add-linked-member-page__toggle-section">
            <ToggleRow
              label={t("linked.belongsToFalla")}
              checked={isFallero}
              onChange={setIsFallero}
            />
          </div>

          {errorConnection && (
            <span className="inline-error">
              <Icon name="error-circle" size={24} className="icon" />
              {errorConnection}
            </span>
          )}
        </div>
      </div>

      <div className="add-linked-member-page__actions">
        <Button
          variant="primary"
          text={t("linked.save")}
          type="button"
          onClick={handleSave}
          isLoading={isLoading}
          disabled={isFormEmpty && queue.length === 0}
        />
        <Button
          variant="secondary"
          text={t("linked.addAnother")}
          type="button"
          onClick={handleAddToQueue}
          disabled={isFormEmpty}
        />
      </div>
    </div>
  );
};

export default AddLinkedMemberPage;
