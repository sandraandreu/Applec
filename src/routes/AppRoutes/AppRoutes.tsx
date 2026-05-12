import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/loading/Loading";

const Home = lazy(() => import("../../pages/home/Home"));
const LoginPage = lazy(() => import("../../pages/auth/login/LoginPage"));
const RegisterPage = lazy(
  () => import("../../pages/auth/register/RegisterPage"),
);
const ForgotPasswordPage = lazy(
  () => import("../../pages/auth/forgot-password/ForgotPasswordPage"),
);
const CreateGroupPage = lazy(
  () => import("../../pages/groups/create-group/CreateGroupPage"),
);
const WelcomePage = lazy(
  () => import("../../pages/onboarding/welcome/WelcomePage"),
);
const GroupPage = lazy(() => import("../../pages/onboarding/group/GroupPage"));
const LanguagePage = lazy(
  () => import("../../pages/onboarding/language/LanguagePage"),
);
const JoinGroupPage = lazy(
  () => import("../../pages/groups/join-group/JoinGroupPage"),
);
const InviteGroupPage = lazy(
  () => import("../../pages/groups/invite-group/InviteGroupPage"),
);
const LandingPage = lazy(
  () => import("../../pages/onboarding/landing/LandingPage"),
);
const MembersPage = lazy(() => import("../../pages/members/MembersPage"));
const EventsListPage = lazy(
  () => import("../../pages/events/events-list/EventsListPage"),
);
const EventDetailPage = lazy(
  () => import("../../pages/events/event-detail/EventDetailPage"),
);
const StyleGuide = lazy(() => import("../../pages/style-guide/StyleGuide"));
const CreateEventPage = lazy(
  () => import("../../pages/events/create-events/CreateEventPage"),
);
const EditEventPage = lazy(
  () => import("../../pages/events/edit-event/EditEventPage"),
);

const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />

        <Route
          path="/home"
          element={
            <PrivateRoutes>
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

        <Route
          path="/create-events"
          element={
            <PrivateRoutes requiresGroup>
              <CreateEventPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/events"
          element={
            <PrivateRoutes requiresGroup>
              <MainLayout>
                <EventsListPage />
              </MainLayout>
            </PrivateRoutes>
          }
        />

        <Route
          path="/events/:id"
          element={
            <PrivateRoutes requiresGroup>
              <EventDetailPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <PrivateRoutes requiresGroup>
              <EditEventPage />
            </PrivateRoutes>
          }
        />

        <Route path="/style-guide" element={<StyleGuide />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRoutes;
