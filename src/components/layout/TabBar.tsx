import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import "./layout.scss";

const ACTIVE = "#0068FF";
const INACTIVE = "#4C4C4C";

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

  if (!profile) return null;

  const active = getActiveTab(pathname);
  const isAdminOrOrganizer = profile.role === "admin" || profile.role === "organizer";

  return (
    <nav className="tab-bar" aria-label={t("nav.tabBar")}>
      <div className="tab-bar__items">

        <Link
          to="/feed"
          className="tab-bar__item"
          aria-current={active === "feed" ? "page" : undefined}
          aria-label={t("nav.feed")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M23.5703 17.5365C23.5156 17.3396 23.6359 17.0662 23.7507 16.8693C23.7858 16.8107 23.8242 16.7541 23.8656 16.6998C24.8479 15.2401 25.3734 13.5209 25.375 11.7615C25.3914 6.71929 21.1367 2.62866 15.8757 2.62866C11.2875 2.62866 7.45933 5.75132 6.56245 9.89663C6.42828 10.511 6.36044 11.1381 6.36011 11.7669C6.36011 16.8146 10.4507 21.0146 15.7117 21.0146C16.5484 21.0146 17.675 20.763 18.2929 20.5935C18.9109 20.424 19.5234 20.1998 19.682 20.1396C19.8446 20.0783 20.0168 20.0468 20.1906 20.0466C20.3801 20.0459 20.5679 20.0831 20.7429 20.156L23.8437 21.2552C23.9117 21.284 23.9836 21.3024 24.057 21.3099C24.173 21.3099 24.2843 21.2638 24.3663 21.1818C24.4484 21.0997 24.4945 20.9884 24.4945 20.8724C24.4907 20.8224 24.4815 20.7729 24.4671 20.7248L23.5703 17.5365Z" stroke={active === "feed" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
            <path d="M3.63456 12.6934C2.9173 13.9819 2.57033 15.4437 2.632 16.9172C2.69367 18.3907 3.16158 19.8184 3.98402 21.0425C4.11035 21.2334 4.18144 21.381 4.15956 21.48C4.13769 21.579 3.50714 24.8635 3.50714 24.8635C3.49198 24.9404 3.49773 25.0199 3.5238 25.0938C3.54987 25.1677 3.5953 25.2332 3.65535 25.2835C3.73547 25.3474 3.83509 25.3817 3.93753 25.3809C3.99227 25.381 4.04646 25.3698 4.09667 25.348L7.17066 24.1449C7.38222 24.0615 7.61824 24.0654 7.82691 24.1559C8.86269 24.5595 10.0078 24.8121 11.1535 24.8121C12.691 24.8137 14.2014 24.4082 15.5313 23.6369" stroke={active === "feed" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
          </svg>
        </Link>

        <Link
          to="/events/calendar"
          className="tab-bar__item"
          aria-current={active === "calendar" ? "page" : undefined}
          aria-label={t("nav.calendar")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M22.75 4.37402H5.25C3.80025 4.37402 2.625 5.54928 2.625 6.99902V22.749C2.625 24.1988 3.80025 25.374 5.25 25.374H22.75C24.1997 25.374 25.375 24.1988 25.375 22.749V6.99902C25.375 5.54928 24.1997 4.37402 22.75 4.37402Z" stroke={active === "calendar" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16.1875 13.998C16.9124 13.998 17.5 13.4104 17.5 12.6855C17.5 11.9607 16.9124 11.373 16.1875 11.373C15.4626 11.373 14.875 11.9607 14.875 12.6855C14.875 13.4104 15.4626 13.998 16.1875 13.998Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M20.5625 13.998C21.2874 13.998 21.875 13.4104 21.875 12.6855C21.875 11.9607 21.2874 11.373 20.5625 11.373C19.8376 11.373 19.25 11.9607 19.25 12.6855C19.25 13.4104 19.8376 13.998 20.5625 13.998Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M16.1875 18.373C16.9124 18.373 17.5 17.7854 17.5 17.0605C17.5 16.3357 16.9124 15.748 16.1875 15.748C15.4626 15.748 14.875 16.3357 14.875 17.0605C14.875 17.7854 15.4626 18.373 16.1875 18.373Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M20.5625 18.373C21.2874 18.373 21.875 17.7854 21.875 17.0605C21.875 16.3357 21.2874 15.748 20.5625 15.748C19.8376 15.748 19.25 16.3357 19.25 17.0605C19.25 17.7854 19.8376 18.373 20.5625 18.373Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M7.4375 18.373C8.16237 18.373 8.75 17.7854 8.75 17.0605C8.75 16.3357 8.16237 15.748 7.4375 15.748C6.71263 15.748 6.125 16.3357 6.125 17.0605C6.125 17.7854 6.71263 18.373 7.4375 18.373Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M11.8125 18.373C12.5374 18.373 13.125 17.7854 13.125 17.0605C13.125 16.3357 12.5374 15.748 11.8125 15.748C11.0876 15.748 10.5 16.3357 10.5 17.0605C10.5 17.7854 11.0876 18.373 11.8125 18.373Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M7.4375 22.748C8.16237 22.748 8.75 22.1604 8.75 21.4355C8.75 20.7107 8.16237 20.123 7.4375 20.123C6.71263 20.123 6.125 20.7107 6.125 21.4355C6.125 22.1604 6.71263 22.748 7.4375 22.748Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M11.8125 22.748C12.5374 22.748 13.125 22.1604 13.125 21.4355C13.125 20.7107 12.5374 20.123 11.8125 20.123C11.0876 20.123 10.5 20.7107 10.5 21.4355C10.5 22.1604 11.0876 22.748 11.8125 22.748Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M16.1875 22.748C16.9124 22.748 17.5 22.1604 17.5 21.4355C17.5 20.7107 16.9124 20.123 16.1875 20.123C15.4626 20.123 14.875 20.7107 14.875 21.4355C14.875 22.1604 15.4626 22.748 16.1875 22.748Z" fill={active === "calendar" ? ACTIVE : INACTIVE}/>
            <path d="M21 2.62305V4.37305M7 2.62305V4.37305V2.62305Z" stroke={active === "calendar" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25.375 8.74902H2.625" stroke={active === "calendar" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </Link>

        <Link
          to="/events"
          className="tab-bar__item"
          aria-current={active === "events" ? "page" : undefined}
          aria-label={t("nav.events")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M22.9212 9.62183H5.07883C4.20687 9.62183 3.5 10.3287 3.5 11.2007V22.043C3.5 22.915 4.20687 23.6218 5.07883 23.6218H22.9212C23.7931 23.6218 24.5 22.915 24.5 22.043V11.2007C24.5 10.3287 23.7931 9.62183 22.9212 9.62183Z" stroke={active === "events" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7.875 4.37402H20.125H7.875ZM6.125 6.99902H21.875Z" fill={active === "events" ? ACTIVE : INACTIVE}/>
            <path d="M6.125 6.99902H21.875M7.875 4.37402H20.125H7.875Z" stroke={active === "events" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
          </svg>
        </Link>

        {isAdminOrOrganizer && (
          <Link
            to="/members"
            className="tab-bar__item"
            aria-current={active === "members" ? "page" : undefined}
            aria-label={t("nav.members")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M21.9844 9.19043C21.8242 11.4146 20.1743 13.1279 18.3751 13.1279C16.5758 13.1279 14.9232 11.4151 14.7657 9.19043C14.6016 6.8766 16.2078 5.25293 18.3751 5.25293C20.5423 5.25293 22.1485 6.91871 21.9844 9.19043Z" stroke={active === "members" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.375 16.627C14.811 16.627 11.3838 18.3972 10.5252 21.8447C10.4114 22.3008 10.6974 22.752 11.1661 22.752H25.5845C26.0531 22.752 26.3375 22.3008 26.2254 21.8447C25.3668 18.342 21.9396 16.627 18.375 16.627Z" stroke={active === "members" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeMiterlimit="10"/>
              <path d="M10.9375 10.1727C10.8096 11.949 9.47628 13.3479 8.0391 13.3479C6.60191 13.3479 5.26644 11.9495 5.14066 10.1727C5.00996 8.32485 6.30769 7.00415 8.0391 7.00415C9.7705 7.00415 11.0682 8.35876 10.9375 10.1727Z" stroke={active === "members" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.2657 16.7377C10.2786 16.2855 9.19137 16.1116 8.03911 16.1116C5.19536 16.1116 2.45552 17.5252 1.76919 20.2788C1.67895 20.643 1.90755 21.0034 2.28161 21.0034H8.42192" stroke={active === "members" ? ACTIVE : INACTIVE} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
            </svg>
          </Link>
        )}

        <Link
          to="/profile"
          className="tab-bar__item"
          aria-current={active === "profile" ? "page" : undefined}
          aria-label={t("nav.profile")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14.1584 2.63118C7.76109 2.54478 2.53843 7.76743 2.62484 14.1648C2.71015 20.3002 7.70585 25.2959 13.8412 25.3812C20.2397 25.4687 25.4612 20.246 25.3737 13.8487C25.2895 7.7122 20.2938 2.7165 14.1584 2.63118ZM21.072 20.5277C21.0502 20.5512 21.0235 20.5697 20.9938 20.5818C20.9641 20.5939 20.9321 20.5993 20.9 20.5976C20.868 20.5959 20.8367 20.5872 20.8084 20.5721C20.7801 20.557 20.7555 20.5359 20.7362 20.5102C20.2471 19.8702 19.6481 19.3223 18.9671 18.892C17.5748 17.9984 15.8105 17.5062 13.9998 17.5062C12.1891 17.5062 10.4249 17.9984 9.03257 18.892C8.35164 19.3221 7.75261 19.8698 7.26343 20.5096C7.24421 20.5353 7.21958 20.5565 7.19127 20.5716C7.16297 20.5867 7.13168 20.5954 7.09964 20.5971C7.0676 20.5987 7.03558 20.5933 7.00586 20.5812C6.97613 20.5692 6.94943 20.5507 6.92765 20.5271C5.32294 18.7948 4.41393 16.5313 4.37484 14.1702C4.2857 8.84861 8.65249 4.39431 13.9763 4.38118C19.3001 4.36806 23.6248 8.69111 23.6248 14.0062C23.6267 16.4241 22.7148 18.7535 21.072 20.5277Z" fill={active === "profile" ? ACTIVE : INACTIVE}/>
            <path d="M13.9999 7.87793C12.9214 7.87793 11.9464 8.28207 11.2535 9.01652C10.5606 9.75098 10.2144 10.7665 10.2926 11.8564C10.4512 14.0029 12.1142 15.7529 13.9999 15.7529C15.8855 15.7529 17.5453 14.0029 17.7071 11.857C17.7881 10.7775 17.4446 9.77121 16.7403 9.02309C16.0446 8.2848 15.0712 7.87793 13.9999 7.87793Z" fill={active === "profile" ? ACTIVE : INACTIVE}/>
          </svg>
        </Link>

      </div>
    </nav>
  );
};

export default TabBar;
