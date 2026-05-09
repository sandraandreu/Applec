import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./group.scss";
import Button from "../../../ui-kit/button/Button";
import BackButton from "../../../ui-kit/buttons/icon-buttons/back-button/BackButton";
import Stepper from "../../../ui-kit/stepper/Stepper";
import groupIllustration from "../../../assets/images/group-onboarding-illustration.png";

const GroupPage = () => {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  return (
    <div className="group-page">

      <BackButton />

      <div className="group-page__content">

        <div className="group-page__header">
          <h1 className="group-page__title h1--large">{t("group.title")}</h1>
          <p className="group-page__description">{t("group.description")}</p>
        </div>

        <div className="group-page__img">
          <img src={groupIllustration} alt="" />
        </div>

        <div className="group-page__actions">
          <Button
            text={t("group.createGroup")}
            onClick={() => navigate("/create-group")}
          />
          <Button
            text={t("group.joinGroup")}
            onClick={() => navigate("/join-group")}
          />
        </div>
        
      </div>
      <Stepper currentStep={3} totalSteps={3} />
    </div>
  );
};

export default GroupPage;
