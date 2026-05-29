import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Button from "../../../ui-kit/button/Button";
import MemberCard from "../../../components/members/MemberCard";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Loading from "../../../components/loading/Loading";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import "./linked-members.scss";

const LinkedMembersPage = () => {
  const { t } = useTranslation("events");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { group, isLoading } = useGroupContext();

  const [showUpdated, setShowUpdated] = useState(
    !!(location.state as { linkedMemberUpdated?: boolean } | null)?.linkedMemberUpdated
  );

  useLayoutEffect(() => {
    if (showUpdated) navigate(location.pathname, { replace: true, state: null });
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  if (isLoading) return <Loading />;

  const myLinked = (group?.linkedMembers ?? []).filter(
    (linkedMember) => linkedMember.ownerUid === user?.uid
  );
  const falleroLinked = myLinked.filter((lm) => (lm.type ?? "fallero") === "fallero");
  const externLinked = myLinked.filter((lm) => lm.type === "extern");
  const hasBothTypes = falleroLinked.length > 0 && externLinked.length > 0;

  const renderCard = (linkedMember: typeof myLinked[number]) => (
    <MemberCard
      key={linkedMember.id}
      firstName={linkedMember.firstName}
      lastName={linkedMember.lastName}
      relationship={linkedMember.relationship}
      role="member"
      showChevron={false}
      showRole={false}
      onEdit={() => navigate(`/members/linked/${linkedMember.id}/edit`)}
    />
  );

  return (
    <div className="linked-members-page" {...swipeHandlers}>
      {showUpdated && (
        <SuccessBanner message={t("linked.editSuccess")} onDismiss={() => setShowUpdated(false)} />
      )}
      <div className="linked-members-page__gradient-zone">
        <div className="linked-members-page__top-bar">
          <BackButton />
        </div>
        <div className="linked-members-page__header">
          <h1 className="linked-members-page__title">{t("linked.myTitle")}</h1>
          <p className="linked-members-page__description">{t("linked.myDescription")}</p>
        </div>
      </div>

      <div className="linked-members-page__content">
        {myLinked.length === 0 ? (
          <EmptyState title={t("linked.empty")} variant="light" expand />
        ) : hasBothTypes ? (
          <div className="linked-members-page__list">
            <div className="linked-members-page__section">
              <p className="linked-members-page__section-label">{t("linked.typeFallero")}</p>
              {falleroLinked.map(renderCard)}
            </div>
            <div className="linked-members-page__section">
              <p className="linked-members-page__section-label">{t("linked.typeExtern")}</p>
              {externLinked.map(renderCard)}
            </div>
          </div>
        ) : (
          <div className="linked-members-page__list">
            {myLinked.map(renderCard)}
          </div>
        )}

        <Button
          variant="linked"
          text={t("linked.addButton")}
          icon={<Icon name="plus" size={20} />}
          onClick={() => navigate("/members/linked/new")}
        />
      </div>
    </div>
  );
};

export default LinkedMembersPage;
