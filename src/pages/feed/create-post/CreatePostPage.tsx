import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageTransition from "../../../ui-kit/page-transition/PageTransition";
import PageHeader from "../../../components/layout/PageHeader";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Icon from "../../../ui-kit/icons/icon/Icon";
import Button from "../../../ui-kit/button/Button";
import { useAuthContext } from "../../../context/auth/AuthContext";
import EventPickerSheet from "./EventPickerSheet";
import type { FeedLinkedEvent } from "../feed.mock";
import "./create-post.scss";

const CreatePostPage = () => {
  const { t } = useTranslation("feed");
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [linkedEvent, setLinkedEvent] = useState<FeedLinkedEvent | null>(null);
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);

  return (
    <PageTransition>
      <div className="create-post">
        <div className="create-post__header">
          <PageHeader
            title={t("createPost.title")}
            onBack={() => navigate("/feed")}
          />
        </div>

        <div className="create-post__scroll">
          <div className="create-post__author">
            {profile && (
              <Avatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                role={profile.role}
                size="md"
              />
            )}
            <span className="create-post__author-name">
              {profile?.firstName} {profile?.lastName}
            </span>
          </div>

          <div className="create-post__actions">
            <button
              type="button"
              className="create-post__action-btn"
              aria-label={t("createPost.addPhoto")}
            >
              <Icon name="gallery" size={24} aria-hidden="true" />
              <span className="create-post__action-label">{t("createPost.addPhoto")}</span>
            </button>
            <button
              type="button"
              className={`create-post__action-btn create-post__action-btn--event${linkedEvent ? " create-post__action-btn--active" : ""}`}
              aria-label={t("createPost.linkEvent")}
              onClick={() => setIsEventSheetOpen(true)}
            >
              <Icon name="calendar-plus" size={24} aria-hidden="true" />
              <span className="create-post__action-label">{t("createPost.linkEvent")}</span>
            </button>
          </div>

          {linkedEvent && (
            <div className="create-post__linked-event">
              <div className="create-post__event-date">
                <span className="create-post__event-day">{linkedEvent.day}</span>
                <span className="create-post__event-month">{linkedEvent.month}</span>
              </div>
              <div className="create-post__event-info">
                <span className="create-post__event-name">{linkedEvent.name}</span>
                <span className="create-post__event-meta">{linkedEvent.location} · {linkedEvent.time}</span>
              </div>
              <button
                type="button"
                className="create-post__event-remove"
                aria-label={t("createPost.removeEvent")}
                onClick={() => setLinkedEvent(null)}
              >
                <Icon name="x-mark" size={20} aria-hidden="true" />
              </button>
            </div>
          )}

          <textarea
            className="create-post__textarea"
            placeholder={t("createPost.placeholder")}
            rows={6}
          />
        </div>

        <div className="create-post__footer">
          <Button text={t("createPost.publish")} />
        </div>

        <EventPickerSheet
          isOpen={isEventSheetOpen}
          onDismiss={() => setIsEventSheetOpen(false)}
          onSelect={(event) => {
            setLinkedEvent(event);
            setIsEventSheetOpen(false);
          }}
          selectedEventName={linkedEvent?.name}
        />
      </div>
    </PageTransition>
  );
};

export default CreatePostPage;
