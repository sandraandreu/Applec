import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import JoinGroupPage from "../JoinGroupPage";
import { findGroupByInviteCode, sendJoinRequest } from "../../../../services/group.service";
import { updateUserFields } from "../../../../services/user.service";
import { useAuthContext } from "../../../../context/auth/AuthContext";
import type { User, UserProfile } from "../../../../models/user.model";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));

vi.mock("../../../../services/group.service", () => ({
  findGroupByInviteCode: vi.fn(),
  sendJoinRequest: vi.fn(),
}));

vi.mock("../../../../services/user.service", () => ({
  updateUserFields: vi.fn(),
}));

vi.mock("../../../../components/loading/Loading", () => ({
  default: () => <div data-testid="loading" />,
}));

vi.mock("../../../../ui-kit/button/icon-buttons/back-button/BackButton", () => ({
  default: () => null,
}));

vi.mock("../../../../ui-kit/icons/icon/Icon", () => ({ default: () => null }));

vi.mock("../../../../ui-kit/button/Button", () => ({
  default: ({
    text,
    onClick,
    type,
    isLoading,
  }: {
    text: string;
    onClick?: () => void;
    type?: string;
    isLoading?: boolean;
  }) => (
    <button type={type as "button" | "submit" | undefined} onClick={onClick} data-loading={isLoading}>
      {text}
    </button>
  ),
}));

vi.mock("../../../../ui-kit/input/Input", () => ({
  default: ({
    label,
    registration,
    error,
  }: {
    label: string;
    registration: object;
    error?: string;
  }) => (
    <div>
      <label>{label}</label>
      <input {...(registration as object)} aria-label={label} />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

const mockNavigate = vi.fn();

const mockAuth = (overrides = {}) =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { uid: "user-123" } as unknown as User,
    profile: { firstName: "Anna", lastName: "Garriga", email: "anna@test.com" } as unknown as UserProfile,
    isLoading: false,
    isInitialized: true,
    logout: vi.fn(),
    refreshProfile: vi.fn(),
    ...overrides,
  });

const renderPage = () =>
  render(
    <MemoryRouter>
      <JoinGroupPage />
    </MemoryRouter>
  );

describe("JoinGroupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("muestra el formulario de búsqueda inicialmente", () => {
    renderPage();
    expect(screen.getByText("joinGroup.title")).toBeTruthy();
    expect(screen.getByText("joinGroup.button")).toBeTruthy();
  });

  it("muestra el grupo encontrado tras buscar", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue({
      id: "grp-1",
      name: "Falla Convento",
    });
    renderPage();

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "ABC123");
    await userEvent.click(screen.getByText("joinGroup.button"));

    await waitFor(() => {
      expect(screen.getByText("Falla Convento")).toBeTruthy();
      expect(screen.getByText("joinGroup.joinButton")).toBeTruthy();
    });
  });

  it("muestra error si el código no existe", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue(null);
    renderPage();

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "XXXXXX");
    await userEvent.click(screen.getByText("joinGroup.button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
  });

  it("envía la solicitud y muestra pantalla de espera", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue({ id: "grp-1", name: "Falla Test" });
    vi.mocked(sendJoinRequest).mockResolvedValue(undefined);
    vi.mocked(updateUserFields).mockResolvedValue(undefined);

    renderPage();

    await userEvent.type(screen.getByRole("textbox"), "ABC123");
    await userEvent.click(screen.getByText("joinGroup.button"));
    await waitFor(() => screen.getByText("joinGroup.joinButton"));
    await userEvent.click(screen.getByText("joinGroup.joinButton"));

    await waitFor(() => {
      expect(screen.getByText("joinGroup.requestSent.title")).toBeTruthy();
    });

    expect(sendJoinRequest).toHaveBeenCalledWith("grp-1", "user-123", {
      firstName: "Anna",
      lastName: "Garriga",
      email: "anna@test.com",
    });
    expect(updateUserFields).toHaveBeenCalledWith("user-123", { pendingJoinGroupId: "grp-1" });
  });

  it("botón Entendido navega a /onboarding/group", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue({ id: "grp-1", name: "Falla Test" });
    vi.mocked(sendJoinRequest).mockResolvedValue(undefined);
    vi.mocked(updateUserFields).mockResolvedValue(undefined);

    renderPage();

    await userEvent.type(screen.getByRole("textbox"), "ABC123");
    await userEvent.click(screen.getByText("joinGroup.button"));
    await waitFor(() => screen.getByText("joinGroup.joinButton"));
    await userEvent.click(screen.getByText("joinGroup.joinButton"));
    await waitFor(() => screen.getByText("joinGroup.requestSent.button"));
    await userEvent.click(screen.getByText("joinGroup.requestSent.button"));

    expect(mockNavigate).toHaveBeenCalledWith("/onboarding/group", { replace: true });
  });

  it("muestra error si sendJoinRequest falla", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue({ id: "grp-1", name: "Falla Test" });
    vi.mocked(sendJoinRequest).mockRejectedValue(new Error("network error"));

    renderPage();

    await userEvent.type(screen.getByRole("textbox"), "ABC123");
    await userEvent.click(screen.getByText("joinGroup.button"));
    await waitFor(() => screen.getByText("joinGroup.joinButton"));
    await userEvent.click(screen.getByText("joinGroup.joinButton"));

    await waitFor(() => {
      expect(screen.getByText("joinGroup.errors.sendError")).toBeTruthy();
    });
  });

  it("el botón Cancelar vuelve al formulario de búsqueda", async () => {
    vi.mocked(findGroupByInviteCode).mockResolvedValue({ id: "grp-1", name: "Falla Test" });
    renderPage();

    await userEvent.type(screen.getByRole("textbox"), "ABC123");
    await userEvent.click(screen.getByText("joinGroup.button"));
    await waitFor(() => screen.getByText("joinGroup.joinButton"));
    await userEvent.click(screen.getByText("buttons.cancel"));

    expect(screen.getByText("joinGroup.title")).toBeTruthy();
  });
});
