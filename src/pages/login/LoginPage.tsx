import { IonPage, IonContent } from "@ionic/react";
import "./LoginPage.scss";
import Login from "../../components/auth/login/Login";

const LoginPage = () => {
  return (
    <IonPage>
      <IonContent>
        <Login />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;