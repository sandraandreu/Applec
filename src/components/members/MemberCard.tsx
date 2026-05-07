import { memo } from "react";
import "./members.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import type { AvatarAttendance } from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";

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
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.1875 4.37451L12.8125 9.99951L7.1875 15.6245" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
};

export default memo(MemberCard);
