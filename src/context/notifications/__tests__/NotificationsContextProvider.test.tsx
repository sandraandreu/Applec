import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationsContextProvider } from "../NotificationsContextProvider";
import { useNotificationsContext } from "../NotificationsContext";
import { useAuthContext } from "../../auth/AuthContext";
import type { User, UserProfile } from "../../../models/user.model";

vi.mock("../../../plugins/firebase", () => ({ db: {} }));

type SnapCallback = (snap: { docs: { data: () => Record<string, unknown> }[] }) => void;
const callbacks: Record<string, SnapCallback> = {};

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, _col: string, groupId: string, subcol: string) => ({
    path: `${groupId}/${subcol}`,
  })),
  onSnapshot: vi.fn((ref: { path: string }, cb: SnapCallback) => {
    callbacks[ref.path] = cb;
    return vi.fn();
  }),
}));

vi.mock("../../auth/AuthContext", () => ({ useAuthContext: vi.fn() }));

const Consumer = () => {
  const { hasUnread, markAsRead } = useNotificationsContext();
  return (
    <>
      <span data-testid="badge">{String(hasUnread)}</span>
      <button onClick={markAsRead}>mark</button>
    </>
  );
};

const wrap = () =>
  render(
    <NotificationsContextProvider>
      <Consumer />
    </NotificationsContextProvider>
  );

const mockAdmin = () =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid: "admin-uid", permissions: { canManageMembers: true, canCreateEvents: true } } as unknown as User,
    profile: { groupId: "grp-1" } as unknown as UserProfile,
    isLoading: false, isInitialized: true, logout: vi.fn(), refreshProfile: vi.fn(),
  });

const mockMember = () =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid: "member-uid", permissions: { canManageMembers: false, canCreateEvents: false } } as unknown as User,
    profile: { groupId: "grp-1" } as unknown as UserProfile,
    isLoading: false, isInitialized: true, logout: vi.fn(), refreshProfile: vi.fn(),
  });

const emptySnap = { docs: [] };
const joinSnap = (ms: number) => ({
  docs: [{ data: () => ({ requestedAt: { toMillis: () => ms } }) }],
});
const eventSnap = (ms: number, createdBy: string) => ({
  docs: [{ data: () => ({ createdAt: { toMillis: () => ms }, createdBy }) }],
});

const PAST = 1_000;
const NOW = Date.now();
const FUTURE = NOW + 60_000;

describe("NotificationsContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.keys(callbacks).forEach((k) => delete callbacks[k]);
  });

  it("hasUnread es false sin notificaciones", () => {
    mockMember();
    wrap();
    act(() => callbacks["grp-1/eventNotifications"]?.(emptySnap));
    expect(screen.getByTestId("badge").textContent).toBe("false");
  });

  describe("admin — joinRequests", () => {
    it("badge cuando hay solicitud más nueva que lastSeen", () => {
      mockAdmin();
      wrap();
      act(() => callbacks["grp-1/joinRequests"]?.(joinSnap(NOW)));
      expect(screen.getByTestId("badge").textContent).toBe("true");
    });

    it("no badge cuando la solicitud es anterior a lastSeen", () => {
      localStorage.setItem("notificationsLastSeen", String(NOW));
      mockAdmin();
      wrap();
      act(() => callbacks["grp-1/joinRequests"]?.(joinSnap(PAST)));
      expect(screen.getByTestId("badge").textContent).toBe("false");
    });

    it("el miembro no se suscribe a joinRequests", () => {
      mockMember();
      wrap();
      expect(callbacks["grp-1/joinRequests"]).toBeUndefined();
    });
  });

  describe("eventNotifications", () => {
    it("badge cuando hay evento nuevo de otro usuario", () => {
      mockMember();
      wrap();
      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(NOW, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("true");
    });

    it("no badge cuando el evento lo creó el propio usuario", () => {
      mockMember();
      wrap();
      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(NOW, "member-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("false");
    });

    it("no badge cuando el evento es anterior a lastSeen", () => {
      localStorage.setItem("notificationsLastSeen", String(NOW));
      mockMember();
      wrap();
      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(PAST, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("false");
    });

    it("admin también recibe notificaciones de eventos de otros usuarios", () => {
      mockAdmin();
      wrap();
      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(NOW, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("true");
    });
  });

  describe("markAsRead", () => {
    it("limpia el badge inmediatamente", async () => {
      mockMember();
      wrap();
      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(NOW, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("true");

      await userEvent.click(screen.getByText("mark"));
      expect(screen.getByTestId("badge").textContent).toBe("false");
    });

    it("guarda el timestamp en localStorage", async () => {
      mockMember();
      wrap();
      const before = Date.now();
      await userEvent.click(screen.getByText("mark"));
      const saved = Number(localStorage.getItem("notificationsLastSeen"));
      expect(saved).toBeGreaterThanOrEqual(before);
    });

    it("badge vuelve a aparecer si llega una notificación posterior a markAsRead", async () => {
      mockMember();
      wrap();
      await userEvent.click(screen.getByText("mark"));
      expect(screen.getByTestId("badge").textContent).toBe("false");

      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(FUTURE, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("true");
    });

    it("notificación anterior a markAsRead no vuelve a mostrar el badge", async () => {
      mockMember();
      wrap();
      await userEvent.click(screen.getByText("mark"));

      act(() => callbacks["grp-1/eventNotifications"]?.(eventSnap(PAST, "otro-uid")));
      expect(screen.getByTestId("badge").textContent).toBe("false");
    });
  });
});
