import { IonPage, IonContent } from "@ionic/react";
import "./CreateGroupPage.scss";
import CreateGroup from "../../../components/groups/createGroup/CreateGroup";

const CreateGroupPage = () => {
  return (
    <IonPage>
      <IonContent>
        <CreateGroup />
      </IonContent>
    </IonPage>
  );
};

export default CreateGroupPage;