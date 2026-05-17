import { useNavigate } from "react-router-dom";
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
import "./linked-members.scss";

const LinkedMembersPage = () => {
  const { t } = useTranslation("events");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { group, isLoading } = useGroupContext();

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  if (isLoading) return <Loading />;

  const myLinked = (group?.linkedMembers ?? []).filter(
    (lm) => lm.ownerUid === user?.uid
  );

  return (
    <div className="linked-members-page" {...swipeHandlers}>
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
        ) : (
          <div className="linked-members-page__list">
            {myLinked.map((lm) => (
              <MemberCard
                key={lm.id}
                firstName={lm.firstName}
                lastName={lm.lastName}
                relationship={lm.relationship}
                role="member"
                showChevron={false}
                showRole={false}
                onEdit={() => undefined}
              />
            ))}
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
