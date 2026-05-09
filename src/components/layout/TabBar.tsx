import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import useRole from "../../hooks/useRole";
import Icon from "../../ui-kit/icons/icon/Icon";
import "./layout.scss";

const getActiveTab = (pathname: string) => {
  if (pathname === "/feed") return "feed";
  if (pathname === "/events/calendar") return "calendar";
  if (pathname.startsWith("/events")) return "events";
  if (pathname.startsWith("/members")) return "members";
  if (pathname.startsWith("/profile")) return "profile";
  return null;
};

const TabBar = () => {
  const { t } = useTranslation("common");
  const { profile } = useAuthContext();
  const { pathname } = useLocation();

  const { isAdmin, isOrganizer } = useRole();

  if (!profile) return null;

  const active = getActiveTab(pathname);
  const isAdminOrOrganizer = isAdmin || isOrganizer;

  return (
    <nav className="tab-bar" aria-label={t("nav.tabBar")}>
      <div className="tab-bar__items">

        <Link
          to="/feed"
          className="tab-bar__item"
          aria-current={active === "feed" ? "page" : undefined}
          aria-label={t("nav.feed")}
        >
          <Icon name="feed" size={32} />
        </Link>

        <Link
          to="/events/calendar"
          className="tab-bar__item"
          aria-current={active === "calendar" ? "page" : undefined}
          aria-label={t("nav.calendar")}
        >
          <Icon name="calendar" size={32} />
        </Link>

        <Link
          to="/events"
          className="tab-bar__item"
          aria-current={active === "events" ? "page" : undefined}
          aria-label={t("nav.events")}
        >
          <Icon name="ticket" size={32} />
        </Link>

        {isAdminOrOrganizer && (
          <Link
            to="/members"
            className="tab-bar__item"
            aria-current={active === "members" ? "page" : undefined}
            aria-label={t("nav.members")}
          >
            <Icon name="users" size={32} />
          </Link>
        )}

        <Link
          to="/profile"
          className="tab-bar__item"
          aria-current={active === "profile" ? "page" : undefined}
          aria-label={t("nav.profile")}
        >
          <Icon name="profile" size={32} />
        </Link>

      </div>
    </nav>
  );
};

export default TabBar;
