import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FeedPost from "./feed-post/FeedPost";
import PageTransition from "../../ui-kit/page-transition/PageTransition";
import Icon from "../../ui-kit/icons/icon/Icon";
import { FEED_POSTS } from "./feed.mock";
import "./feed.scss";

const TODAY_IDS = ["post-1", "post-2"];

const FeedPage = () => {
  const { t } = useTranslation("feed");
  const navigate = useNavigate();

  const todayPosts = FEED_POSTS.filter(post => TODAY_IDS.includes(post.id));
  const weekPosts = FEED_POSTS.filter(post => !TODAY_IDS.includes(post.id));

  return (
    <PageTransition>
      <div className="feed-page">
        <div className="feed-page__content">
          <section className="feed-page__section">
            <div className="feed-page__section-header">
              <span className="feed-page__section-dot" aria-hidden="true" />
              <span className="feed-page__section-label">{t("sections.today")}</span>
            </div>
            <ul className="feed-page__list">
              {todayPosts.map(post => (
                <li key={post.id}>
                  <FeedPost post={post} />
                </li>
              ))}
            </ul>
          </section>

          <section className="feed-page__section">
            <div className="feed-page__section-header">
              <span className="feed-page__section-label">{t("sections.thisWeek")}</span>
            </div>
            <ul className="feed-page__list">
              {weekPosts.map(post => (
                <li key={post.id}>
                  <FeedPost post={post} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <button className="feed-page__fab" aria-label={t("newPost")} type="button" onClick={() => navigate("/feed/new")}>
          <Icon name="plus" size={32} />
        </button>
      </div>
    </PageTransition>
  );
};

export default FeedPage;
