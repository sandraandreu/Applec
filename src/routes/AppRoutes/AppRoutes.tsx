import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/login/LoginPage";
import RegisterPage from "../../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/forgotPassword/ForgotPasswordPage";
import CreateGroupPage from "../../pages/groups/createGroup/CreateGroupPage";
import WelcomePage from "../../pages/onboarding/welcome/WelcomePage";
import GroupPage from "../../pages/onboarding/group/GroupPage";
import LanguagePage from "../../pages/onboarding/language/LanguagePage";
import JoinGroupPage from "../../pages/groups/joinGroup/JoinGroupPage";
import InviteGroupPage from "../../pages/groups/inviteGroup/InviteGroupPage";
import LandingPage from "../../pages/onboarding/landing/LandingPage";

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/landing" />} />

      <Route
        exact
        path="/home"
        render={() => (
          <PrivateRoutes requiresGroup>
            <Home />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/landing"
        render={() => (
          <PublicRoutes>
            <LandingPage />
          </PublicRoutes>
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

      <Route
        exact
        path="/invite-group"
        render={() => (
          <PrivateRoutes>
            <InviteGroupPage />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/join-group"
        render={() => (
          <PrivateRoutes>
            <JoinGroupPage/>
          </PrivateRoutes>
        )}
      />
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
