import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";
import "./layout.scss";

const TopBar = () => {
  const { t } = useTranslation("common");
  const { profile } = useAuthContext();
  const { group } = useGroupContext();

  if (!profile || !group) return null;

  const isAdminOrOrganizer = profile.role === "admin" || profile.role === "organizer";

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
        {isAdminOrOrganizer && (
          <Link
            to="/events/create"
            className="top-bar__action"
            aria-label={t("nav.createEvent")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M21.875 13.9989H6.125M14 6.1239V21.8739V6.1239Z" stroke="#4C4C4C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}

        <button
          className="top-bar__action"
          aria-label={t("nav.notifications")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M17.4998 20.9999V21.8749C17.4998 22.8031 17.131 23.6934 16.4747 24.3497C15.8183 25.0061 14.928 25.3749 13.9998 25.3749C13.0715 25.3749 12.1813 25.0061 11.5249 24.3497C10.8685 23.6934 10.4998 22.8031 10.4998 21.8749V20.9999M23.3885 19.2187C21.9842 17.4999 20.9927 16.6249 20.9927 11.8862C20.9927 7.54675 18.7767 6.00074 16.9529 5.24988C16.7106 5.15035 16.4826 4.92175 16.4088 4.67292C16.0888 3.5841 15.192 2.62488 13.9998 2.62488C12.8076 2.62488 11.9102 3.58464 11.5935 4.67402C11.5197 4.92558 11.2917 5.15035 11.0494 5.24988C9.22338 6.00183 7.00963 7.54238 7.00963 11.8862C7.00689 16.6249 6.01541 17.4999 4.61103 19.2187C4.02916 19.9307 4.53884 20.9999 5.55658 20.9999H22.4485C23.4607 20.9999 23.9671 19.9275 23.3885 19.2187Z" stroke="#4C4C4C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
