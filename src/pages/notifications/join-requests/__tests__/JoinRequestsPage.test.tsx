import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import JoinRequestsPage from "../JoinRequestsPage";
import { getJoinRequests, approveJoinRequest, rejectJoinRequest } from "../../../../services/group.service";
import { useAuthContext } from "../../../../context/auth/AuthContext";
import { useGroupContext } from "../../../../context/group/GroupContext";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, opts?: Record<string, string>) => opts ? `${key}:${JSON.stringify(opts)}` : key }),
}));

vi.mock("../../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));
vi.mock("../../../../context/group/GroupContext", () => ({ useGroupContext: vi.fn() }));

vi.mock("../../../../services/group.service", () => ({
  getJoinRequests: vi.fn(),
  approveJoinRequest: vi.fn(),
  rejectJoinRequest: vi.fn(),
}));

vi.mock("../../../../components/loading/Loading", () => ({
  default: () => <div data-testid="loading" />,
}));

vi.mock("../../../../ui-kit/empty-state/EmptyState", () => ({
  default: ({ title }: { title: string }) => <div data-testid="empty-state">{title}</div>,
}));

vi.mock("../../../../ui-kit/button/icon-buttons/back-button/BackButton", () => ({
  default: () => null,
}));

vi.mock("../../join-request-item/JoinRequestItem", () => ({
  default: ({
    title,
    onAccept,
    onReject,
  }: {
    title: string;
    onAccept?: () => Promise<void>;
    onReject?: () => Promise<void>;
  }) => (
    <div data-testid="request-item">
      <span>{title}</span>
      <button onClick={onAccept}>accept</button>
      <button onClick={onReject}>reject</button>
    </div>
  ),
}));

const mockAuth = () =>
  vi.mocked(useAuthContext).mockReturnValue({
    profile: { groupId: "grp-1" } as any,
    user: null as any,
    isLoading: false,
    isInitialized: true,
    logout: vi.fn(),
    refreshProfile: vi.fn(),
  });

const mockGroup = (name = "Falla Test") =>
  vi.mocked(useGroupContext).mockReturnValue({
    group: { name } as any,
    isLoading: false,
    refreshGroup: vi.fn(),
  });

const renderPage = () =>
  render(
    <MemoryRouter>
      <JoinRequestsPage />
    </MemoryRouter>
  );

describe("JoinRequestsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth();
    mockGroup();
  });

  it("muestra loading mientras carga", () => {
    vi.mocked(getJoinRequests).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId("loading")).toBeTruthy();
  });

  it("muestra solicitudes reales de Firestore", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([
      { uid: "u1", firstName: "Anna", lastName: "Garriga", email: "a@a.com", requestedAt: new Date() },
    ]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Anna Garriga")).toBeTruthy();
    });
  });

  it("siempre muestra las solicitudes demo", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("requestsPage.pere")).toBeTruthy();
      expect(screen.getByText("requestsPage.julia")).toBeTruthy();
    });
  });

  it("elimina una solicitud real al aprobar", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([
      { uid: "u1", firstName: "Anna", lastName: "Garriga", email: "a@a.com", requestedAt: new Date() },
    ]);
    vi.mocked(approveJoinRequest).mockResolvedValue(undefined);
    renderPage();

    await waitFor(() => screen.getByText("Anna Garriga"));

    const items = screen.getAllByTestId("request-item");
    const realItem = items.find(el => el.textContent?.includes("Anna Garriga"));
    await userEvent.click(realItem!.querySelector("button[onClick]") ?? realItem!.querySelectorAll("button")[0]);

    await waitFor(() => {
      expect(screen.queryByText("Anna Garriga")).toBeNull();
    });
    expect(approveJoinRequest).toHaveBeenCalledWith("grp-1", "u1", { firstName: "Anna", lastName: "Garriga" });
  });

  it("elimina una solicitud real al rechazar", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([
      { uid: "u2", firstName: "Bernat", lastName: "Costa", email: "b@b.com", requestedAt: new Date() },
    ]);
    vi.mocked(rejectJoinRequest).mockResolvedValue(undefined);
    renderPage();

    await waitFor(() => screen.getByText("Bernat Costa"));

    const items = screen.getAllByTestId("request-item");
    const realItem = items.find(el => el.textContent?.includes("Bernat Costa"));
    await userEvent.click(realItem!.querySelectorAll("button")[1]);

    await waitFor(() => {
      expect(screen.queryByText("Bernat Costa")).toBeNull();
    });
    expect(rejectJoinRequest).toHaveBeenCalledWith("grp-1", "u2");
  });

  it("descarta solicitud demo al aceptarla", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([]);
    renderPage();

    await waitFor(() => screen.getByText("requestsPage.pere"));

    const items = screen.getAllByTestId("request-item");
    const pereItem = items.find(el => el.textContent?.includes("requestsPage.pere"));
    await userEvent.click(pereItem!.querySelectorAll("button")[0]);

    await waitFor(() => {
      expect(screen.queryByText("requestsPage.pere")).toBeNull();
    });
    expect(approveJoinRequest).not.toHaveBeenCalled();
  });

  it("muestra empty state cuando no quedan solicitudes", async () => {
    vi.mocked(getJoinRequests).mockResolvedValue([]);
    renderPage();

    await waitFor(() => screen.getAllByTestId("request-item"));

    const items = screen.getAllByTestId("request-item");
    for (const item of items) {
      await userEvent.click(item.querySelectorAll("button")[0]);
    }

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeTruthy();
    });
  });
});
