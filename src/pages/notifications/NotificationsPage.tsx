import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
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
  const { user } = useAuthContext();

  const isAdminOrOrg = !!user?.permissions.canCreateEvents;

  const adminSections: NotificationSection[] = [
    {
      id: "today",
      label: t("sections.today"),
      hasDot: true,
      items: [
        {
          id: "join-request",
          iconName: "person-add",
          iconBg: "teal",
          title: t("joinRequest.title"),
          message: t("joinRequest.message"),
          variant: "joinRequest",
        },
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

  return (
    <PageTransition>
    <div className="notifications-page">
      <div className="notifications-page__header">
        <BackButton />
        <h1 className="notifications-page__title">{t("title")}</h1>
      </div>
      <div className="notifications-page__content">
        {sections.map(section => (
          <section key={section.id} className="notifications-page__section">
            <div className="notifications-page__section-header">
              {section.hasDot && <span className="notifications-page__section-dot" aria-hidden="true" />}
              <span className="notifications-page__section-label">{section.label}</span>
            </div>
            <ul className="notifications-page__list">
              {section.id === "today" && isAdminOrOrg && (
                <li className="notifications-page__view-all">
                  <Button
                    text={t("requestsPage.viewAll")}
                    variant="secondary"
                    className="button--compact"
                    to="/notifications/requests"
                  />
                </li>
              )}
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
