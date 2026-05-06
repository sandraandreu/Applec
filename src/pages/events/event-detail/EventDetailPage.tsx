import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext, type GroupData } from "../../../context/group/GroupContext";
import { getEventById } from "../../../services/event.service";
import { getEventStatus } from "../../../models/event.model";
import type { FallesEvent } from "../../../models/event.model";
import Loading from "../../../components/loading/Loading";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/icons/BackButton";
import MemberCard from "../../../components/members/MemberCard";
import "./event-detail.scss";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("events");
  const { profile, user } = useAuthContext();
  const { group } = useGroupContext();

  const [event, setEvent] = useState<FallesEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile?.groupId || !id) {
      navigate("/events", { replace: true });
      return;
    }
    getEventById(profile.groupId, id).then((data) => {
      setIsLoading(false);
      if (!data) {
        navigate("/events", { replace: true });
        return;
      }
      setEvent(data);
    });
  }, [profile?.groupId, id, navigate]);

  if (isLoading) return <Loading />;
  if (!event) return null;

  const role = profile?.role ?? "member";
  const userId = user?.uid ?? "";
  const canEdit =
    role === "admin" || (role === "organizer" && event.createdBy === userId);

  const eventStatus = getEventStatus(event);

  const totalMembers = group?.members.length ?? 0;
  // TODO T12: derivar de la subcolección attendances filtrando response === 'yes' y cruzando con group.members
  const goingMembers: GroupData["members"] = [
    { uid: "fake-1", username: "inmana33", firstName: "Inma", lastName: "Núñez Albert", email: "", role: "member" },
    { uid: "fake-2", username: "sandraaa53", firstName: "Sandra", lastName: "Andreu", email: "", role: "member" },
    { uid: "fake-3", username: "paco_faller", firstName: "Paco", lastName: "García", email: "", role: "member" },
  ];

  const rawDate = event.date.toLocaleDateString(
    i18n.language === "ca" ? "ca-ES" : "es-ES",
    { weekday: "long", day: "numeric", month: "long" },
  );
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <div className="event-detail-page">
      <BackButton />

      <div className="event-detail-page__content">
        <div className="event-detail-page__principal-info">
          <h1 className="event-detail-page__name">{event.name}</h1>
          <span className={`event-detail-page__status-badge event-detail-page__status-badge--${eventStatus}`}>
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
                  stroke="#0068FF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.1875 13.998C16.9124 13.998 17.5 13.4104 17.5 12.6855C17.5 11.9607 16.9124 11.373 16.1875 11.373C15.4626 11.373 14.875 11.9607 14.875 12.6855C14.875 13.4104 15.4626 13.998 16.1875 13.998Z"
                  fill="#0068FF"
                />
                <path
                  d="M20.5625 13.998C21.2874 13.998 21.875 13.4104 21.875 12.6855C21.875 11.9607 21.2874 11.373 20.5625 11.373C19.8376 11.373 19.25 11.9607 19.25 12.6855C19.25 13.4104 19.8376 13.998 20.5625 13.998Z"
                  fill="#0068FF"
                />
                <path
                  d="M16.1875 18.373C16.9124 18.373 17.5 17.7854 17.5 17.0605C17.5 16.3357 16.9124 15.748 16.1875 15.748C15.4626 15.748 14.875 16.3357 14.875 17.0605C14.875 17.7854 15.4626 18.373 16.1875 18.373Z"
                  fill="#0068FF"
                />
                <path
                  d="M20.5625 18.373C21.2874 18.373 21.875 17.7854 21.875 17.0605C21.875 16.3357 21.2874 15.748 20.5625 15.748C19.8376 15.748 19.25 16.3357 19.25 17.0605C19.25 17.7854 19.8376 18.373 20.5625 18.373Z"
                  fill="#0068FF"
                />
                <path
                  d="M7.4375 18.373C8.16237 18.373 8.75 17.7854 8.75 17.0605C8.75 16.3357 8.16237 15.748 7.4375 15.748C6.71263 15.748 6.125 16.3357 6.125 17.0605C6.125 17.7854 6.71263 18.373 7.4375 18.373Z"
                  fill="#0068FF"
                />
                <path
                  d="M11.8125 18.373C12.5374 18.373 13.125 17.7854 13.125 17.0605C13.125 16.3357 12.5374 15.748 11.8125 15.748C11.0876 15.748 10.5 16.3357 10.5 17.0605C10.5 17.7854 11.0876 18.373 11.8125 18.373Z"
                  fill="#0068FF"
                />
                <path
                  d="M7.4375 22.748C8.16237 22.748 8.75 22.1604 8.75 21.4355C8.75 20.7107 8.16237 20.123 7.4375 20.123C6.71263 20.123 6.125 20.7107 6.125 21.4355C6.125 22.1604 6.71263 22.748 7.4375 22.748Z"
                  fill="#0068FF"
                />
                <path
                  d="M11.8125 22.748C12.5374 22.748 13.125 22.1604 13.125 21.4355C13.125 20.7107 12.5374 20.123 11.8125 20.123C11.0876 20.123 10.5 20.7107 10.5 21.4355C10.5 22.1604 11.0876 22.748 11.8125 22.748Z"
                  fill="#0068FF"
                />
                <path
                  d="M16.1875 22.748C16.9124 22.748 17.5 22.1604 17.5 21.4355C17.5 20.7107 16.9124 20.123 16.1875 20.123C15.4626 20.123 14.875 20.7107 14.875 21.4355C14.875 22.1604 15.4626 22.748 16.1875 22.748Z"
                  fill="#0068FF"
                />
                <path
                  d="M21 2.62305V4.37305M7 2.62305V4.37305V2.62305Z"
                  stroke="#0068FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25.375 8.74902H2.625"
                  stroke="#0068FF"
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
                    stroke="#0068FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 13.1255C15.4497 13.1255 16.625 11.9502 16.625 10.5005C16.625 9.05074 15.4497 7.87549 14 7.87549C12.5503 7.87549 11.375 9.05074 11.375 10.5005C11.375 11.9502 12.5503 13.1255 14 13.1255Z"
                    stroke="#0068FF"
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
        </div>

        {role !== "member" && (
          <div className="event-detail-page__attendees">
            <div className="event-detail-page__attendees__header">
              <span className="event-detail-page__attendees__label">
                {t("detail.attendees")}
              </span>
              <span className="event-detail-page__attendees__count">
                <span className="event-detail-page__attendees__count-going">{goingMembers.length}</span>
                /{totalMembers}
              </span>
            </div>
            {goingMembers.length === 0 ? (
              <p className="event-detail-page__attendees__empty">
                {t("detail.attendeesEmpty")}
              </p>
            ) : (
              goingMembers.map((member) => (
                <MemberCard
                  key={member.uid}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                  role={member.role}
                  showChevron={false}
                />
              ))
            )}
          </div>
        )}

        {canEdit && (
          <div className="event-detail-page__actions">
            <Button
              variant="primary"
              to={`/events/${event.id}/edit`}
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
                    d="M24 14.0007V25.5007C24 25.829 23.9353 26.1541 23.8097 26.4574C23.6841 26.7608 23.4999 27.0364 23.2678 27.2685C23.0356 27.5006 22.76 27.6848 22.4567 27.8104C22.1534 27.9361 21.8283 28.0007 21.5 28.0007H6.5C5.83696 28.0007 5.20107 27.7373 4.73223 27.2685C4.26339 26.7997 4 26.1638 4 25.5007V10.5007C4 9.83769 4.26339 9.20181 4.73223 8.73297C5.20107 8.26412 5.83696 8.00073 6.5 8.00073H16.9675"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28.7463 3.32888C28.655 3.22853 28.5443 3.14774 28.4208 3.09139C28.2974 3.03504 28.1638 3.0043 28.0282 3.00102C27.8925 2.99775 27.7576 3.02202 27.6316 3.07235C27.5056 3.12269 27.3911 3.19805 27.2951 3.29388L26.5219 4.06325C26.4283 4.15701 26.3756 4.28414 26.3756 4.41669C26.3756 4.54924 26.4283 4.67637 26.5219 4.77013L27.2307 5.47763C27.2772 5.5243 27.3324 5.56134 27.3932 5.58661C27.454 5.61189 27.5192 5.6249 27.5851 5.6249C27.6509 5.6249 27.7161 5.61189 27.777 5.58661C27.8378 5.56134 27.893 5.5243 27.9394 5.47763L28.6932 4.72763C29.0744 4.347 29.1101 3.727 28.7463 3.32888ZM24.9588 5.62575L13.6763 16.8882C13.6079 16.9564 13.5582 17.041 13.532 17.1339L13.0101 18.6882C12.9976 18.7304 12.9967 18.7752 13.0075 18.8178C13.0183 18.8605 13.0405 18.8994 13.0716 18.9305C13.1027 18.9616 13.1416 18.9837 13.1842 18.9946C13.2269 19.0054 13.2717 19.0045 13.3138 18.992L14.867 18.4701C14.9599 18.4439 15.0444 18.3942 15.1126 18.3257L26.3751 7.042C26.4793 6.93669 26.5377 6.79452 26.5377 6.64638C26.5377 6.49823 26.4793 6.35606 26.3751 6.25075L25.7532 5.62575C25.6478 5.5206 25.5049 5.46156 25.356 5.46156C25.2071 5.46156 25.0643 5.5206 24.9588 5.62575Z"
                    fill="currentColor"
                  />
                </svg>
              }
              text={t("detail.edit")}
            />
            <Button
              variant="danger"
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
                    d="M7 6.99487L8.25 26.9949C8.30937 28.1505 9.15 28.9949 10.25 28.9949H21.75C22.8544 28.9949 23.6794 28.1505 23.75 26.9949L25 6.99487"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M5 6.99487H27H5Z" fill="currentColor" />
                  <path
                    d="M5 6.99487H27"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20.5 10.9985L20 24.9985M12 6.99854V4.49854C11.9994 4.3014 12.0378 4.10608 12.113 3.92383C12.1882 3.74158 12.2986 3.576 12.4381 3.43659C12.5775 3.29719 12.743 3.18672 12.9253 3.11155C13.1075 3.03637 13.3029 2.99796 13.5 2.99854H18.5C18.6971 2.99796 18.8925 3.03637 19.0747 3.11155C19.257 3.18672 19.4225 3.29719 19.5619 3.43659C19.7014 3.576 19.8118 3.74158 19.887 3.92383C19.9622 4.10608 20.0006 4.3014 20 4.49854V6.99854H12ZM16 10.9985V24.9985V10.9985ZM11.5 10.9985L12 24.9985L11.5 10.9985Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              text={t("detail.delete")}
            />
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
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M25 15.9985H7M16 6.99854V24.9985V6.99854Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                text={t("detail.going.addLinked")}
              />
            </div>
            <Button variant="especial" text={t("detail.going.save")} />
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
