import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/login/LoginPage";
import RegisterPage from "../../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/forgotPassword/ForgotPasswordPage";
import CreateGroupPage from "../../pages/groups/createGroup/CreateGroupPage";
import GroupOnboardingPage from "../../pages/groups/groupOnboarding/GroupOnboardingPage";
import WelcomePage from "../../pages/welcome/WelcomePage";

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
          path="/welcome"
          render={() => (
            <PrivateRoutes>
              <WelcomePage />
            </PrivateRoutes>
          )}
        />

        <Route
          exact
          path="/group-onboarding"
          render={() => (
            <PrivateRoutes>
              <GroupOnboardingPage />
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
