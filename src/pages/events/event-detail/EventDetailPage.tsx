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
import VoteStickyFooter from "./vote-sticky-footer/VoteStickyFooter";
import EventDetailHeader from "./event-detail-header/EventDetailHeader";
import EventAttendanceSection from "./event-attendance-section/EventAttendanceSection";
import type { AttendanceMember } from "./event-attendance-section/EventAttendanceSection";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import Modal from "../../../components/modal/Modal";
import Icon from "../../../ui-kit/icons/icon/Icon";
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
  const [showVoteSheet, setShowVoteSheet] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 60,
  });

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

  const allMembers = useMemo(
    (): AttendanceMember[] => (group?.members ?? []).map(member => ({
      ...member,
      attendance: attendance.members[member.uid] ?? "pending",
      linkedMembers: (group?.linkedMembers ?? [])
        .filter(lm => lm.ownerUid === member.uid)
        .map(lm => ({
          ...lm,
          attendance: attendance.linked[member.uid]?.[lm.id] ?? "pending",
        })),
    })),
    [group?.members, group?.linkedMembers, attendance]
  );

  if (isLoading) return <Loading />;
  if (!event) return null;

  const canEdit =
    user?.permissions.canEditAllEvents ||
    (user?.permissions.canEditOwnEvents && event.createdBy === user.uid);

  const eventStatus = getEventStatus(event);
  const isPast = eventStatus === "finalizado";

  const formattedDeadline = event.confirmationDeadline
    ? event.confirmationDeadline.toLocaleDateString(
        getIntlLocale(i18n.language),
        { day: "numeric", month: "long" },
      )
    : undefined;

  const visibleLinkedMembers = event.allowExternalGuests === false
    ? myLinkedMembers.filter(lm => (lm.type ?? "fallero") === "fallero")
    : myLinkedMembers;

  const handleAddLinked = () => {
    setShowVoteSheet(false);
    navigate("/members/linked/new", {
      replace: true,
      state: { returnTo: `/events/${id}`, openVoteSheet: true },
    });
  };

  const rawDate = event.date.toLocaleDateString(
    getIntlLocale(i18n.language),
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

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

  const handleVote = async (response: "going" | "not-going") => {
    if (!profile?.groupId || !id || !user?.uid || isVoting) return;
    const newResponse = myResponse === response ? undefined : response;
    setIsVoting(true);
    try {
      await saveAttendance(profile.groupId, id, user.uid, {
        response: newResponse,
        linkedResponses: myLinkedResponses,
      });
      setAttendance(prev => {
        const members = { ...prev.members };
        if (newResponse) {
          members[user.uid] = newResponse;
        } else {
          delete members[user.uid];
        }
        return { ...prev, members };
      });
      setVoteError(null);
    } catch {
      setVoteError(t("attendance.error"));
    } finally {
      setIsVoting(false);
    }
  };

  const handleSaveCompanions = async (linkedVotes: Record<string, "going" | "not-going">) => {
    if (!profile?.groupId || !id || !user?.uid) return;
    try {
      await saveAttendance(profile.groupId, id, user.uid, {
        response: myResponse,
        linkedResponses: linkedVotes,
      });
      setAttendance(prev => ({
        ...prev,
        linked: { ...prev.linked, [user.uid]: linkedVotes },
      }));
      setVoteError(null);
    } catch {
      setVoteError(t("attendance.error"));
      throw new Error();
    }
  };

  return (
    <div className={["event-detail-page", isPast ? "event-detail-page--past" : event.isSpecial ? "event-detail-page--special" : ""].filter(Boolean).join(" ")} {...swipeHandlers}>

      <div className="event-detail-page__scroll-area">
      <EventDetailHeader
        event={event}
        canEdit={canEdit}
        formattedDate={formattedDate}
        deadline={formattedDeadline}
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
          <EventAttendanceSection
            allMembers={allMembers}
            canSeeFullAttendance={user?.permissions.canCreateEvents ?? false}
          />
        )}

        <VoteSheet
          isOpen={showVoteSheet}
          onDismiss={() => setShowVoteSheet(false)}
          myResponse={myResponse}
          linkedMembers={myLinkedMembers.map((linkedMember) => ({
            id: linkedMember.id,
            firstName: linkedMember.firstName,
            lastName: linkedMember.lastName,
            relationship: linkedMember.relationship ?? "",
            type: linkedMember.type,
          }))}
          allowExternalGuests={event.allowExternalGuests}
          maxExternalGuests={event.maxExternalGuests}
          onAddLinked={handleAddLinked}
          initialLinkedResponses={myLinkedResponses}
          onSaveCompanions={handleSaveCompanions}
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
        <VoteStickyFooter
          eventStatus={eventStatus}
          myResponse={myResponse}
          visibleLinkedMembers={visibleLinkedMembers.map(lm => ({ id: lm.id, firstName: lm.firstName }))}
          myLinkedResponses={myLinkedResponses}
          voteError={voteError}
          isVoting={isVoting}
          onVote={handleVote}
          onCompanionsClick={() => setShowVoteSheet(true)}
          onAddLinked={handleAddLinked}
        />
      )}

      <Modal
        isOpen={showDeleteAlert}
        header={t("delete.confirm")}
        message={t("delete.message")}
        onDismiss={() => setShowDeleteAlert(false)}
        buttons={[
          {
            text: t("delete.submit"),
            role: "danger",
            handler: handleDelete,
          },
          {
            text: t("delete.cancel"),
            role: "cancel",
          },
        ]}
      />

      {deleteState.isLoading && <Loading />}
    </div>
  );
};

export default EventDetailPage;
