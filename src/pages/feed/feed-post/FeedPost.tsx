import { memo } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../../ui-kit/avatar/Avatar";
import Icon from "../../../ui-kit/icons/icon/Icon";
import type { FeedPostData } from "../feed.mock";
import "./feed-post.scss";

const roleBadgeLabel = (role: "admin" | "organizer" | "member") => {
  if (role === "admin") return "Admin.";
  if (role === "organizer") return "Org.";
  return null;
};

interface FeedPostProps {
  post: FeedPostData;
}

const FeedPost = ({ post }: FeedPostProps) => {
  const badge = roleBadgeLabel(post.author.role);

  return (
    <Link to={`/feed/${post.id}`} className="feed-post">
      <div className="feed-post__header">
        <Avatar
          firstName={post.author.firstName}
          lastName={post.author.lastName}
          role={post.author.role}
          size="md"
        />
        <div className="feed-post__author">
          <span className="feed-post__name">{post.author.firstName} {post.author.lastName}</span>
          <span className="feed-post__time">{post.timeAgo}</span>
        </div>
        {badge && (
          <span className={`feed-post__badge feed-post__badge--${post.author.role}`}>{badge}</span>
        )}
      </div>

      {post.linkedEvent && (
        <div className="feed-post__event">
          <div className="feed-post__event-date">
            <span className="feed-post__event-day">{post.linkedEvent.day}</span>
            <span className="feed-post__event-month">{post.linkedEvent.month}</span>
          </div>
          <div className="feed-post__event-info">
            <span className="feed-post__event-name">{post.linkedEvent.name}</span>
            <span className="feed-post__event-meta">{post.linkedEvent.location} · {post.linkedEvent.time}</span>
          </div>
        </div>
      )}

      <p className="feed-post__text">{post.text}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="feed-post__image" />
      )}

      <div className="feed-post__footer">
        <div className={`feed-post__stat${post.likedByMe ? " feed-post__stat--liked" : ""}`}>
          <Icon name={post.likedByMe ? "heart-filled" : "heart"} size={28} />
          <span>{post.likesCount}</span>
        </div>
        <div className="feed-post__stat feed-post__stat--comment">
          <Icon name="chat-dots" size={28} />
          <span>{post.commentsCount}</span>
        </div>
      </div>
    </Link>
  );
};

export default memo(FeedPost);
