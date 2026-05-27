import "./notifications-settings.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import PageHeader from "../../../components/layout/PageHeader";
import Toggle from "../../../ui-kit/toggle/Toggle";

const defaultSettings = {
  newEvent: true,
  attendanceReminder: true,
  eventChanges: true,
  eventCancelled: true,
  newPost: true,
  adminPost: true,
  postComments: true,
  newRequests: true,
  accepted: true,
  roleChanged: true,
};

const NotificationsSettingsPage = () => {
  const { t } = useTranslation("profile");
  const { profile, user } = useAuthContext();
  const navigate = useNavigate();

  const storageKey = `notifications-settings-${user?.uid ?? "anon"}`;

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      // ignore
    }
    return defaultSettings;
  });

  if (!profile) return null;

  const toggle = (key: keyof typeof defaultSettings) =>
    setSettings((prev: typeof defaultSettings) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });

  const isNotMember = profile.role !== "member";
  const isMember = profile.role === "member";

  return (
    <div className="notifications-settings-page">
      <PageHeader title={t("notificationsSettings.title")} onBack={() => navigate(-1)} />

      <section className="notifications-settings-page__section">
        <h2 className="notifications-settings-page__section-title">
          {t("notificationsSettings.sections.events")}
        </h2>
        <div className="notifications-settings-page__card">
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.newEvent")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.newEventDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.newEvent}
              onChange={() => toggle("newEvent")}
              aria-label={t("notificationsSettings.items.newEvent")}
            />
          </div>
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.attendanceReminder")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.attendanceReminderDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.attendanceReminder}
              onChange={() => toggle("attendanceReminder")}
              aria-label={t("notificationsSettings.items.attendanceReminder")}
            />
          </div>
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.eventChanges")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.eventChangesDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.eventChanges}
              onChange={() => toggle("eventChanges")}
              aria-label={t("notificationsSettings.items.eventChanges")}
            />
          </div>
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.eventCancelled")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.eventCancelledDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.eventCancelled}
              onChange={() => toggle("eventCancelled")}
              aria-label={t("notificationsSettings.items.eventCancelled")}
            />
          </div>
        </div>
      </section>

      <section className="notifications-settings-page__section">
        <h2 className="notifications-settings-page__section-title">
          {t("notificationsSettings.sections.feed")}
        </h2>
        <div className="notifications-settings-page__card">
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.newPost")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.newPostDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.newPost}
              onChange={() => toggle("newPost")}
              aria-label={t("notificationsSettings.items.newPost")}
            />
          </div>
          {profile.role !== "admin" && (
            <div className="notifications-settings-page__row">
              <div className="notifications-settings-page__row-text">
                <span className="notifications-settings-page__row-label">
                  {t("notificationsSettings.items.adminPost")}
                </span>
                <span className="notifications-settings-page__row-desc">
                  {t("notificationsSettings.items.adminPostDesc")}
                </span>
              </div>
              <Toggle
                checked={settings.adminPost}
                onChange={() => toggle("adminPost")}
                aria-label={t("notificationsSettings.items.adminPost")}
              />
            </div>
          )}
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.postComments")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.postCommentsDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.postComments}
              onChange={() => toggle("postComments")}
              aria-label={t("notificationsSettings.items.postComments")}
            />
          </div>
        </div>
      </section>

      <section className="notifications-settings-page__section">
        <h2 className="notifications-settings-page__section-title">
          {t("notificationsSettings.sections.group")}
        </h2>
        <div className="notifications-settings-page__card">
          {isNotMember && (
            <div className="notifications-settings-page__row">
              <div className="notifications-settings-page__row-text">
                <span className="notifications-settings-page__row-label">
                  {t("notificationsSettings.items.newRequests")}
                </span>
                <span className="notifications-settings-page__row-desc">
                  {t("notificationsSettings.items.newRequestsDesc")}
                </span>
              </div>
              <Toggle
                checked={settings.newRequests}
                onChange={() => toggle("newRequests")}
                aria-label={t("notificationsSettings.items.newRequests")}
              />
            </div>
          )}
          {isMember && (
            <div className="notifications-settings-page__row">
              <div className="notifications-settings-page__row-text">
                <span className="notifications-settings-page__row-label">
                  {t("notificationsSettings.items.accepted")}
                </span>
                <span className="notifications-settings-page__row-desc">
                  {t("notificationsSettings.items.acceptedDesc")}
                </span>
              </div>
              <Toggle
                checked={settings.accepted}
                onChange={() => toggle("accepted")}
                aria-label={t("notificationsSettings.items.accepted")}
              />
            </div>
          )}
          <div className="notifications-settings-page__row">
            <div className="notifications-settings-page__row-text">
              <span className="notifications-settings-page__row-label">
                {t("notificationsSettings.items.roleChanged")}
              </span>
              <span className="notifications-settings-page__row-desc">
                {t("notificationsSettings.items.roleChangedDesc")}
              </span>
            </div>
            <Toggle
              checked={settings.roleChanged}
              onChange={() => toggle("roleChanged")}
              aria-label={t("notificationsSettings.items.roleChanged")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotificationsSettingsPage;
