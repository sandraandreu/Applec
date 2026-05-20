import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import BackButton from "../../ui-kit/button/icon-buttons/back-button/BackButton";
import NotificationItem from "./notification-item/NotificationItem";
import type { NotificationIconBg } from "./notification-item/NotificationItem";
import type { IconName } from "../../ui-kit/icons/icon/Icon";
import "./notifications.scss";

interface NotificationData {
  id: string;
  iconName: IconName;
  iconBg: NotificationIconBg;
  title: string;
  message: string;
  cta?: { label: string; to: string };
  adminOrOrgOnly?: boolean;
}

interface NotificationSection {
  id: string;
  label: string;
  hasDot?: boolean;
  items: NotificationData[];
}

const NotificationsPage = () => {
  const { t } = useTranslation("notifications");
  const { user } = useAuthContext();

  const isAdminOrOrg = !!user?.permissions.canCreateEvents;

  const sections: NotificationSection[] = [
    {
      id: "today",
      label: t("sections.today"),
      hasDot: true,
      items: [
        {
          id: "new-event",
          iconName: "calendar-plus",
          iconBg: "blue",
          title: t("newEvent.title"),
          message: t("newEvent.message"),
          cta: { label: t("newEvent.cta"), to: "/events" },
        },
        {
          id: "event-cancelled",
          iconName: "x-square",
          iconBg: "red",
          title: t("eventCancelled.title"),
          message: t("eventCancelled.message"),
        },
        {
          id: "join-request",
          iconName: "person-add",
          iconBg: "teal",
          title: t("joinRequest.title"),
          message: t("joinRequest.message"),
          cta: { label: t("joinRequest.cta"), to: "/members" },
          adminOrOrgOnly: true,
        },
      ],
    },
    {
      id: "this-week",
      label: t("sections.thisWeek"),
      items: [
        {
          id: "deadline-closed",
          iconName: "error-circle",
          iconBg: "red",
          title: t("deadlineClosed.title"),
          message: t("deadlineClosed.message"),
        },
        {
          id: "new-post",
          iconName: "chat-dots",
          iconBg: "purple",
          title: t("newPost.title"),
          message: t("newPost.message"),
          cta: { label: t("newPost.cta"), to: "/feed" },
        },
        {
          id: "event-modified",
          iconName: "edit",
          iconBg: "teal",
          title: t("eventModified.title"),
          message: t("eventModified.message"),
          cta: { label: t("eventModified.cta"), to: "/events" },
        },
        {
          id: "deadline-soon",
          iconName: "clock-simple",
          iconBg: "orange",
          title: t("deadlineSoon.title"),
          message: t("deadlineSoon.message"),
          cta: { label: t("deadlineSoon.cta"), to: "/events" },
        },
        {
          id: "role-changed",
          iconName: "asterisk",
          iconBg: "brand",
          title: t("roleChanged.title"),
          message: t("roleChanged.message"),
          cta: { label: t("roleChanged.cta"), to: "/profile" },
        },
      ],
    },
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOrOrgOnly || isAdminOrOrg),
  }));

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <BackButton />
        <h1 className="notifications-page__title">{t("title")}</h1>
      </div>
      <div className="notifications-page__content">
        {filteredSections.map(section => (
          <section key={section.id} className="notifications-page__section">
            <div className="notifications-page__section-header">
              {section.hasDot && <span className="notifications-page__section-dot" aria-hidden="true" />}
              <span className="notifications-page__section-label">{section.label}</span>
            </div>
            <ul className="notifications-page__list">
              {section.items.map(item => (
                <li key={item.id}>
                  <NotificationItem
                    iconName={item.iconName}
                    iconBg={item.iconBg}
                    title={item.title}
                    message={item.message}
                    cta={item.cta}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
