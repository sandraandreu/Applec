import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Chip from "../../../ui-kit/chip/Chip";
import Icon from "../../../ui-kit/icons/icon/Icon";
import PageTransition from "../../../ui-kit/page-transition/PageTransition";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { FEED_POSTS } from "../feed.mock";
import "./feed-detail.scss";


const FeedDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("feed");
  const { profile } = useAuthContext();

  const post = FEED_POSTS.find(p => p.id === id) ?? FEED_POSTS[0];

  const [liked, setLiked] = useState(post.likedByMe);
  const likesCount = post.likesCount - (post.likedByMe ? 1 : 0) + (liked ? 1 : 0);

  return (
    <PageTransition>
      <div className="feed-detail">
        <div className="feed-detail__header">
          <BackButton />
          <h1 className="feed-detail__title">{t("postDetail")}</h1>
        </div>

        <div className="feed-detail__scroll">
          <div className="feed-detail__post">
            <div className="feed-detail__post-header">
              <Avatar
                firstName={post.author.firstName}
                lastName={post.author.lastName}
                role={post.author.role}
                photoUrl={post.author.photoUrl}
                size="md"
              />
              <div className="feed-detail__author">
                <span className="feed-detail__author-name">{post.author.firstName} {post.author.lastName}</span>
                <span className="feed-detail__author-time">{post.timeAgo}</span>
              </div>
              {post.author.role !== "member" && (
                <Chip role={post.author.role} variant="full" />
              )}
            </div>

            {post.linkedEvent && (
              <div className="feed-detail__event">
                <div className="feed-detail__event-date">
                  <span className="feed-detail__event-day">{post.linkedEvent.day}</span>
                  <span className="feed-detail__event-month">{post.linkedEvent.month}</span>
                </div>
                <div className="feed-detail__event-info">
                  <span className="feed-detail__event-name">{post.linkedEvent.name}</span>
                  <span className="feed-detail__event-meta">{post.linkedEvent.location} · {post.linkedEvent.time}</span>
                </div>
              </div>
            )}

            <p className="feed-detail__text">{post.text}</p>

            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="feed-detail__image" />
            )}

            <div className="feed-detail__stats">
              <button
                className={`feed-detail__like-btn${liked ? " feed-detail__like-btn--active" : ""}`}
                onClick={() => setLiked(prev => !prev)}
                aria-label={liked ? t("unlike") : t("like")}
                aria-pressed={liked}
                type="button"
              >
                <Icon name={liked ? "heart-filled" : "heart"} size={28} />
                <span>{likesCount}</span>
              </button>
              <div className="feed-detail__stat">
                <Icon name="chat-dots" size={28} />
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>

          <div className="feed-detail__divider" />

          <div className="feed-detail__comments">
            <h2 className="feed-detail__comments-title">{t("comments")}</h2>
            <ul className="feed-detail__comments-list">
              {post.comments.map(comment => {
                return (
                  <li key={comment.id} className="feed-detail__comment">
                    <Avatar
                      firstName={comment.author.firstName}
                      lastName={comment.author.lastName}
                      role={comment.author.role}
                      photoUrl={comment.author.photoUrl}
                      size="md"
                    />
                    <div className="feed-detail__comment-body">
                      <div className="feed-detail__comment-meta">
                        <span className="feed-detail__comment-name">{comment.author.firstName} {comment.author.lastName}</span>
                        {comment.author.role !== "member" && (
                          <Chip role={comment.author.role} variant="full" />
                        )}
                      </div>
                      <span className="feed-detail__comment-time">{comment.timeAgo}</span>
                      <p className="feed-detail__comment-text">{comment.text}</p>
                      <div className="feed-detail__comment-actions">
                        <button className="feed-detail__comment-like" type="button" aria-label={t("like")}>
                          <Icon name="heart" size={22} />
                          <span>{comment.likesCount}</span>
                        </button>
                        <button className="feed-detail__comment-reply" type="button">
                          {t("reply")}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="feed-detail__input-bar">
          {profile ? (
            <Avatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              role={profile.role}
              size="sm"
            />
          ) : (
            <div className="feed-detail__input-avatar" />
          )}
          <div className="feed-detail__input-placeholder">
            {t("writeComment")}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FeedDetailPage;
