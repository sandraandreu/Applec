import { IonPage, IonContent } from "@ionic/react";
import "./GroupPage.scss";
import Group from "../../../components/onboarding/group/Group";

const GroupPage = () => {
  return (
    <IonPage>
      <IonContent>
        <Group />
      </IonContent>
    </IonPage>
  );
};

export default GroupPage;