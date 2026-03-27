import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
//hola
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
// hola

import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/login/LoginPage";
import RegisterPage from "../../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/forgotPassword/ForgotPasswordPage";
import CreateGroupPage from "../../pages/groups/createGroup/CreateGroupPage";
import WelcomePage from "../../pages/onboarding/welcome/WelcomePage";
import GroupPage from "../../pages/onboarding/group/GroupPage";
import LanguagePage from "../../pages/onboarding/language/LanguagePage";

// 2
const AppRoutes = () => (
  <>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        <Route
          exact
          path="/home"
          render={() => (
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          )}
        />

        <Route
          exact
          path="/register"
          render={() => (
            <PublicRoutes>
              <RegisterPage />
            </PublicRoutes>
          )}
        />

        <Route
          exact
          path="/login"
          render={() => (
            <PublicRoutes>
              <LoginPage />
            </PublicRoutes>
          )}
        />

        <Route
          exact
          path="/forgot-password"
          render={() => (
            <PublicRoutes>
              <ForgotPasswordPage />
            </PublicRoutes>
          )}
        />

        <Route
          exact
          path="/onboarding/welcome"
          render={() => (
            <PrivateRoutes>
              <WelcomePage />
            </PrivateRoutes>
          )}
        />

        <Route
          exact
          path="/onboarding/language"
          render={() => (
            <PrivateRoutes>
              <LanguagePage />
            </PrivateRoutes>
          )}
        />

        <Route
          exact
          path="/onboarding/group"
          render={() => (
            <PrivateRoutes>
              <GroupPage />
            </PrivateRoutes>
          )}
        />

        <Route
          exact
          path="/create-group"
          render={() => (
            <PrivateRoutes>
              <CreateGroupPage />
            </PrivateRoutes>
          )}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </>
);

export default AppRoutes;

// 4