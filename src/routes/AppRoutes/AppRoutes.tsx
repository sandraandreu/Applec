import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import LoginPage from "../../pages/login/LoginPage";
import RegisterPage from "../../pages/register/RegisterPage";
import Home from "../../pages/home/Home";
import ForgotPasswordPage from "../../pages/forgotPassword/ForgotPasswordPage";

const AppRoutes = () => (
  <>
    <IonReactRouter>
      <IonRouterOutlet>

        <Route exact path="/" render={() => <Redirect to="/home" />} />

        <Route exact path="/home" render={() => (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        )} />

        <Route exact path="/register" render={() => (
          <PublicRoutes>
            <RegisterPage />
          </PublicRoutes>
        )} />

        <Route exact path="/login" render={() => (
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        )} />

        <Route exact path="/forgot-password" render={() => (
          <PublicRoutes>
            <ForgotPasswordPage />
          </PublicRoutes>
        )} />

      </IonRouterOutlet>
    </IonReactRouter>
  </>
);

export default AppRoutes;