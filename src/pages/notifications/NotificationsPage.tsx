import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";
import { listenJoinRequests, approveJoinRequest, rejectJoinRequest, getAcceptedRequests } from "../../services/group.service";
import { listenEventNotifications, type EventNotif } from "../../services/event.service";
import type { JoinRequest, AcceptedRequest } from "../../models/user.model";
import BackButton from "../../ui-kit/button/icon-buttons/back-button/BackButton";
import NotificationItem from "./notification-item/NotificationItem";
import JoinRequestItem from "./join-request-item/JoinRequestItem";
import Button from "../../ui-kit/button/Button";
import PageTransition from "../../ui-kit/page-transition/PageTransition";
import type { NotificationIconBg } from "./notification-item/NotificationItem";
import type { IconName } from "../../ui-kit/icons/icon/Icon";
import "./notifications.scss";

interface NotificationData {
  id: string;
  iconName: IconName;
  iconBg: NotificationIconBg;
  title: string;
  message: string;
  variant?: "joinRequest";
}

interface NotificationSection {
  id: string;
  label: string;
  hasDot?: boolean;
  items: NotificationData[];
}

const NotificationsPage = () => {
  const { t } = useTranslation("notifications");
  const { user, profile } = useAuthContext();
  const { group } = useGroupContext();

  const isAdminOrOrg = !!user?.permissions.canCreateEvents;

  useEffect(() => {
    const update = () => localStorage.setItem("notificationsLastSeen", Date.now().toString());
    update();
    return () => update();
  }, []);

  const [visitedAt] = useState(() => Number(localStorage.getItem("notificationsLastSeen") ?? 0));
  const [realRequests, setRealRequests] = useState<JoinRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<AcceptedRequest[]>([]);
  const [newEventNotifications, setNewEventNotifications] = useState<EventNotif[]>([]);

  useEffect(() => {
    if (!isAdminOrOrg || !profile?.groupId) return;
    let isMounted = true;
    getAcceptedRequests(profile.groupId).then(accepted => {
      if (!isMounted) return;
      setAcceptedRequests(accepted.sort((a, b) => b.acceptedAt.getTime() - a.acceptedAt.getTime()));
    });
    const unsubscribe = listenJoinRequests(profile.groupId, (requests) => {
      setRealRequests(requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime()));
    });
    return () => { isMounted = false; unsubscribe(); };
  }, [isAdminOrOrg, profile?.groupId]);

  useEffect(() => {
    if (!profile?.groupId || !user?.uid) return;
    const uid = user.uid;
    const unsubscribe = listenEventNotifications(profile.groupId, (notifications) => {
      const filtered = notifications
        .filter(notification => notification.createdBy !== uid && notification.createdAt.getTime() > visitedAt)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setNewEventNotifications(filtered);
    });
    return () => unsubscribe();
  }, [profile?.groupId, user?.uid, visitedAt]);

  const removeRequest = (uid: string) =>
    setRealRequests(prev => prev.filter(r => r.uid !== uid));

  const handleApprove = async (request: JoinRequest) => {
    if (!profile?.groupId) return;
    const groupId = profile.groupId;
    await approveJoinRequest(groupId, request.uid, {
      firstName: request.firstName,
      lastName: request.lastName,
    });
    removeRequest(request.uid);
    const updated = await getAcceptedRequests(groupId);
    setAcceptedRequests(updated.sort((a, b) => b.acceptedAt.getTime() - a.acceptedAt.getTime()));
  };

  const handleReject = async (request: JoinRequest) => {
    if (!profile?.groupId) return;
    await rejectJoinRequest(profile.groupId, request.uid);
    removeRequest(request.uid);
  };

  const adminSections: NotificationSection[] = [
    {
      id: "today",
      label: t("sections.today"),
      hasDot: true,
      items: [
        {
          id: "deadline-soon-sopar",
          iconName: "clock-simple",
          iconBg: "orange",
          title: t("deadlineSoonSopar.title"),
          message: t("deadlineSoonSopar.message"),
        },
      ],
    },
    {
      id: "this-week",
      label: t("sections.thisWeek"),
      items: [
        {
          id: "new-event-berenar",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEventBerenar.title"),
          message: t("newEventBerenar.message"),
        },
        {
          id: "event-modified-reunio",
          iconName: "edit",
          iconBg: "teal",
          title: t("eventModifiedReunio.title"),
          message: t("eventModifiedReunio.message"),
        },
        {
          id: "deadline-soon-reunio",
          iconName: "clock-simple",
          iconBg: "orange",
          title: t("deadlineSoonReunio.title"),
          message: t("deadlineSoonReunio.message"),
        },
        {
          id: "new-event-missa",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEventMissa.title"),
          message: t("newEventMissa.message"),
        },
        {
          id: "deadline-soon-assemblea-admin",
          iconName: "clock-simple",
          iconBg: "orange",
          title: t("deadlineSoonAssembleaAdmin.title"),
          message: t("deadlineSoonAssembleaAdmin.message"),
        },
        {
          id: "join-request-accepted",
          iconName: "person-add",
          iconBg: "teal",
          title: t("joinRequestAccepted.title"),
          message: t("joinRequestAccepted.message"),
        },
      ],
    },
  ];

  const memberSections: NotificationSection[] = [
    {
      id: "today",
      label: t("sections.today"),
      hasDot: true,
      items: [
        {
          id: "event-modified-sopar",
          iconName: "edit",
          iconBg: "teal",
          title: t("eventModifiedSopar.title"),
          message: t("eventModifiedSopar.message"),
        },
        {
          id: "new-event-berenar",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEventBerenar.title"),
          message: t("newEventBerenar.message"),
        },
      ],
    },
    {
      id: "this-week",
      label: t("sections.thisWeek"),
      items: [
        {
          id: "deadline-soon-assemblea",
          iconName: "clock-simple",
          iconBg: "orange",
          title: t("deadlineSoonAssemblea.title"),
          message: t("deadlineSoonAssemblea.message"),
        },
        {
          id: "role-changed-member",
          iconName: "asterisk",
          iconBg: "brand",
          title: t("roleChangedMember.title"),
          message: t("roleChangedMember.message"),
        },
        {
          id: "new-event-missa",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEventMissa.title"),
          message: t("newEventMissa.message"),
        },
        {
          id: "new-event-visita",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEventVisita.title"),
          message: t("newEventVisita.message"),
        },
      ],
    },
  ];

  const sections = isAdminOrOrg ? adminSections : memberSections;

  const isToday = (date: Date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  };

  const todayAccepted = acceptedRequests.filter(r => isToday(r.acceptedAt));
  const thisWeekAccepted = acceptedRequests.filter(r => !isToday(r.acceptedAt));

  return (
    <PageTransition>
    <div className="notifications-page">
      <div className="notifications-page__header">
        <BackButton />
        <h1 className="notifications-page__title">{t("title")}</h1>
      </div>
      <div className="notifications-page__content">
        {isAdminOrOrg && (
          <div className="notifications-page__requests-btn">
            <Button
              text={t("requestsPage.viewAll")}
              variant="secondary"
              className="button--compact"
              to="/notifications/requests"
            />
          </div>
        )}
        {sections.map(section => (
          <section key={section.id} className="notifications-page__section">
            <div className="notifications-page__section-header">
              {section.hasDot && <span className="notifications-page__section-dot" aria-hidden="true" />}
              <span className="notifications-page__section-label">{section.label}</span>
            </div>
            <ul className="notifications-page__list">
              {section.id === "today" && newEventNotifications.filter(notification => isToday(notification.createdAt)).map(notification => (
                <li key={`event-${notification.eventId}`}>
                  <NotificationItem
                    iconName="calendar-plus"
                    iconBg="blue"
                    title={t("newEvent.title")}
                    message={notification.title}
                    cta={{ label: t("newEvent.cta"), to: `/events/${notification.eventId}` }}
                  />
                </li>
              ))}
              {section.id === "this-week" && newEventNotifications.filter(notification => !isToday(notification.createdAt)).map(notification => (
                <li key={`event-${notification.eventId}`}>
                  <NotificationItem
                    iconName="calendar-plus"
                    iconBg="blue"
                    title={t("newEvent.title")}
                    message={notification.title}
                    cta={{ label: t("newEvent.cta"), to: `/events/${notification.eventId}` }}
                  />
                </li>
              ))}
              {section.id === "today" && todayAccepted.map(r => (
                <li key={`accepted-${r.uid}`}>
                  <NotificationItem
                    iconName="person-add"
                    iconBg="teal"
                    title={`${r.firstName} ${r.lastName}`}
                    message={t("joinRequestAccepted.message")}
                  />
                </li>
              ))}
              {section.id === "this-week" && thisWeekAccepted.map(r => (
                <li key={`accepted-${r.uid}`}>
                  <NotificationItem
                    iconName="person-add"
                    iconBg="teal"
                    title={`${r.firstName} ${r.lastName}`}
                    message={t("joinRequestAccepted.message")}
                  />
                </li>
              ))}
              {section.id === "today" && isAdminOrOrg && realRequests.map(request => (
                <li key={request.uid}>
                  <JoinRequestItem
                    iconName="person-add"
                    iconBg="teal"
                    title={`${request.firstName} ${request.lastName}`}
                    message={t("requestsPage.realMessage", { group: group?.name ?? "" })}
                    onAccept={async () => handleApprove(request)}
                    onReject={async () => handleReject(request)}
                  />
                </li>
              ))}
              {section.items.map(item => (
                <li key={item.id}>
                  {item.variant === "joinRequest" ? (
                    <JoinRequestItem
                      iconName={item.iconName}
                      iconBg={item.iconBg}
                      title={item.title}
                      message={item.message}
                      onAccept={() => Promise.resolve()}
                      onReject={() => Promise.resolve()}
                    />
                  ) : (
                    <NotificationItem
                      iconName={item.iconName}
                      iconBg={item.iconBg}
                      title={item.title}
                      message={item.message}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
    </PageTransition>
  );
};

export default NotificationsPage;
