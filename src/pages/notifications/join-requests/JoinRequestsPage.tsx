import { useTranslation } from "react-i18next";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import JoinRequestItem from "../join-request-item/JoinRequestItem";
import PageTransition from "../../../ui-kit/page-transition/PageTransition";
import "./join-requests.scss";

const JoinRequestsPage = () => {
  const { t } = useTranslation("notifications");

  const requests = [
    { id: "pere",   title: t("requestsPage.pere"),   message: t("requestsPage.message") },
    { id: "julia",  title: t("requestsPage.julia"),  message: t("requestsPage.message") },
    { id: "andreu", title: t("requestsPage.andreu"), message: t("requestsPage.message") },
    { id: "rosa",   title: t("requestsPage.rosa"),   message: t("requestsPage.message") },
  ];

  return (
    <PageTransition>
    <div className="join-requests-page">
      <div className="join-requests-page__header">
        <BackButton />
        <h1 className="join-requests-page__title">{t("requestsPage.title")}</h1>
      </div>
      <ul className="join-requests-page__list">
        {requests.map(request => (
          <li key={request.id}>
            <JoinRequestItem
              iconName="person-add"
              iconBg="teal"
              title={request.title}
              message={request.message}
            />
          </li>
        ))}
      </ul>
    </div>
    </PageTransition>
  );
};

export default JoinRequestsPage;
