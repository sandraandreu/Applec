import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { getEventById, deleteEvent } from "../../../services/event.service";
import { getEventAttendances } from "../../../services/attendance.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import MemberCard from "../../../components/members/MemberCard";
import Modal from "../../../components/modal/Modal";
import EventsFilter from "../../../components/events/EventsFilter";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Badge from "../../../ui-kit/badge/Badge";
import "./event-detail.scss";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("events");
  const { profile, user } = useAuthContext();
  const { group } = useGroupContext();
  const [event, setEvent] = useState<FallesEvent | null>(null);
  const [memberResponses, setMemberResponses] = useState<Record<string, "yes" | "no">>({});
  const [linkedResponses, setLinkedResponses] = useState<Record<string, Record<string, "yes" | "no">>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState("all");
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

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
  const toAttendance = (response: "yes" | "no" | undefined): "going" | "not-going" | "pending" =>
    response === "yes" ? "going" : response === "no" ? "not-going" : "pending";

  const allMembers = (group?.members ?? []).filter(member => member.role === "member").map((member) => {
    const attendance = toAttendance(memberResponses[member.uid]);
    const memberLinked = (group?.linkedMembers ?? [])
      .filter(lm => lm.ownerUid === member.uid)
      .map(lm => ({
        ...lm,
        attendance: toAttendance(linkedResponses[member.uid]?.[lm.id]),
      }));
    return { ...member, attendance, linkedMembers: memberLinked };
  });

  const allRows = allMembers.flatMap(m => [m, ...m.linkedMembers.map(lm => ({ ...lm, uid: lm.id, email: "", role: "member" as const, isLinked: true }))]);
  const totalMembers = allRows.length;
  const goingCount = allRows.filter(r => r.attendance === "going").length;

  const rawDate = event.date.toLocaleDateString(
    i18n.language === "ca" ? "ca-ES" : "es-ES",
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const pendingCount = allRows.filter(r => r.attendance === "pending").length;
  const notGoingCount = allRows.filter(r => r.attendance === "not-going").length;

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
      return member.attendance === targetAttendance || member.linkedMembers.some(lm => lm.attendance === targetAttendance);
    })
    .map(member => {
      if (!targetAttendance) return member;
      return { ...member, linkedMembers: member.linkedMembers.filter(lm => lm.attendance === targetAttendance) };
    });

  const attendeeFilterOptions = [
    { key: "all", label: t("events.filters.all"), count: totalMembers },
    { key: "confirmed", label: t("detail.filter.confirmed"), count: goingCount },
    { key: "pending", label: t("detail.filter.pending"), count: pendingCount },
    { key: "not-going", label: t("detail.filter.notGoing"), count: notGoingCount },
  ];

  const handleDelete = async () => {
    if (!profile?.groupId || !event.id) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteEvent(profile.groupId, event.id);
      navigate("/events", { replace: true });
    } catch {
      setIsDeleting(false);
      setDeleteError(t("delete.error"));
    }
  };

  return (
    <div className={`event-detail-page${isPast ? " event-detail-page--past" : ""}`} {...swipeHandlers}>
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
                  <div
                    className="event-detail-page__menu-overlay"
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
        {user?.permissions.canSeeAttendees && (
          <div className="event-detail-page__attendees">
            <div className="event-detail-page__attendees-header">
              <div className="event-detail-page__attendees-left">
                <span className="event-detail-page__attendees-label">
                  {t("detail.attendees")}
                </span>
                <span className="event-detail-page__attendees-count">
                  <span className="event-detail-page__attendees-count-going">
                    {goingCount}
                  </span>
                  /{totalMembers}
                </span>
              </div>
              <div className="event-detail-page__attendees-right">
                <EventsFilter
                  options={attendeeFilterOptions}
                  selected={attendeeFilter}
                  onChange={setAttendeeFilter}
                />
              </div>
            </div>
            {filteredMembers.length === 0 ? (
              <p className="event-detail-page__attendees-empty">
                {t("detail.attendeesEmpty")}
              </p>
            ) : (
              filteredMembers.map((member) => {
                const hasLinked = member.linkedMembers.length > 0;
                const isExpanded = expandedMembers.has(member.uid);
                return (
                  <div key={member.uid} className="event-detail-page__attendee-group">
                    <MemberCard
                      firstName={member.firstName}
                      lastName={member.lastName}
                      email={member.email}
                      role={member.role}
                      showChevron={false}
                      showRole={false}
                      attendance={member.attendance}
                      isExpandable={hasLinked}
                      isExpanded={isExpanded}
                      onToggle={() => toggleMember(member.uid)}
                    />
                    {isExpanded && member.linkedMembers.map((linked) => (
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
              })
            )}
          </div>
        )}

        {!user?.permissions.canSeeAttendees && (
          <>
            <div className="event-detail-page__going">
              <h2 className="event-detail-page__going-title">
                {t("detail.going.title")}
              </h2>
              <div className="event-detail-page__going-buttons">
                <Button
                  variant="going-no-active"
                  className="event-detail-page__going-btn"
                  text={t("detail.going.no")}
                />
                <Button
                  variant="going-yes"
                  className="event-detail-page__going-btn"
                  icon={<Icon name="check" size={20} />}
                  text={t("detail.going.yes")}
                />
              </div>
              <Button
                variant="linked"
                disabled
                icon={<Icon name="plus" size={32} />}
                text={t("detail.going.addLinked")}
              />
            </div>
            <Button variant="especial" text={t("detail.going.save")} />
          </>
        )}

        {deleteError && (
          <p className="event-detail-page__delete-error">
            <Icon name="error-circle" size={24} className="icon" />
            {deleteError}
          </p>
        )}
      </div>

      <Modal
        isOpen={showDeleteAlert}
        header={t("delete.confirm")}
        message={t("delete.message")}
        onDismiss={() => setShowDeleteAlert(false)}
        buttons={[
          {
            text: t("delete.cancel"),
          },
          {
            text: t("delete.submit"),
            role: "cancel",
            handler: handleDelete,
          },
        ]}
      />

      {isDeleting && <Loading />}
    </div>
  );
};

export default EventDetailPage;
