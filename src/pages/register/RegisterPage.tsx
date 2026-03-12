import { IonPage, IonContent } from "@ionic/react";
import "./RegisterPage.scss";
import Register from "../../components/auth/register/Register";

const RegisterPage = () => {
  return (
    <IonPage>
      <IonContent>
        <Register />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
