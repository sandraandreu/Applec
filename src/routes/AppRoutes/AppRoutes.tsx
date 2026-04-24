import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import MainLayout from "../../components/main-layout/MainLayout";

import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/login/LoginPage";
import RegisterPage from "../../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/forgot-password/ForgotPasswordPage";
import CreateGroupPage from "../../pages/groups/create-group/CreateGroupPage";
import WelcomePage from "../../pages/onboarding/welcome/WelcomePage";
import GroupPage from "../../pages/onboarding/group/GroupPage";
import LanguagePage from "../../pages/onboarding/language/LanguagePage";
import JoinGroupPage from "../../pages/groups/join-group/JoinGroupPage";
import InviteGroupPage from "../../pages/groups/invite-group/InviteGroupPage";
import LandingPage from "../../pages/onboarding/landing/LandingPage";
import MembersPage from "../../pages/members/MembersPage";
import StyleGuide from "../../pages/style-guide/StyleGuide";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />

      <Route
        path="/home"
        element={
          <PrivateRoutes requiresGroup>
            <MainLayout>
              <Home />
            </MainLayout>
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

      <Route
        path="/members"
        element={
          <PrivateRoutes requiresGroup>
            <MainLayout>
              <MembersPage />
            </MainLayout>
          </PrivateRoutes>
        }
      />

      <Route path="/style-guide" element={<StyleGuide />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
