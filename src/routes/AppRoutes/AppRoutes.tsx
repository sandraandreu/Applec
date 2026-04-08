import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

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
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />

      <Route
        path="/home"
        element={
          <PrivateRoutes requiresGroup>
            <Home />
          </PrivateRoutes>
        }
      />

      <Route
        path="/landing"
        element={
          <PublicRoutes>
            <LandingPage />
          </PublicRoutes>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoutes>
            <RegisterPage />
          </PublicRoutes>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoutes>
            <ForgotPasswordPage />
          </PublicRoutes>
        }
      />

      <Route
        path="/onboarding/welcome"
        element={
          <PrivateRoutes>
            <WelcomePage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/onboarding/language"
        element={
          <PrivateRoutes>
            <LanguagePage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/onboarding/group"
        element={
          <PrivateRoutes>
            <GroupPage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/create-group"
        element={
          <PrivateRoutes>
            <CreateGroupPage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/invite-group"
        element={
          <PrivateRoutes>
            <InviteGroupPage />
          </PrivateRoutes>
        }
      />

      <Route
        path="/join-group"
        element={
          <PrivateRoutes>
            <JoinGroupPage />
          </PrivateRoutes>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
