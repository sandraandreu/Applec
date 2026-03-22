import { IonPage, IonContent } from "@ionic/react";
import "./GroupOnboardingPage.scss";
import GroupOnboarding from "../../../components/groups/groupOnboarding/GroupOnboarding";

const GroupOnboardingPage = () => {
  return (
    <IonPage>
      <IonContent>
        <GroupOnboarding />
      </IonContent>
    </IonPage>
  );
};

export default GroupOnboardingPage;