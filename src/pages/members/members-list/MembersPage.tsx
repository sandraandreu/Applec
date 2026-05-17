import "./members-list.scss";
import Search from "../../../ui-kit/search/Search";
import MembersList from "../../../components/members/MembersList";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Button from "../../../ui-kit/button/Button";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const MembersPage = () => {
  const { t } = useTranslation("members");
  const { group } = useGroupContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "admin" | "organizer" | "member"
  >("all");
  const locationState = (location.state ?? {}) as { roleUpdated?: boolean; memberDeleted?: boolean };
  const [showRoleUpdated, setShowRoleUpdated] = useState(!!locationState.roleUpdated);
  const [showMemberDeleted, setShowMemberDeleted] = useState(!!locationState.memberDeleted);

  const { adminCount, organizerCount, memberCount, totalCount } = useMemo(() => ({
    adminCount: group?.members.filter((m) => m.role === "admin").length ?? 0,
    organizerCount: group?.members.filter((m) => m.role === "organizer").length ?? 0,
    memberCount: group?.members.filter((m) => m.role === "member").length ?? 0,
    totalCount: group?.members.length ?? 0,
  }), [group?.members]);

  return (
    <div className="members-page">
        {showRoleUpdated && (
          <SuccessBanner message={t("detail.roleUpdated")} onDismiss={() => setShowRoleUpdated(false)} />
        )}
        {showMemberDeleted && (
          <SuccessBanner message={t("detail.memberDeleted")} onDismiss={() => setShowMemberDeleted(false)} />
        )}
        <div className="members-page__top">
          <div className="members-page__title-row">
            <h1 className="members-page__title">{t("members.title")}</h1>
            {user?.permissions.canInviteMembers && (
              <Button
                variant="secondary"
                className="button--compact"
                text={t("members.invite")}
                onClick={() => navigate("/invite-group")}
              />
            )}
          </div>

          <div className="members-page__filters">
          <button
            className={`members-page__filter-btn${activeFilter === "all" ? " members-page__filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {t("members.filters.all")} {totalCount}
          </button>
          <button
            className={`members-page__filter-btn${activeFilter === "admin" ? " members-page__filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("admin")}
          >
            {t("members.roles.admin")} {adminCount}
          </button>
          <button
            className={`members-page__filter-btn${activeFilter === "organizer" ? " members-page__filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("organizer")}
          >
            {t("members.roles.organizers")} {organizerCount}
          </button>
          <button
            className={`members-page__filter-btn${activeFilter === "member" ? " members-page__filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("member")}
          >
            {t("members.roles.members")} {memberCount}
          </button>
        </div>
        </div>

        <Search
          placeholder={t("members.search")}
          onChange={(value) => setSearchValue(value)}
        />

        <MembersList searchValue={searchValue} activeFilter={activeFilter} />
    </div>
  );
};

export default MembersPage;
