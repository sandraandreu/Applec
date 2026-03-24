import { IonAlert, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import "./Home.scss";
import { useTranslation } from "react-i18next";
import Alert from "../../components/feedback/alerts/Alert";
import { useState } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import LanguageSelector from "../../components/ui/language/LanguageSelector";

const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();
  const [testAlert, setTestAlert] = useState<"header" | "alert">("alert");

  //Estoy utilizando la home para ir haciendo pruebas:)
  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <h1>{t("bienvenida")}</h1>
          </IonToolbar>
          <button onClick={logout}>Logout</button>
          <LanguageSelector />
        </IonHeader>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
