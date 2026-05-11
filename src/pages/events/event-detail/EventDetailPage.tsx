import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import useRole from "../../../hooks/useRole";
import { getEventById, deleteEvent } from "../../../services/event.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import MemberCard from "../../../components/members/MemberCard";
import Alert from "../../../components/alert/Alert";
import EventsFilter from "../../../components/events/EventsFilter";
import Icon from "../../../ui-kit/icons/icon/Icon";
import "./event-detail.scss";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("events");
  const { profile, user } = useAuthContext();
  const { isAdmin, isOrganizer } = useRole();
  // TODO T12: const { group } = useGroupContext();
  const [event, setEvent] = useState<FallesEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState("all");

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

    getEventById(profile.groupId, id).then((data) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (!data) {
        navigate("/events", { replace: true });
        return;
      }
      setEvent(data);
    });

    return () => {
      isMounted = false;
    };
  }, [profile?.groupId, id, navigate]);

  if (isLoading) return <Loading />;
  if (!event) return null;

  const role = isAdmin ? "admin" : isOrganizer ? "organizer" : "member";
  const userId = user?.uid ?? "";
  const canEdit =
    role === "admin" || (role === "organizer" && event.createdBy === userId);

  const eventStatus = getEventStatus(event);
  // TODO T12: reemplazar con datos reales de Firestore
  const allMembers: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "member" | "organizer" | "admin";
    attendance: "going" | "pending" | "not-going";
  }[] = [];
  const totalMembers = allMembers.length;
  const goingCount = allMembers.filter((m) => m.attendance === "going").length;

  const rawDate = event.date.toLocaleDateString(
    i18n.language === "ca" ? "ca-ES" : "es-ES",
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const attendeeFilterOptions = [
    { key: "all", label: t("events.filters.all"), count: totalMembers },
    {
      key: "confirmed",
      label: t("detail.filter.confirmed"),
      count: goingCount,
    },
    { key: "pending", label: t("detail.filter.pending"), count: 0 },
    { key: "not-going", label: t("detail.filter.notGoing"), count: 0 },
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
    <div className="event-detail-page">
      <div className="event-detail-page__gradient-zone">
        <BackButton />

        <div className="event-detail-page__header">
          <h1 className="event-detail-page__name">{event.name}</h1>
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
                    <li>
                      <button
                        type="button"
                        className="event-detail-page__menu-item"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                      >
                        {t("detail.edit")}
                      </button>
                    </li>
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

        <span
          className={`event-detail-page__status-badge event-detail-page__status-badge--${eventStatus}`}
        >
          {t(`status.${eventStatus}`)}
        </span>

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
        {role !== "member" && (
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
            {allMembers.length === 0 ? (
              <p className="event-detail-page__attendees-empty">
                {t("detail.attendeesEmpty")}
              </p>
            ) : (
              allMembers.map((member) => (
                <MemberCard
                  key={member.uid}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                  role={member.role}
                  showChevron={false}
                  showRole={false}
                  attendance={member.attendance}
                />
              ))
            )}
          </div>
        )}

        {role === "member" && (
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

      <Alert
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
