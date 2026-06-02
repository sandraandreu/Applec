import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AttendanceDonut from "../attendance-donut/AttendanceDonut";
import EventsFilter from "../../../../components/events/EventsFilter";
import MemberCard from "../../../../components/members/MemberCard";
import EmptyState from "../../../../ui-kit/empty-state/EmptyState";

interface AttendanceLinkedMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship?: string;
  attendance: "going" | "not-going" | "pending";
}

export interface AttendanceMember {
  uid: string;
  firstName: string;
  lastName: string;
  role: "admin" | "organizer" | "member";
  photoUrl?: string;
  attendance: "going" | "not-going" | "pending";
  linkedMembers: AttendanceLinkedMember[];
}

interface Props {
  allMembers: AttendanceMember[];
  canSeeFullAttendance: boolean;
}

const ATTENDEES_PREVIEW = 4;

const EventAttendanceSection = ({ allMembers, canSeeFullAttendance }: Props) => {
  const { t } = useTranslation("events");
  const [attendeeFilter, setAttendeeFilter] = useState(canSeeFullAttendance ? "all" : "going");
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  const toggleMember = (uid: string) => {
    setExpandedMembers(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const {
    allRows,
    counters: {
      "not-going": notGoingCount,
      going: goingCount,
      pending: pendingCount,
    },
  } = useMemo(() => {
    const counters = { going: 0, "not-going": 0, pending: 0 };
    const allRows = allMembers.flatMap(member => {
      const { attendance = "pending" } = member;
      counters[attendance] = counters[attendance] + 1;
      const normalizedMembers = member.linkedMembers.map(linkedMember => {
        const { attendance = "pending" } = linkedMember;
        counters[attendance] = counters[attendance] + 1;
        return { ...linkedMember, uid: linkedMember.id, role: "member" as const, isLinked: true };
      });
      return [member, ...normalizedMembers];
    });
    return { allRows, counters };
  }, [allMembers]);

  const totalMembers = allRows.length;

  const targetAttendance = attendeeFilter === "all" ? null : attendeeFilter as "going" | "not-going" | "pending";

  const attendanceOrder: Record<string, number> = { going: 0, "not-going": 1, pending: 2 };

  const filteredMembers = useMemo(
    () => allMembers
      .filter(member => {
        if (!targetAttendance) return true;
        return member.attendance === targetAttendance || member.linkedMembers.some(lm => lm.attendance === targetAttendance);
      })
      .map(member => {
        if (!targetAttendance) return member;
        return { ...member, linkedMembers: member.linkedMembers.filter(lm => lm.attendance === targetAttendance) };
      })
      .sort((a, b) => attendanceOrder[a.attendance] - attendanceOrder[b.attendance]),
    [allMembers, targetAttendance]
  );

  const attendeeFilterOptions = useMemo(() => [
    { key: "all", label: t("events.filters.all"), count: totalMembers },
    { key: "going", label: t("detail.filter.confirmed"), count: goingCount },
    { key: "pending", label: t("detail.filter.pending"), count: pendingCount },
    { key: "not-going", label: t("detail.filter.notGoing"), count: notGoingCount },
  ], [t, totalMembers, goingCount, pendingCount, notGoingCount]);

  const handleFilterChange = (filter: string) => {
    setAttendeeFilter(filter);
    setShowAllAttendees(false);
  };

  return (
    <>
      <div className="event-detail-page__attendance-summary">
        <span className="event-detail-page__section-label">
          {t("attendanceList.title")}
        </span>
        {canSeeFullAttendance && (
          <AttendanceDonut
            goingCount={goingCount}
            notGoingCount={notGoingCount}
            pendingCount={pendingCount}
            total={totalMembers}
          />
        )}
      </div>

      <div className="event-detail-page__attendees">
        {canSeeFullAttendance && (
          <div className="event-detail-page__attendees-header">
            <div className="event-detail-page__attendees-right">
              <EventsFilter
                options={attendeeFilterOptions}
                selected={attendeeFilter}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        )}

        {filteredMembers.length === 0 ? (
          <EmptyState title={t("detail.attendeesEmpty")} variant="light" />
        ) : (
          <>
            {(showAllAttendees ? filteredMembers : filteredMembers.slice(0, ATTENDEES_PREVIEW)).map(member => {
              const hasLinked = member.linkedMembers.length > 0;
              const isExpanded = expandedMembers.has(member.uid);
              const shouldAutoExpand = !!targetAttendance && member.attendance !== targetAttendance;
              const effectivelyExpanded = isExpanded || shouldAutoExpand;
              return (
                <div key={member.uid} className="event-detail-page__attendee-group">
                  <MemberCard
                    firstName={member.firstName}
                    lastName={member.lastName}
                    role={member.role}
                    photoUrl={member.photoUrl}
                    showChevron={false}
                    showRole={false}
                    attendance={member.attendance}
                    isExpandable={hasLinked}
                    isExpanded={effectivelyExpanded}
                    onToggle={() => toggleMember(member.uid)}
                  />
                  {effectivelyExpanded && member.linkedMembers.map(linkedMember => (
                    <MemberCard
                      key={linkedMember.id}
                      firstName={linkedMember.firstName}
                      lastName={linkedMember.lastName}
                      relationship={linkedMember.relationship}
                      role="member"
                      showChevron={false}
                      showRole={false}
                      attendance={linkedMember.attendance}
                      isLinked
                    />
                  ))}
                </div>
              );
            })}
            {filteredMembers.length > ATTENDEES_PREVIEW && (
              <button
                className="event-detail-page__attendees-toggle"
                onClick={() => setShowAllAttendees(prev => !prev)}
                type="button"
              >
                {showAllAttendees
                  ? t("detail.showLess")
                  : t("detail.showAll", { count: filteredMembers.length })}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EventAttendanceSection;
