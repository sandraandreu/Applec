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
const MembersPage = lazy(() => import("../../pages/members/members-list/MembersPage"));
const MemberDetailPage = lazy(() => import("../../pages/members/member-detail/MemberDetailPage"));
const LinkedMembersPage = lazy(() => import("../../pages/members/linked-members/LinkedMembersPage"));
const AddLinkedMemberPage = lazy(() => import("../../pages/members/add-linked-member/AddLinkedMemberPage"));
const EditLinkedMemberPage = lazy(() => import("../../pages/members/edit-linked-member/EditLinkedMemberPage"));
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
const VerifyEmailPage = lazy(
  () => import("../../pages/auth/verify-email/VerifyEmailPage"),
);
const FeedPage = lazy(() => import("../../pages/feed/FeedPage"));
const FeedDetailPage = lazy(() => import("../../pages/feed/feed-detail/FeedDetailPage"));
const CreatePostPage = lazy(() => import("../../pages/feed/create-post/CreatePostPage"));
const NotificationsPage = lazy(() => import("../../pages/notifications/NotificationsPage"));
const JoinRequestsPage = lazy(() => import("../../pages/notifications/join-requests/JoinRequestsPage"));
const ProfilePage = lazy(() => import("../../pages/profile/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("../../pages/profile/edit-profile/EditProfilePage"));
const ChangePasswordPage = lazy(() => import("../../pages/profile/change-password/ChangePasswordPage"));
const GroupSettingsPage = lazy(() => import("../../pages/profile/group-settings/GroupSettingsPage"));
const NotificationsSettingsPage = lazy(() => import("../../pages/profile/notifications-settings/NotificationsSettingsPage"));
const LanguageSettingsPage = lazy(() => import("../../pages/profile/language/LanguageSettingsPage"));
const CalendarPage = lazy(() => import("../../pages/calendar/CalendarPage"));

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
          path="/feed"
          element={
            <PrivateRoutes requiresGroup>
              <MainLayout>
                <FeedPage />
              </MainLayout>
            </PrivateRoutes>
          }
        />

        <Route
          path="/feed/new"
          element={
            <PrivateRoutes requiresGroup>
              <CreatePostPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/feed/:id"
          element={
            <PrivateRoutes requiresGroup>
              <FeedDetailPage />
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
          path="/verify-email"
          element={
            <PublicRoutes>
              <VerifyEmailPage />
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
            <PrivateRoutes requiresNoGroup>
              <GroupPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/create-group"
          element={
            <PrivateRoutes requiresNoGroup>
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
            <PrivateRoutes requiresNoGroup>
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
          path="/members/linked"
          element={
            <PrivateRoutes requiresGroup>
              <LinkedMembersPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/members/linked/new"
          element={
            <PrivateRoutes requiresGroup>
              <AddLinkedMemberPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/members/linked/:id/edit"
          element={
            <PrivateRoutes requiresGroup>
              <EditLinkedMemberPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/members/:uid"
          element={
            <PrivateRoutes requiresGroup>
              <MemberDetailPage />
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
          path="/calendar"
          element={
            <PrivateRoutes requiresGroup>
              <MainLayout>
                <CalendarPage />
              </MainLayout>
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

        <Route
          path="/notifications"
          element={
            <PrivateRoutes requiresGroup>
              <NotificationsPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/notifications/requests"
          element={
            <PrivateRoutes requiresGroup>
              <JoinRequestsPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoutes requiresGroup>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoutes requiresGroup>
              <EditProfilePage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile/change-password"
          element={
            <PrivateRoutes requiresGroup>
              <ChangePasswordPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile/group-settings"
          element={
            <PrivateRoutes requiresGroup>
              <GroupSettingsPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile/notifications-settings"
          element={
            <PrivateRoutes requiresGroup>
              <NotificationsSettingsPage />
            </PrivateRoutes>
          }
        />

        <Route
          path="/profile/language"
          element={
            <PrivateRoutes requiresGroup>
              <LanguageSettingsPage />
            </PrivateRoutes>
          }
        />

        {process.env.NODE_ENV !== 'production' && (
          <Route path="/style-guide" element={<StyleGuide />} />
        )}

      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRoutes;
