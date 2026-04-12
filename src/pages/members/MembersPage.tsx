import "./MembersPage.scss";
import Search from "../../components/ui/search/Search";
import MembersList from "../../components/members/membersList/MembersList";
import BaseLayout from "../../components/layout/baseLayout/BaseLayout";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MembersPage = () => {
  const { t } = useTranslation("members");
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <BaseLayout>
      <Search
        placeholder={t("members.search")}
        onChange={(value) => setSearchValue(value)}
      />
      <MembersList searchValue={searchValue} />
    </BaseLayout>
  );
};

export default MembersPage;
