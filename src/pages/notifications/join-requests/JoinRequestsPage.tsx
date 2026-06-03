import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import {
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from "../../../services/group.service";
import type { JoinRequest } from "../../../models/user.model";
import BackButton from "../../../ui-kit/button/icon-buttons/back-button/BackButton";
import JoinRequestItem from "../join-request-item/JoinRequestItem";
import EmptyState from "../../../ui-kit/empty-state/EmptyState";
import Loading from "../../../components/loading/Loading";
import "./join-requests.scss";

const DEMO_REQUESTS = ["pere", "julia", "andreu", "rosa"] as const;

const JoinRequestsPage = () => {
  const { t } = useTranslation("notifications");
  const { profile } = useAuthContext();
  const { group } = useGroupContext();

  const [realRequests, setRealRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedDemoIds, setDismissedDemoIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!profile?.groupId) return;
    let isMounted = true;
    getJoinRequests(profile.groupId).then(requests => {
      if (!isMounted) return;
      setRealRequests(requests);
      setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [profile?.groupId]);

  const handleApprove = async (request: JoinRequest) => {
    if (!profile?.groupId) return;
    await approveJoinRequest(profile.groupId, request.uid, {
      firstName: request.firstName,
      lastName: request.lastName,
    });
    setRealRequests(prev => prev.filter(r => r.uid !== request.uid));
  };

  const handleReject = async (request: JoinRequest) => {
    if (!profile?.groupId) return;
    await rejectJoinRequest(profile.groupId, request.uid);
    setRealRequests(prev => prev.filter(r => r.uid !== request.uid));
  };

  const dismissDemo = (id: string) => {
    setDismissedDemoIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const visibleDemoRequests = DEMO_REQUESTS.filter(id => !dismissedDemoIds.has(id));
  const isEmpty = !isLoading && realRequests.length === 0 && visibleDemoRequests.length === 0;

  return (
    <div className="join-requests-page">
      <div className="join-requests-page__header">
        <BackButton />
        <h1 className="join-requests-page__title">{t("requestsPage.title")}</h1>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <ul className="join-requests-page__list">
          {realRequests.map(request => (
            <li key={request.uid}>
              <JoinRequestItem
                iconName="person-add"
                iconBg="teal"
                title={`${request.firstName} ${request.lastName}`}
                message={t("requestsPage.realMessage", { group: group?.name ?? "" })}
                onAccept={async () => handleApprove(request)}
                onReject={async () => handleReject(request)}
              />
            </li>
          ))}
          {visibleDemoRequests.map(id => (
            <li key={id}>
              <JoinRequestItem
                iconName="person-add"
                iconBg="teal"
                title={t(`requestsPage.${id}`)}
                message={t("requestsPage.message")}
                onAccept={async () => dismissDemo(id)}
                onReject={async () => dismissDemo(id)}
              />
            </li>
          ))}
        </ul>
      )}

      {isEmpty && (
        <EmptyState title={t("requestsPage.empty")} variant="light" expand />
      )}
    </div>
  );
};

export default JoinRequestsPage;
