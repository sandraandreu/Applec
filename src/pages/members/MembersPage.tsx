import "./members.scss";
import Search from "../../ui-kit/search/Search";
import MembersList from "../../components/members/MembersList";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../context/group/GroupContext";

const MembersPage = () => {
  const { t } = useTranslation("members");
  const { group } = useGroupContext();

  const [searchValue, setSearchValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "admin" | "organizer" | "member"
  >("all");

  const adminCount =
    group?.members.filter((m) => m.role === "admin").length ?? 0;
  const organizerCount =
    group?.members.filter((m) => m.role === "organizer").length ?? 0;
  const memberCount =
    group?.members.filter((m) => m.role === "member").length ?? 0;
  const totalCount = group?.members.length ?? 0;

  return (
    <div className="members-page">
        <h1 className="members-page__title">{t("members.title")}</h1>

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

        <Search
          placeholder={t("members.search")}
          onChange={(value) => setSearchValue(value)}
        />

        <MembersList searchValue={searchValue} activeFilter={activeFilter} />
    </div>
  );
};

export default MembersPage;
