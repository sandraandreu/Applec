import { useMemo } from "react";
import "./members.scss";
import { useGroupContext } from "../../context/group/GroupContext";
import { useAuthContext } from "../../context/auth/AuthContext";
import MemberCard from "./MemberCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import EmptyState from "../../ui-kit/empty-state/EmptyState";

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
  const { user } = useAuthContext();

  const filteredMembers = useMemo(() => group?.members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchValue.toLowerCase()) || member.firstName.toLowerCase().includes(searchValue.toLowerCase());
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

  const isOnlyMember = (group?.members.length ?? 0) === 1 && activeFilter === "all" && searchValue === "";

  if (isLoading) return <Loading message={t("members.loading")} />;

  return (
    <div className="members-list">
      {filteredMembers.length === 0 ? (
        <EmptyState
          title={searchValue ? t("members.emptySearch") : t("members.emptyFilter")}
          variant="light"
          expand
        />
      ) : (
        ROLE_ORDER.map(role => {
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
                    email={user?.permissions.canViewMemberEmail ? member.email : undefined}
                    role={member.role}
                    onClick={() => navigate(`/members/${member.uid}`)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
      {isOnlyMember && (
        <EmptyState title={t("members.onlyMember")} subtitle={t("members.onlyMemberSubtitle")} variant="light" />
      )}
    </div>
  );
};

export default MembersList;
