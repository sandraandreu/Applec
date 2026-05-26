import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { getEventById, deleteEvent } from "../../../services/event.service";
import { getEventAttendances, saveAttendance } from "../../../services/attendance.service";
import { getEventStatus } from "../../../models/event.model";
import VoteSheet from "./vote-sheet/VoteSheet";
import EventDetailHeader from "./event-detail-header";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Button from "../../../ui-kit/button/Button";
import MemberCard from "../../../components/members/MemberCard";
import Modal from "../../../components/modal/Modal";
import EventsFilter from "../../../components/events/EventsFilter";
import Icon from "../../../ui-kit/icons/icon/Icon";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import AttendanceDonut from "./attendance-donut/AttendanceDonut";
import "./event-detail.scss";
import { getIntlLocale } from "../../../utils/dates";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const openVoteSheetOnLoad = useRef(
    !!(location.state as { openVoteSheet?: boolean } | null)?.openVoteSheet
  );
  const { t, i18n } = useTranslation("events");
  const { profile, user } = useAuthContext();
  const { group } = useGroupContext();
  const [event, setEvent] = useState<FallesEvent | null>(null);
  const [attendance, setAttendance] = useState<{
    members: Record<string, "going" | "not-going">;
    linked: Record<string, Record<string, "going" | "not-going">>;
  }>({ members: {}, linked: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteState, setDeleteState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });
  const [attendeeFilter, setAttendeeFilter] = useState("all");
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [showVoteSheet, setShowVoteSheet] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

  const toggleMember = (uid: string) => {
    setExpandedMembers(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  useEffect(() => {
    if (!profile?.groupId) {
      navigate("/onboarding/welcome", { replace: true });
      return;
    }
    if (!id) {
      navigate("/events", { replace: true });
      return;
    }
    let isMounted = true;
    setIsLoading(true);
    setAttendance({ members: {}, linked: {} });

    Promise.all([
      getEventById(profile.groupId, id),
      getEventAttendances(profile.groupId, id),
    ]).then(([eventData, attendancesData]) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (!eventData) {
        navigate("/events", { replace: true });
        return;
      }
      setEvent(eventData);
      setAttendance({
        members: attendancesData?.memberResponses ?? {},
        linked: attendancesData?.linkedResponses ?? {},
      });
      if (openVoteSheetOnLoad.current) {
        openVoteSheetOnLoad.current = false;
        setShowVoteSheet(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [profile?.groupId, id, navigate]);

  const myLinkedMembers = useMemo(
    () => (group?.linkedMembers ?? []).filter(lm => lm.ownerUid === user?.uid),
    [group?.linkedMembers, user?.uid]
  );

  const myResponse = user?.uid ? attendance.members[user.uid] : undefined;
  const myLinkedResponses = user?.uid ? (attendance.linked[user.uid] ?? {}) : {};

  const hasVoted = !!myResponse || myLinkedMembers.some(lm => myLinkedResponses[lm.id]);

  const allMembers = useMemo(
    () => (group?.members ?? []).map(member => {
      const memberAttendance = attendance.members[member.uid] ?? "pending";
      const memberLinked = (group?.linkedMembers ?? [])
        .filter(lm => lm.ownerUid === member.uid)
        .map(lm => ({
          ...lm,
          attendance: attendance.linked[member.uid]?.[lm.id] ?? "pending",
        }));
      return { ...member, attendance: memberAttendance, linkedMembers: memberLinked };
    }),
    [group?.members, group?.linkedMembers, attendance]
  );

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

  const filteredMembers = useMemo(
    () => allMembers
      .filter(member => {
        if (!targetAttendance) return true;
        return member.attendance === targetAttendance || member.linkedMembers.some(lm => lm.attendance === targetAttendance);
      })
      .map(member => {
        if (!targetAttendance) return member;
        return { ...member, linkedMembers: member.linkedMembers.filter(lm => lm.attendance === targetAttendance) };
      }),
    [allMembers, targetAttendance]
  );

  const attendeeFilterOptions = useMemo(() => [
    { key: "all", label: t("events.filters.all"), count: totalMembers },
    { key: "going", label: t("detail.filter.confirmed"), count: goingCount },
    { key: "pending", label: t("detail.filter.pending"), count: pendingCount },
    { key: "not-going", label: t("detail.filter.notGoing"), count: notGoingCount },
  ], [t, totalMembers, goingCount, pendingCount, notGoingCount]);

  if (isLoading) return <Loading />;
  if (!event) return null;

  const canEdit =
    user?.permissions.canEditAllEvents ||
    (user?.permissions.canEditOwnEvents && event.createdBy === user.uid);

  const eventStatus = getEventStatus(event);
  const isPast = eventStatus === "finalizado";

  const rawDate = event.date.toLocaleDateString(
    getIntlLocale(i18n.language),
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const ATTENDEES_PREVIEW = 4;

  const handleFilterChange = (filter: string) => {
    setAttendeeFilter(filter);
    setShowAllAttendees(false);
  };

  const handleDelete = async () => {
    if (!profile?.groupId || !event.id) return;
    setDeleteState({ isLoading: true, error: null });
    try {
      await deleteEvent(profile.groupId, event.id);
      navigate("/events", { replace: true });
    } catch {
      setDeleteState({ isLoading: false, error: t("delete.error") });
    }
  };

  const handleVoteSave = async (
    response: "going" | "not-going" | undefined,
    linkedVotes: Record<string, "going" | "not-going">
  ) => {
    if (!profile?.groupId || !id || !user?.uid) return;
    try {
      await saveAttendance(profile.groupId, id, user.uid, {
        response,
        linkedResponses: linkedVotes,
      });
      setAttendance(prev => {
        const members = { ...prev.members };
        if (response) {
          members[user.uid] = response;
        } else {
          delete members[user.uid];
        }
        return {
          members,
          linked: { ...prev.linked, [user.uid]: linkedVotes },
        };
      });
      setVoteError(null);
      setShowVoteSuccess(true);
    } catch {
      setVoteError(t("attendance.error"));
    }
  };

  return (
    <div className={`event-detail-page${isPast ? " event-detail-page--past" : ""}`} {...swipeHandlers}>
      {showVoteSuccess && (
        <SuccessBanner message={t("attendance.success")} onDismiss={() => setShowVoteSuccess(false)} />
      )}
      <div className="event-detail-page__scroll-area">
      <EventDetailHeader
        event={event}
        canEdit={canEdit}
        formattedDate={formattedDate}
        onDeleteRequest={() => setShowDeleteAlert(true)}
      />

      <div className="event-detail-page__content">
        {event.description && (
          <div className="event-detail-page__description">
            <span className="event-detail-page__description-label">
              {t("detail.description")}
            </span>
            <p className="event-detail-page__description-text">
              {event.description}
            </p>
          </div>
        )}
        {event.requiresConfirmation && (
          <div className="event-detail-page__attendance-summary">
            <span className="event-detail-page__section-label">
              {t("attendanceList.title")}
            </span>
            <AttendanceDonut
              goingCount={goingCount}
              notGoingCount={notGoingCount}
              pendingCount={pendingCount}
              total={totalMembers}
            />
          </div>
        )}
        {event.requiresConfirmation && (
          <div className="event-detail-page__attendees">
            <div className="event-detail-page__attendees-header">
              <div className="event-detail-page__attendees-left">
                <span className="event-detail-page__attendees-label">
                  {t("detail.attendees")}
                </span>
              </div>
              <div className="event-detail-page__attendees-right">
                <EventsFilter
                  options={attendeeFilterOptions}
                  selected={attendeeFilter}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            {filteredMembers.length === 0 ? (
              <EmptyState title={t("detail.attendeesEmpty")} variant="light" />
            ) : (
              <>
                {(showAllAttendees ? filteredMembers : filteredMembers.slice(0, ATTENDEES_PREVIEW)).map((member) => {
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
                      {effectivelyExpanded && member.linkedMembers.map((linked) => (
                        <MemberCard
                          key={linked.id}
                          firstName={linked.firstName}
                          lastName={linked.lastName}
                          relationship={linked.relationship}
                          role="member"
                          showChevron={false}
                          showRole={false}
                          attendance={linked.attendance}
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
        )}

        <VoteSheet
          isOpen={showVoteSheet}
          onDismiss={() => setShowVoteSheet(false)}
          deadline={
            event.confirmationDeadline
              ? event.confirmationDeadline.toLocaleDateString(
                  getIntlLocale(i18n.language),
                  { day: "numeric", month: "long" },
                )
              : undefined
          }
          linkedMembers={myLinkedMembers.map((linkedMember) => ({
            id: linkedMember.id,
            firstName: linkedMember.firstName,
            lastName: linkedMember.lastName,
            relationship: linkedMember.relationship ?? "",
          }))}
          onAddLinked={() => {
            setShowVoteSheet(false);
            navigate("/members/linked/new", {
              replace: true,
              state: { returnTo: `/events/${id}`, openVoteSheet: true },
            });
          }}
          initialResponse={myResponse}
          initialLinkedResponses={myLinkedResponses}
          onSave={handleVoteSave}
        />

        {deleteState.error && (
          <p className="event-detail-page__delete-error">
            <Icon name="error-circle" size={24} className="icon" />
            {deleteState.error}
          </p>
        )}
      </div>

      </div>

      {eventStatus !== "finalizado" && event.requiresConfirmation && (
        <div className="event-detail-page__vote-sticky">
          {hasVoted ? (
            <div className="event-detail-page__vote-summary">
              <div className="event-detail-page__vote-own-row">
                <span className="event-detail-page__vote-label">{t("vote.myVote")}</span>
                {myResponse ? (
                  <span className={`event-detail-page__vote-own-chip event-detail-page__vote-own-chip--${myResponse}`}>
                    <Icon name={myResponse === "going" ? "check-bold" : "x-mark"} size={20} aria-hidden="true" />
                    {myResponse === "going" ? t("attendance.going") : t("attendance.notGoing")}
                  </span>
                ) : (
                  <span className="event-detail-page__vote-own-chip event-detail-page__vote-own-chip--pending">
                    –
                  </span>
                )}
              </div>
              {myLinkedMembers.filter(linked => myLinkedResponses[linked.id]).length > 0 && (
                <ul className="event-detail-page__vote-linked-list">
                  {myLinkedMembers
                    .filter(linked => myLinkedResponses[linked.id])
                    .map(linked => (
                      <li key={linked.id} className="event-detail-page__vote-linked-row">
                        <span className="event-detail-page__vote-linked-name">
                          {linked.firstName}
                        </span>
                        <span className={`event-detail-page__vote-linked-chip event-detail-page__vote-linked-chip--${myLinkedResponses[linked.id]}`}>
                          <Icon name={myLinkedResponses[linked.id] === "going" ? "check-bold" : "x-mark"} size={16} aria-hidden="true" />
                          {myLinkedResponses[linked.id] === "going" ? t("vote.yes") : t("vote.no")}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
              {eventStatus === "activo" && (
                <Button
                  variant="primary"
                  text={t("vote.modify")}
                  onClick={() => setShowVoteSheet(true)}
                />
              )}
            </div>
          ) : (
            <>
              {eventStatus === "activo" && (
                <>
                  {event.confirmationDeadline && (
                    <p className="event-detail-page__vote-deadline">
                      <Icon name="clock" size={20} aria-hidden="true" />
                      {t("vote.deadline", {
                        date: event.confirmationDeadline.toLocaleDateString(
                          getIntlLocale(i18n.language),
                          { day: "numeric", month: "long" },
                        ),
                      })}
                    </p>
                  )}
                  <Button
                    variant="especial"
                    text={t("vote.cta")}
                    onClick={() => setShowVoteSheet(true)}
                  />
                </>
              )}
              {eventStatus === "plazo-cerrado" && (
                <p className="event-detail-page__vote-closed-info">
                  {t("vote.closed")}
                </p>
              )}
            </>
          )}
          {voteError && (
            <p className="event-detail-page__vote-error">
              <Icon name="error-circle" size={20} aria-hidden="true" />
              {voteError}
            </p>
          )}
        </div>
      )}

      <Modal
        isOpen={showDeleteAlert}
        header={t("delete.confirm")}
        message={t("delete.message")}
        onDismiss={() => setShowDeleteAlert(false)}
        buttons={[
          {
            text: t("delete.cancel"),
            role: "cancel",
          },
          {
            text: t("delete.submit"),
            role: "danger",
            handler: handleDelete,
          },
        ]}
      />

      {deleteState.isLoading && <Loading />}
    </div>
  );
};

export default EventDetailPage;
