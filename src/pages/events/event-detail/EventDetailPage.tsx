import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { getEventById, deleteEvent } from "../../../services/event.service";
import { getEventAttendances, saveAttendance } from "../../../services/attendance.service";
import { getEventStatus } from "../../../models/event.model";
import VoteSheet from "./vote-sheet/VoteSheet";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import MemberCard from "../../../components/members/MemberCard";
import Modal from "../../../components/modal/Modal";
import EventsFilter from "../../../components/events/EventsFilter";
import Icon from "../../../ui-kit/icons/icon/Icon";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import Badge from "../../../ui-kit/badge/Badge";
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
  const [memberResponses, setMemberResponses] = useState<Record<string, "yes" | "no">>({});
  const [linkedResponses, setLinkedResponses] = useState<Record<string, Record<string, "yes" | "no">>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteState, setDeleteState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });
  const [attendeeFilter, setAttendeeFilter] = useState("all");
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [showVoteSheet, setShowVoteSheet] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyHeight, setStickyHeight] = useState(0);

  useLayoutEffect(() => {
    const stickyBar = stickyRef.current;
    if (!stickyBar) return;
    const observer = new ResizeObserver(() => setStickyHeight(stickyBar.offsetHeight + 16));
    observer.observe(stickyBar);
    return () => observer.disconnect();
  }, []);

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
    setMemberResponses({});
    setLinkedResponses({});

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
      setMemberResponses(attendancesData?.memberResponses ?? {});
      setLinkedResponses(attendancesData?.linkedResponses ?? {});
      if (openVoteSheetOnLoad.current) {
        openVoteSheetOnLoad.current = false;
        setShowVoteSheet(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [profile?.groupId, id, navigate]);

  if (isLoading) return <Loading />;
  if (!event) return null;

  const canEdit =
    user?.permissions.canEditAllEvents ||
    (user?.permissions.canEditOwnEvents && event.createdBy === user.uid);

  const eventStatus = getEventStatus(event);
  const isPast = eventStatus === "finalizado";
  const myResponse = user?.uid ? memberResponses[user.uid] : undefined;
  const myLinkedResponses = user?.uid ? (linkedResponses[user.uid] ?? {}) : {};
  const myLinkedMembers = (group?.linkedMembers ?? []).filter(
    (linkedMember) => linkedMember.ownerUid === user?.uid
  );
  const hasVoted = !!myResponse || myLinkedMembers.some(linkedMember => myLinkedResponses[linkedMember.id]);
  const toAttendance = (response: "yes" | "no" | undefined): "going" | "not-going" | "pending" =>
    response === "yes" ? "going" : response === "no" ? "not-going" : "pending";

  const allMembers = (group?.members ?? []).map((member) => {
    const attendance = toAttendance(memberResponses[member.uid]);
    const memberLinked = (group?.linkedMembers ?? [])
      .filter(linkedMember => linkedMember.ownerUid === member.uid)
      .map(linkedMember => ({
        ...linkedMember,
        attendance: toAttendance(linkedResponses[member.uid]?.[linkedMember.id]),
      }));
    return { ...member, attendance, linkedMembers: memberLinked };
  });

  const allRows = allMembers.flatMap(member => [member, ...member.linkedMembers.map(linkedMember => ({ ...linkedMember, uid: linkedMember.id, role: "member" as const, isLinked: true }))]);
  const totalMembers = allRows.length;
  const goingCount = allRows.filter(r => r.attendance === "going").length;

  const rawDate = event.date.toLocaleDateString(
    getIntlLocale(i18n.language),
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const pendingCount = allRows.filter(r => r.attendance === "pending").length;
  const notGoingCount = allRows.filter(r => r.attendance === "not-going").length;

  const ATTENDEES_PREVIEW = 4;

  const handleFilterChange = (filter: string) => {
    setAttendeeFilter(filter);
    setShowAllAttendees(false);
  };

  const filterToAttendance = (filterKey: string): "going" | "not-going" | "pending" | null => {
    if (filterKey === "confirmed") return "going";
    if (filterKey === "pending") return "pending";
    if (filterKey === "not-going") return "not-going";
    return null;
  };

  const targetAttendance = filterToAttendance(attendeeFilter);

  const filteredMembers = allMembers
    .filter(member => {
      if (!targetAttendance) return true;
      return member.attendance === targetAttendance || member.linkedMembers.some(linkedMember => linkedMember.attendance === targetAttendance);
    })
    .map(member => {
      if (!targetAttendance) return member;
      return { ...member, linkedMembers: member.linkedMembers.filter(linkedMember => linkedMember.attendance === targetAttendance) };
    });

  const attendeeFilterOptions = [
    { key: "all", label: t("events.filters.all"), count: totalMembers },
    { key: "confirmed", label: t("detail.filter.confirmed"), count: goingCount },
    { key: "pending", label: t("detail.filter.pending"), count: pendingCount },
    { key: "not-going", label: t("detail.filter.notGoing"), count: notGoingCount },
  ];

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
    response: "yes" | "no" | undefined,
    linkedVotes: Record<string, "yes" | "no">
  ) => {
    if (!profile?.groupId || !id || !user?.uid) return;
    try {
      await saveAttendance(profile.groupId, id, user.uid, {
        response,
        linkedResponses: linkedVotes,
      });
      if (response) {
        setMemberResponses((prev) => ({ ...prev, [user.uid]: response }));
      } else {
        setMemberResponses((prev) => {
          const next = { ...prev };
          delete next[user.uid];
          return next;
        });
      }
      setLinkedResponses((prev) => ({ ...prev, [user.uid]: linkedVotes }));
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
      <div className="event-detail-page__gradient-zone">
        <div className="event-detail-page__top-bar">
          <BackButton />
          {canEdit && (
            <div className="event-detail-page__menu-wrapper">
              <button
                className="event-detail-page__menu-trigger"
                aria-label={t("detail.menuOptions")}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <Icon name="menu-dots" size={32} />
              </button>
              {showMenu && (
                <>
                  <button
                    className="event-detail-page__menu-overlay"
                    aria-label={t("common:buttons.close")}
                    onClick={() => setShowMenu(false)}
                  />
                  <ul className="event-detail-page__menu">
                    {!isPast && (
                      <li>
                        <button
                          type="button"
                          className="event-detail-page__menu-item"
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                        >
                          {t("detail.edit")}
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        className="event-detail-page__menu-item"
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteAlert(true);
                        }}
                      >
                        {t("detail.delete")}
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        <h1 className="event-detail-page__name">{event.name}</h1>

        <Badge variant={eventStatus} label={t(`status.${eventStatus}`)} />

        <div className="event-detail-page__field">
          <div className="event-detail-page__field-icon">
            <Icon name="calendar" size={28} />
          </div>
          <div className="event-detail-page__field-content">
            <span className="event-detail-page__field-value">
              {formattedDate} · {event.startTime}
            </span>
            <span className="event-detail-page__field-label">
              {t("detail.dateTime")}
            </span>
          </div>
        </div>

        {event.location && (
          <div className="event-detail-page__field">
            <div className="event-detail-page__field-icon">
              <Icon name="location" size={28} />
            </div>
            <div className="event-detail-page__field-content">
              <span className="event-detail-page__field-value">
                {event.location}
              </span>
              <span className="event-detail-page__field-label">
                {t("detail.location")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className="event-detail-page__content"
        style={stickyHeight > 0 ? { paddingBottom: `${stickyHeight}px` } : undefined}
      >
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

      {eventStatus !== "finalizado" && event.requiresConfirmation && (
        <div className="event-detail-page__vote-sticky" ref={stickyRef}>
          {hasVoted ? (
            <div className="event-detail-page__vote-summary">
              <div className="event-detail-page__vote-own-row">
                <span className="event-detail-page__vote-label">{t("vote.myVote")}</span>
                {myResponse ? (
                  <span className={`event-detail-page__vote-own-chip event-detail-page__vote-own-chip--${myResponse === "yes" ? "going" : "not-going"}`}>
                    <Icon name={myResponse === "yes" ? "check-bold" : "x-mark"} size={20} aria-hidden="true" />
                    {myResponse === "yes" ? t("attendance.going") : t("attendance.notGoing")}
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
                        <span className={`event-detail-page__vote-linked-chip event-detail-page__vote-linked-chip--${myLinkedResponses[linked.id] === "yes" ? "going" : "not-going"}`}>
                          <Icon name={myLinkedResponses[linked.id] === "yes" ? "check-bold" : "x-mark"} size={16} aria-hidden="true" />
                          {myLinkedResponses[linked.id] === "yes" ? t("vote.yes") : t("vote.no")}
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
