import { IonPage, IonContent } from "@ionic/react";
import "./ForgotPasswordPage.scss";
import ForgotPassword from "../../components/auth/forgotPassword/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <IonPage>
      <IonContent>
        <ForgotPassword />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
