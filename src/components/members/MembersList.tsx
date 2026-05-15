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

const ROLE_ORDER = ["admin", "organizer", "member"] as const;
type MemberRole = typeof ROLE_ORDER[number];

const MembersList = ({ searchValue, activeFilter }: MembersListProps) => {
  const { t } = useTranslation("members");
  const navigate = useNavigate();
  const { group, isLoading } = useGroupContext();

  const filteredMembers = useMemo(() => group?.members.filter((member) => {
    const matchesSearch = member.username?.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === "all" || member.role === activeFilter;
    return matchesSearch && matchesFilter;
  }) ?? [], [group?.members, searchValue, activeFilter]);

  const membersByRole = useMemo(() =>
    filteredMembers.reduce<Record<MemberRole, typeof filteredMembers>>(
      (acc, member) => {
        acc[member.role].push(member);
        return acc;
      },
      { admin: [], organizer: [], member: [] }
    ),
    [filteredMembers]
  );

  const roleLabels: Record<MemberRole, string> = {
    admin: t("members.roles.admin"),
    organizer: t("members.roles.organizers"),
    member: t("members.roles.members"),
  };

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
      {ROLE_ORDER.map(role => {
        if (membersByRole[role].length === 0) return null;
        return (
          <div key={role}>
            <h2 className="members-list__section-title">{roleLabels[role]}</h2>
            <div className="members-list__cards">
              {membersByRole[role].map((member) => (
                <MemberCard
                  key={member.uid}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                  role={member.role}
                  onClick={() => navigate(`/members/${member.uid}`)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersList;
