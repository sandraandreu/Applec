import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import NotificationsPage from "../NotificationsPage";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useNotificationsContext } from "../../../context/notifications/NotificationsContext";
import { listenJoinRequests, getAcceptedRequests } from "../../../services/group.service";
import { listenEventNotifications } from "../../../services/event.service";
import type { User, UserProfile } from "../../../models/user.model";
import type { GroupData } from "../../../context/group/GroupContext";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));
vi.mock("../../../context/group/GroupContext", () => ({ useGroupContext: vi.fn() }));
vi.mock("../../../context/notifications/NotificationsContext", () => ({
  useNotificationsContext: vi.fn(),
}));

vi.mock("../../../services/group.service", () => ({
  listenJoinRequests: vi.fn(),
  approveJoinRequest: vi.fn(),
  rejectJoinRequest: vi.fn(),
  getAcceptedRequests: vi.fn(),
}));

vi.mock("../../../services/event.service", () => ({
  listenEventNotifications: vi.fn(),
}));

vi.mock("../../../ui-kit/page-transition/PageTransition", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("../../../ui-kit/button/icon-buttons/back-button/BackButton", () => ({
  default: () => null,
}));

vi.mock("../../../ui-kit/empty-state/EmptyState", () => ({
  default: ({ title }: { title: string }) => <div data-testid="empty-state">{title}</div>,
}));

vi.mock("../../../ui-kit/button/Button", () => ({
  default: ({ text }: { text: string }) => <button>{text}</button>,
}));

vi.mock("../notification-item/NotificationItem", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="notification-item">{message}</div>
  ),
}));

vi.mock("../join-request-item/JoinRequestItem", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="join-request-item">{title}</div>
  ),
}));

const mockMember = (uid = "member-uid") =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid, permissions: { canCreateEvents: false, canManageMembers: false } } as unknown as User,
    profile: { groupId: "grp-1" } as unknown as UserProfile,
    isLoading: false, isInitialized: true, logout: vi.fn(), refreshProfile: vi.fn(),
  });

const mockAdmin = (uid = "admin-uid") =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid, permissions: { canCreateEvents: true, canManageMembers: true } } as unknown as User,
    profile: { groupId: "grp-1" } as unknown as UserProfile,
    isLoading: false, isInitialized: true, logout: vi.fn(), refreshProfile: vi.fn(),
  });

const mockGroup = () =>
  vi.mocked(useGroupContext).mockReturnValue({
    group: { name: "Falla Test" } as unknown as GroupData,
    isLoading: false, refreshGroup: vi.fn(),
  });

const wrap = () => render(<MemoryRouter><NotificationsPage /></MemoryRouter>);

describe("NotificationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNotificationsContext).mockReturnValue({ hasUnread: false, markAsRead: vi.fn() });
    vi.mocked(getAcceptedRequests).mockResolvedValue([]);
    vi.mocked(listenJoinRequests).mockImplementation((_gid, cb) => { cb([]); return vi.fn(); });
    vi.mocked(listenEventNotifications).mockImplementation((_gid, cb) => { cb([]); return vi.fn(); });
  });

  describe("markAsRead", () => {
    it("llama a markAsRead al montar la página", async () => {
      const markAsRead = vi.fn();
      vi.mocked(useNotificationsContext).mockReturnValue({ hasUnread: false, markAsRead });
      mockMember(); mockGroup();
      wrap();
      await waitFor(() => expect(markAsRead).toHaveBeenCalledOnce());
    });
  });

  describe("miembro", () => {
    it("muestra empty state cuando no hay notificaciones de eventos", () => {
      mockMember(); mockGroup();
      wrap();
      expect(screen.getByTestId("empty-state")).toBeTruthy();
    });

    it("muestra notificaciones de eventos de otros usuarios en tiempo real", async () => {
      mockMember("member-uid"); mockGroup();
      vi.mocked(listenEventNotifications).mockImplementation((_gid, cb) => {
        cb([{ eventId: "evt-1", title: "Sopar de Germania", createdBy: "otro-uid", createdAt: new Date() }]);
        return vi.fn();
      });
      wrap();
      await waitFor(() => {
        expect(screen.getAllByTestId("notification-item").length).toBeGreaterThan(0);
      });
    });

    it("no muestra notificaciones de eventos creados por el propio miembro", async () => {
      mockMember("member-uid"); mockGroup();
      vi.mocked(listenEventNotifications).mockImplementation((_gid, cb) => {
        cb([{ eventId: "evt-2", title: "Mi Evento", createdBy: "member-uid", createdAt: new Date() }]);
        return vi.fn();
      });
      wrap();
      await waitFor(() => {
        expect(screen.getByTestId("empty-state")).toBeTruthy();
        expect(screen.queryByTestId("notification-item")).toBeNull();
      });
    });

    it("no se suscribe a joinRequests", () => {
      mockMember(); mockGroup();
      wrap();
      expect(listenJoinRequests).not.toHaveBeenCalled();
    });
  });

  describe("admin", () => {
    it("muestra el botón para ver todas las solicitudes", () => {
      mockAdmin(); mockGroup();
      wrap();
      expect(screen.getByText("requestsPage.viewAll")).toBeTruthy();
    });

    it("muestra solicitudes de unión pendientes en tiempo real", async () => {
      mockAdmin(); mockGroup();
      vi.mocked(listenJoinRequests).mockImplementation((_gid, cb) => {
        cb([{ uid: "u1", firstName: "Anna", lastName: "Garriga", email: "a@a.com", requestedAt: new Date() }]);
        return vi.fn();
      });
      wrap();
      await waitFor(() => {
        expect(screen.getByTestId("join-request-item")).toBeTruthy();
        expect(screen.getByText("Anna Garriga")).toBeTruthy();
      });
    });

    it("no muestra el empty state aunque no haya eventos de otros", () => {
      mockAdmin(); mockGroup();
      wrap();
      expect(screen.queryByTestId("empty-state")).toBeNull();
    });
  });
});
