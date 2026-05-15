import { memo } from "react";
import "./members.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import type { AvatarAttendance } from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";
import Icon from "../../ui-kit/icons/icon/Icon";

interface MemberCardProps {
  firstName: string;
  lastName: string;
  email?: string;
  relationship?: string;
  role: "admin" | "organizer" | "member";
  showChevron?: boolean;
  showRole?: boolean;
  attendance?: AvatarAttendance;
  isLinked?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

const MemberCard = ({ firstName, lastName, email, relationship, role, showChevron = true, showRole = true, attendance, isLinked = false, isExpandable = false, isExpanded = false, onToggle, onClick }: MemberCardProps) => {
  const classes = [
    "member-card",
    attendance === "not-going" ? "member-card--not-going" : "",
    isLinked ? "member-card--linked" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={isExpandable ? onToggle : onClick} role={isExpandable || onClick ? "button" : undefined}>
      <Avatar firstName={firstName} lastName={lastName} role={role} size={isLinked ? "sm" : "md"} attendance={attendance} />
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        {relationship && <span className="member-card__relationship">{relationship}</span>}
        {!isLinked && email && <span className="member-card__email">{email}</span>}
      </div>
      {showRole && <Chip role={role} variant="short" />}
      {showChevron && (
        <Icon name="chevron-right" size={20} className="member-card__chevron" />
      )}
      {attendance === "going" && (
        <div className="member-card__indicator member-card__indicator--going">
          <Icon name="check" size={10} />
        </div>
      )}
      {attendance === "pending" && (
        <div className="member-card__indicator member-card__indicator--pending" />
      )}
      {isExpandable && (
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          className="member-card__expand-icon"
        />
      )}
    </div>
  );
};

export default memo(MemberCard);
