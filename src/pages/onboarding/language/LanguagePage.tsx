import { IonPage, IonContent } from "@ionic/react";
import "./LanguagePage.scss";
import Language from "../../../components/onboarding/language/Language";

const LanguagePage = () => {
  return (
    <IonPage>
      <IonContent>
        <Language />
      </IonContent>
    </IonPage>
  );
};

export default LanguagePage;