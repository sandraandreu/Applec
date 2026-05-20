import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";
import Icon from "../../ui-kit/icons/icon/Icon";
import "./layout.scss";

const TopBar = () => {
  const { t } = useTranslation("common");
  const { user, profile } = useAuthContext();
  const { group } = useGroupContext();
  const { pathname } = useLocation();
  const isOnNotifications = pathname === "/notifications";

  if (!profile || !group) return null;

  return (
    <header className="top-bar">
      {group.imageUrl ? (
        <img src={group.imageUrl} alt={group.name} className="top-bar__logo" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="top-bar__logo">
          <mask id="mask0_317_322" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
            <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_317_322)">
            <path d="M50.008 14.9753L23.9882 16.5842L43.5825 -0.730797L39.017 -5.29461L21.5782 14.4424L23.2009 -11.8318H16.7463L18.3586 14.2396L1.10724 -5.29461L-3.4583 -0.730797L16.1653 16.6031L-10.0608 14.9753V21.4299L16.2203 19.8021L-3.4583 37.179L1.10724 41.7445L18.3621 22.2103L16.7463 48.237H23.2009L21.5765 22.0075L39.017 41.7445L43.5825 37.179L23.9332 19.821L50.008 21.4299V14.9753Z" fill="#0068FF"/>
          </g>
        </svg>
      )}

      <div className="top-bar__actions">
        {user?.permissions.canCreateEvents && (
          <Link
            to="/create-events"
            className="top-bar__action"
            aria-label={t("nav.createEvent")}
          >
            <Icon name="plus" size={32} />
          </Link>
        )}

        <Link
          to="/notifications"
          className="top-bar__action"
          aria-label={t("nav.notifications")}
        >
          <span className="top-bar__bell">
            <Icon name="bell" size={32} />
            {!isOnNotifications && <span className="top-bar__badge" aria-hidden="true" />}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
