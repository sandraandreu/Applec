import { memo } from "react";
import "./members.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import type { AvatarAttendance } from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";
import Icon from "../../ui-kit/icons/icon/Icon";

interface MemberCardProps {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "organizer" | "member";
  showChevron?: boolean;
  showRole?: boolean;
  attendance?: AvatarAttendance;
}

const MemberCard = ({ firstName, lastName, email, role, showChevron = true, showRole = true, attendance }: MemberCardProps) => {
  return (
    <div className={`member-card${attendance === "not-going" ? " member-card--not-going" : ""}`}>
      <Avatar firstName={firstName} lastName={lastName} role={role} size="md" attendance={attendance} />
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        <span className="member-card__email">{email}</span>
      </div>
      {showRole && <Chip role={role} variant="short" />}
      {showChevron && (
        <Icon name="chevron-right" size={20} className="member-card__chevron" />
      )}
    </div>
  );
};

export default memo(MemberCard);
