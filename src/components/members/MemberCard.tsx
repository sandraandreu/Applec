import { memo } from "react";
import { useTranslation } from "react-i18next";
import "./members.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import type { AvatarAttendance } from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";
import Icon from "../../ui-kit/icons/icon/Icon";
import AttendanceIndicator from "../../ui-kit/attendance-indicator/AttendanceIndicator";

interface MemberCardProps {
  firstName: string;
  lastName: string;
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
  onEdit?: () => void;
  isOwnProfile?: boolean;
}

const MemberCard = ({ firstName, lastName, relationship, role, showChevron = true, showRole = true, attendance, isLinked = false, isExpandable = false, isExpanded = false, onToggle, onClick, onEdit, isOwnProfile = false }: MemberCardProps) => {
  const { t } = useTranslation("common");
  const { t: tMembers } = useTranslation("members");
  const classes = [
    "member-card",
    isLinked ? "member-card--linked" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={isExpandable ? onToggle : onClick} role={isExpandable || onClick ? "button" : undefined}>
      <Avatar firstName={firstName} lastName={lastName} role={role} size={isLinked ? "sm" : "md"} attendance={attendance} />
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        {isOwnProfile && <span className="member-card__you-tag">{tMembers("members.you")}</span>}
        {relationship && <span className="member-card__relationship">{relationship}</span>}
      </div>
      {showRole && <Chip role={role} variant="short" />}
      {showChevron && (
        <Icon name="chevron-right" size={20} className="member-card__chevron" />
      )}
      {isExpandable && (
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          className="member-card__expand-icon"
        />
      )}
      {attendance && <AttendanceIndicator attendance={attendance} />}
      {onEdit && (
        <div className="member-card__actions">
          <button
            type="button"
            className="member-card__action-btn"
            aria-label={`${t("buttons.edit")} ${firstName} ${lastName}`}
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Icon name="edit" size={24} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(MemberCard);
