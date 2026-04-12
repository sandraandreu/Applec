import "./MembersList.scss";
import { useGroupContext } from "../../../context/group/GroupContext";
import MemberCard from "../memberCard/MemberCard";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";
import { useNavigate } from "react-router-dom";
import Loading from "../../feedback/Loading";

interface MembersListProps {
  searchValue: string;
}

const MembersList = ({ searchValue }: MembersListProps) => {
  const { t } = useTranslation("members");
  const navigate = useNavigate();
  const { group, isLoading } = useGroupContext();

  if (isLoading) return <Loading />;

  const filteredMembers = group?.members.filter((member) =>
    member.userName?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const isOnlyMember = group?.members.length === 1;

  if (isOnlyMember) {
    return (
      <div>
        <p>{t("members.onlyMember")}</p>
        <Button
          text={t("members.invite")}
          onClick={() => navigate("/invite-group")}
        />
      </div>
    );
  }

  if (searchValue && filteredMembers?.length === 0) {
    return <p>{t("members.emptySearch")}</p>;
  }

  return (
    <div>
      {filteredMembers?.map((member) => (
        <MemberCard
          key={member.uid}
          name={member.userName}
          fullName={member.fullName}
          role={member.role}
        />
      ))}
    </div>
  );
};

export default MembersList;
