import { useMemo } from "react";
import "./members.scss";
import { useGroupContext } from "../../context/group/GroupContext";
import MemberCard from "./MemberCard";
import { useTranslation } from "react-i18next";
import Button from "../../ui-kit/button/Button";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";

interface MembersListProps {
  searchValue: string;
  activeFilter: "all" | "admin" | "organizer" | "member";
}

const MembersList = ({ searchValue, activeFilter }: MembersListProps) => {
  const { t } = useTranslation("members");
  const navigate = useNavigate();
  const { group, isLoading } = useGroupContext();

  const filteredMembers = useMemo(() => group?.members.filter((member) => {
    const matchesSearch = member.username?.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === "all" || member.role === activeFilter;
    return matchesSearch && matchesFilter;
  }) ?? [], [group?.members, searchValue, activeFilter]);

  const admins = useMemo(() => filteredMembers.filter((m) => m.role === "admin"), [filteredMembers]);
  const organizers = useMemo(() => filteredMembers.filter((m) => m.role === "organizer"), [filteredMembers]);
  const members = useMemo(() => filteredMembers.filter((m) => m.role === "member"), [filteredMembers]);

  const isOnlyMember = group?.members.length === 1;

  if (isLoading) return <Loading message={t("members.loading")} />;

  if (isOnlyMember) {
    return (
      <div>
        <p className="members-list__empty">{t("members.onlyMember")}</p>
        <Button
          text={t("members.invite")}
          onClick={() => navigate("/invite-group")}
        />
      </div>
    );
  }

  if (filteredMembers.length === 0) {
    return <p className="members-list__empty">{searchValue ? t("members.emptySearch") : activeFilter !== "all" ? t("members.emptyFilter") : t("members.onlyMember")}</p>;
  }

  return (
    <div className="members-list">
      {admins.length > 0 && (
        <div>
          <h2 className="members-list__section-title">
            {t("members.roles.admin")}
          </h2>
          <div className="members-list__cards">
            {admins.map((member) => (
              <MemberCard
                key={member.uid}
                firstName={member.firstName}
                lastName={member.lastName}
                email={member.email}
                role={member.role}
              />
            ))}
          </div>
        </div>
      )}

      {organizers.length > 0 && (
        <div>
          <h2 className="members-list__section-title">
            {t("members.roles.organizers")}
          </h2>
          <div className="members-list__cards">
            {organizers.map((member) => (
              <MemberCard
                key={member.uid}
                firstName={member.firstName}
                lastName={member.lastName}
                email={member.email}
                role={member.role}
              />
            ))}
          </div>
        </div>
      )}

      {members.length > 0 && (
        <div>
          <h2 className="members-list__section-title">
            {t("members.roles.members")}
          </h2>
          <div className="members-list__cards">
            {members.map((member) => (
              <MemberCard
                key={member.uid}
                firstName={member.firstName}
                lastName={member.lastName}
                email={member.email}
                role={member.role}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;
