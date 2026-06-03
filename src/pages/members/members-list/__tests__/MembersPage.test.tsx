import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import MembersPage from "../MembersPage";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: vi.fn() };
});
import { useAuthContext } from "../../../../context/auth/AuthContext";
import { useGroupContext } from "../../../../context/group/GroupContext";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("../../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));
vi.mock("../../../../context/group/GroupContext", () => ({ useGroupContext: vi.fn() }));
vi.mock("../../../../components/members/MembersList", () => ({
  default: () => <div data-testid="members-list" />,
}));
vi.mock("../../../../ui-kit/search/Search", () => ({
  default: () => <div data-testid="search" />,
}));
vi.mock("../../../../ui-kit/success-banner/SuccessBanner", () => ({
  default: ({ message }: { message: string }) => <div role="status">{message}</div>,
}));

const mockAuth = (overrides = {}) =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: { permissions: { canInviteMembers: false } } as any,
    profile: null,
    isLoading: false,
    isInitialized: true,
    logout: vi.fn(),
    refreshProfile: vi.fn(),
    ...overrides,
  });

const mockGroup = () =>
  vi.mocked(useGroupContext).mockReturnValue({
    group: { members: [] } as any,
    isLoading: false,
    refreshGroup: vi.fn(),
  });

const renderPage = (state: object = {}) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/members", state }]}>
      <MembersPage />
    </MemoryRouter>
  );

const mockNavigate = vi.fn();

describe("MembersPage - SuccessBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth();
    mockGroup();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("muestra el banner de rol actualizado cuando location.state tiene roleUpdated", () => {
    renderPage({ roleUpdated: true });
    expect(screen.getByText("detail.roleUpdated")).toBeInTheDocument();
  });

  it("muestra el banner de miembro eliminado cuando location.state tiene memberDeleted", () => {
    renderPage({ memberDeleted: true });
    expect(screen.getByText("detail.memberDeleted")).toBeInTheDocument();
  });

  it("no muestra ningún banner cuando no hay flags en location.state", () => {
    renderPage();
    expect(screen.queryByText("detail.roleUpdated")).not.toBeInTheDocument();
    expect(screen.queryByText("detail.memberDeleted")).not.toBeInTheDocument();
  });

  it("limpia el history state al montar para evitar que el banner reaparezca", () => {
    renderPage({ roleUpdated: true });
    expect(mockNavigate).toHaveBeenCalledWith("/members", { replace: true, state: null });
  });
});
