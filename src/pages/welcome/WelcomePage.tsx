import { IonPage, IonContent } from "@ionic/react";
import "./WelcomePage.scss";
import Welcome from "../../components/welcome/Welcome";

const WelcomePage = () => {
  return (
    <IonPage>
      <IonContent>
        <Welcome />
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;