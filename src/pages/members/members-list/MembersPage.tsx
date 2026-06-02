import "./members-list.scss";
import Search from "../../../ui-kit/search/Search";
import MembersList from "../../../components/members/MembersList";
import SuccessBanner from "../../../ui-kit/success-banner/SuccessBanner";
import Button from "../../../ui-kit/button/Button";
import Icon from "../../../ui-kit/icons/icon/Icon";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const MembersPage = () => {
  const { t } = useTranslation("members");
  const { group } = useGroupContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState<string>("");
  const locationState = (location.state ?? {}) as { roleUpdated?: boolean; memberDeleted?: boolean };
  const [showRoleUpdated, setShowRoleUpdated] = useState(!!locationState.roleUpdated);
  const [showMemberDeleted, setShowMemberDeleted] = useState(!!locationState.memberDeleted);

  useEffect(() => {
    if (showRoleUpdated || showMemberDeleted) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  return (
    <div className="members-page">
        {showRoleUpdated && (
          <SuccessBanner message={t("detail.roleUpdated")} onDismiss={() => setShowRoleUpdated(false)} />
        )}
        {showMemberDeleted && (
          <SuccessBanner message={t("detail.memberDeleted")} onDismiss={() => setShowMemberDeleted(false)} />
        )}
        <div className="members-page__top">
          <h1 className="members-page__title">{group?.name}</h1>
        </div>

        <Search
          placeholder={t("members.search")}
          onChange={(value) => setSearchValue(value)}
        />

        {user?.permissions.canInviteMembers && (
          <Button
            variant="secondary"
            className="button--compact members-page__invite-btn"
            icon={<Icon name="plus" size={20} />}
            text={t("members.invite")}
            to="/invite-group"
          />
        )}

        <MembersList searchValue={searchValue} />
    </div>
  );
};

export default MembersPage;
