import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../TopBar";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";
import { useNotificationsContext } from "../../../context/notifications/NotificationsContext";
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
vi.mock("../../../ui-kit/icons/icon/Icon", () => ({ default: () => null }));

const mockAuth = (canCreateEvents: boolean) =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid: "u1", permissions: { canCreateEvents } } as unknown as User,
    profile: { groupId: "grp-1" } as unknown as UserProfile,
    isLoading: false, isInitialized: true, logout: vi.fn(), refreshProfile: vi.fn(),
  });

const mockGroup = () =>
  vi.mocked(useGroupContext).mockReturnValue({
    group: { name: "Falla Test" } as unknown as GroupData,
    isLoading: false, refreshGroup: vi.fn(),
  });

const mockNotifs = (hasUnread: boolean) =>
  vi.mocked(useNotificationsContext).mockReturnValue({ hasUnread, markAsRead: vi.fn() });

const wrap = () => render(<MemoryRouter><TopBar /></MemoryRouter>);

describe("TopBar", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("badge de notificaciones", () => {
    it("muestra el badge cuando hay notificaciones sin leer", () => {
      mockAuth(true); mockGroup(); mockNotifs(true);
      wrap();
      expect(document.querySelector(".top-bar__bell-badge")).not.toBeNull();
    });

    it("no muestra el badge cuando no hay notificaciones sin leer", () => {
      mockAuth(true); mockGroup(); mockNotifs(false);
      wrap();
      expect(document.querySelector(".top-bar__bell-badge")).toBeNull();
    });
  });

  describe("botón crear evento", () => {
    it("visible para admin y organizador", () => {
      mockAuth(true); mockGroup(); mockNotifs(false);
      wrap();
      expect(screen.getByLabelText("nav.createEvent")).toBeTruthy();
    });

    it("oculto para miembros", () => {
      mockAuth(false); mockGroup(); mockNotifs(false);
      wrap();
      expect(screen.queryByLabelText("nav.createEvent")).toBeNull();
    });
  });
});
