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
import BackButton from "../../../ui-kit/icons/BackButton";
import MemberCard from "../../../components/members/MemberCard";
import Alert from "../../../components/alert/Alert";
import EventsFilter from "../../../components/events/EventsFilter";
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

    return () => { isMounted = false; };
  }, [profile?.groupId, id, navigate]);

  if (isLoading) return <Loading />;
  if (!event) return null;

  const role = isAdmin ? "admin" : isOrganizer ? "organizer" : "member";
  const userId = user?.uid ?? "";
  const canEdit =
    role === "admin" || (role === "organizer" && event.createdBy === userId);

  const eventStatus = getEventStatus(event);
  // TODO T12: reemplazar con datos reales de Firestore
  const allMembers: { uid: string; firstName: string; lastName: string; email: string; role: "member" | "organizer" | "admin"; attendance: "going" | "pending" | "not-going" }[] = [];
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
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M15.9999 21.3334C16.7072 21.3334 17.3854 21.6143 17.8855 22.1144C18.3856 22.6145 18.6666 23.2928 18.6666 24C18.6666 24.7073 18.3856 25.3856 17.8855 25.8857C17.3854 26.3858 16.7072 26.6667 15.9999 26.6667C15.2927 26.6667 14.6144 26.3858 14.1143 25.8857C13.6142 25.3856 13.3333 24.7073 13.3333 24C13.3333 23.2928 13.6142 22.6145 14.1143 22.1144C14.6144 21.6143 15.2927 21.3334 15.9999 21.3334ZM15.9999 13.3334C16.7072 13.3334 17.3854 13.6143 17.8855 14.1144C18.3856 14.6145 18.6666 15.2928 18.6666 16C18.6666 16.7073 18.3856 17.3856 17.8855 17.8857C17.3854 18.3858 16.7072 18.6667 15.9999 18.6667C15.2927 18.6667 14.6144 18.3858 14.1143 17.8857C13.6142 17.3856 13.3333 16.7073 13.3333 16C13.3333 15.2928 13.6142 14.6145 14.1143 14.1144C14.6144 13.6143 15.2927 13.3334 15.9999 13.3334ZM15.9999 5.33337C16.7072 5.33337 17.3854 5.61433 17.8855 6.11442C18.3856 6.61452 18.6666 7.2928 18.6666 8.00004C18.6666 8.70728 18.3856 9.38556 17.8855 9.88566C17.3854 10.3858 16.7072 10.6667 15.9999 10.6667C15.2927 10.6667 14.6144 10.3858 14.1143 9.88566C13.6142 9.38556 13.3333 8.70728 13.3333 8.00004C13.3333 7.2928 13.6142 6.61452 14.1143 6.11442C14.6144 5.61433 15.2927 5.33337 15.9999 5.33337Z"
                    fill="currentColor"
                  />
                </svg>
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
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M22.75 4.37402H5.25C3.80025 4.37402 2.625 5.54928 2.625 6.99902V22.749C2.625 24.1988 3.80025 25.374 5.25 25.374H22.75C24.1997 25.374 25.375 24.1988 25.375 22.749V6.99902C25.375 5.54928 24.1997 4.37402 22.75 4.37402Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M16.1875 13.998C16.9124 13.998 17.5 13.4104 17.5 12.6855C17.5 11.9607 16.9124 11.373 16.1875 11.373C15.4626 11.373 14.875 11.9607 14.875 12.6855C14.875 13.4104 15.4626 13.998 16.1875 13.998Z"
                fill="currentColor"
              />
              <path
                d="M20.5625 13.998C21.2874 13.998 21.875 13.4104 21.875 12.6855C21.875 11.9607 21.2874 11.373 20.5625 11.373C19.8376 11.373 19.25 11.9607 19.25 12.6855C19.25 13.4104 19.8376 13.998 20.5625 13.998Z"
                fill="currentColor"
              />
              <path
                d="M16.1875 18.373C16.9124 18.373 17.5 17.7854 17.5 17.0605C17.5 16.3357 16.9124 15.748 16.1875 15.748C15.4626 15.748 14.875 16.3357 14.875 17.0605C14.875 17.7854 15.4626 18.373 16.1875 18.373Z"
                fill="currentColor"
              />
              <path
                d="M20.5625 18.373C21.2874 18.373 21.875 17.7854 21.875 17.0605C21.875 16.3357 21.2874 15.748 20.5625 15.748C19.8376 15.748 19.25 16.3357 19.25 17.0605C19.25 17.7854 19.8376 18.373 20.5625 18.373Z"
                fill="currentColor"
              />
              <path
                d="M7.4375 18.373C8.16237 18.373 8.75 17.7854 8.75 17.0605C8.75 16.3357 8.16237 15.748 7.4375 15.748C6.71263 15.748 6.125 16.3357 6.125 17.0605C6.125 17.7854 6.71263 18.373 7.4375 18.373Z"
                fill="currentColor"
              />
              <path
                d="M11.8125 18.373C12.5374 18.373 13.125 17.7854 13.125 17.0605C13.125 16.3357 12.5374 15.748 11.8125 15.748C11.0876 15.748 10.5 16.3357 10.5 17.0605C10.5 17.7854 11.0876 18.373 11.8125 18.373Z"
                fill="currentColor"
              />
              <path
                d="M7.4375 22.748C8.16237 22.748 8.75 22.1604 8.75 21.4355C8.75 20.7107 8.16237 20.123 7.4375 20.123C6.71263 20.123 6.125 20.7107 6.125 21.4355C6.125 22.1604 6.71263 22.748 7.4375 22.748Z"
                fill="currentColor"
              />
              <path
                d="M11.8125 22.748C12.5374 22.748 13.125 22.1604 13.125 21.4355C13.125 20.7107 12.5374 20.123 11.8125 20.123C11.0876 20.123 10.5 20.7107 10.5 21.4355C10.5 22.1604 11.0876 22.748 11.8125 22.748Z"
                fill="currentColor"
              />
              <path
                d="M16.1875 22.748C16.9124 22.748 17.5 22.1604 17.5 21.4355C17.5 20.7107 16.9124 20.123 16.1875 20.123C15.4626 20.123 14.875 20.7107 14.875 21.4355C14.875 22.1604 15.4626 22.748 16.1875 22.748Z"
                fill="currentColor"
              />
              <path
                d="M21 2.62305V4.37305M7 2.62305V4.37305V2.62305Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25.375 8.74902H2.625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
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
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M14 2.62231C9.65234 2.62231 6.125 5.97958 6.125 10.1145C6.125 14.8723 11.375 22.4121 13.3027 25.0163C13.3828 25.1262 13.4876 25.2157 13.6088 25.2774C13.73 25.339 13.864 25.3712 14 25.3712C14.136 25.3712 14.27 25.339 14.3912 25.2774C14.5124 25.2157 14.6172 25.1262 14.6973 25.0163C16.625 22.4132 21.875 14.8761 21.875 10.1145C21.875 5.97958 18.3477 2.62231 14 2.62231Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 13.1255C15.4497 13.1255 16.625 11.9502 16.625 10.5005C16.625 9.05074 15.4497 7.87549 14 7.87549C12.5503 7.87549 11.375 9.05074 11.375 10.5005C11.375 11.9502 12.5503 13.1255 14 13.1255Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                  icon={
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  text={t("detail.going.yes")}
                />
              </div>
              <Button
                variant="linked"
                disabled
                icon={
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M25 15.9985H7M16 6.99854V24.9985V6.99854Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                text={t("detail.going.addLinked")}
              />
            </div>
            <Button variant="especial" text={t("detail.going.save")} />
          </>
        )}

        {deleteError && (
          <p className="event-detail-page__delete-error">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="currentColor"/></svg>
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
