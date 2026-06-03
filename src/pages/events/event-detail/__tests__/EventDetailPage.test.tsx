import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import EventDetailPage from "../EventDetailPage";
import { getEventById } from "../../../../services/event.service";
import { getEventAttendances, saveAttendance } from "../../../../services/attendance.service";
import { useAuthContext } from "../../../../context/auth/AuthContext";
import { useGroupContext } from "../../../../context/group/GroupContext";
import type { FallesEvent } from "../../../../models/event.model";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useParams: vi.fn(), useNavigate: vi.fn(), useLocation: vi.fn() };
});

vi.mock("react-swipeable", () => ({ useSwipeable: () => ({}) }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "es" } }),
}));

vi.mock("../../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));
vi.mock("../../../../context/group/GroupContext", () => ({ useGroupContext: vi.fn() }));

vi.mock("../../../../services/event.service", () => ({
  getEventById: vi.fn(),
  deleteEvent: vi.fn(),
}));

vi.mock("../../../../services/attendance.service", () => ({
  getEventAttendances: vi.fn(),
  saveAttendance: vi.fn(),
}));

vi.mock("../../../../components/loading/Loading", () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

vi.mock("../../../../components/modal/Modal", () => ({ default: () => null }));
vi.mock("../../../../ui-kit/icons/icon/Icon", () => ({ default: () => null }));

vi.mock("../event-detail-header/EventDetailHeader", () => ({
  default: ({ deadline }: { deadline?: string }) => (
    <div data-testid="event-header">
      {deadline && <span data-testid="deadline-text">{deadline}</span>}
    </div>
  ),
}));

vi.mock("../event-attendance-section/EventAttendanceSection", () => ({
  default: () => <div data-testid="attendance-section" />,
}));

vi.mock("../vote-sheet/VoteSheet", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="vote-sheet-open" /> : null,
}));

vi.mock("../vote-sticky-footer/VoteStickyFooter", () => ({
  default: ({ onVote, voteError }: { onVote: (r: "going" | "not-going") => void; voteError: string | null }) => (
    <div data-testid="vote-footer">
      <button onClick={() => onVote("going")}>vote-going</button>
      {voteError && <p data-testid="vote-error">{voteError}</p>}
    </div>
  ),
}));

const futureDate = new Date("2030-03-19T20:00:00");
const pastDate = new Date("2020-03-19T20:00:00");

const baseEvent: FallesEvent = {
  id: "evt-1",
  groupId: "grp-1",
  createdBy: "user-1",
  name: "Falla Major",
  date: futureDate,
  location: "Plaça del Poble",
  startTime: "20:00",
  requiresConfirmation: true,
  sendReminder: false,
  createdAt: new Date("2026-01-01"),
};

const mockNavigate = vi.fn();

const setupMocks = (locationState: object | null = null) => {
  vi.mocked(useParams).mockReturnValue({ id: "evt-1" });
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  vi.mocked(useLocation).mockReturnValue({
    state: locationState,
    pathname: "/events/evt-1",
    search: "",
    hash: "",
    key: "default",
  });
  vi.mocked(useAuthContext).mockReturnValue({
    user: {
      uid: "user-1",
      permissions: {
        canCreateEvents: true, canDeleteEvents: true, canEditOwnEvents: false,
        canEditAllEvents: true, canManageMembers: true, canInviteMembers: true,
        canManageGroup: true, canShareAccess: true,
      },
    } as any,
    profile: {
      firstName: "Admin", lastName: "User", email: "admin@test.com",
      role: "admin" as const, groupId: "grp-1", createdAt: new Date(),
    } as any,
    isLoading: false,
    isInitialized: true,
    logout: vi.fn(),
    refreshProfile: vi.fn(),
  });
  vi.mocked(useGroupContext).mockReturnValue({
    group: { id: "grp-1", members: [], linkedMembers: [] } as any,
    isLoading: false,
    refreshGroup: vi.fn(),
  });
};

const setup = (eventOverrides: Partial<FallesEvent> = {}, locationState: object | null = null) => {
  setupMocks(locationState);
  vi.mocked(getEventById).mockResolvedValue({ ...baseEvent, ...eventOverrides });
  vi.mocked(getEventAttendances).mockResolvedValue({ memberResponses: {}, linkedResponses: {} });
  vi.mocked(saveAttendance).mockResolvedValue(undefined);
  return render(<EventDetailPage />);
};

describe("EventDetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra el spinner mientras cargan los datos", () => {
    setupMocks();
    vi.mocked(getEventById).mockReturnValue(new Promise(() => {}));
    vi.mocked(getEventAttendances).mockReturnValue(new Promise(() => {}));
    render(<EventDetailPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("sin confirmationDeadline no muestra la fecha límite en el header", async () => {
    setup({ confirmationDeadline: undefined });
    await screen.findByTestId("event-header");
    expect(screen.queryByTestId("deadline-text")).not.toBeInTheDocument();
  });

  it("con confirmationDeadline muestra la fecha límite en el header", async () => {
    setup({ confirmationDeadline: new Date("2030-03-15T23:59:00") });
    await screen.findByTestId("event-header");
    expect(screen.getByTestId("deadline-text")).toBeInTheDocument();
  });

  it("no renderiza el footer cuando requiresConfirmation es false", async () => {
    setup({ requiresConfirmation: false });
    await screen.findByTestId("event-header");
    expect(screen.queryByTestId("vote-footer")).not.toBeInTheDocument();
  });

  it("renderiza el footer cuando requiresConfirmation es true y el evento es activo", async () => {
    setup();
    await screen.findByTestId("vote-footer");
    expect(screen.getByTestId("vote-footer")).toBeInTheDocument();
  });

  it("no renderiza el footer cuando el evento ha finalizado", async () => {
    setup({ date: pastDate });
    await screen.findByTestId("event-header");
    expect(screen.queryByTestId("vote-footer")).not.toBeInTheDocument();
  });

  it("abre el VoteSheet automáticamente cuando location.state.openVoteSheet es true", async () => {
    setup({}, { openVoteSheet: true });
    await screen.findByTestId("vote-sheet-open");
    expect(screen.getByTestId("vote-sheet-open")).toBeInTheDocument();
  });

  it("al votar llama a saveAttendance con los datos correctos", async () => {
    setup();
    await screen.findByTestId("vote-footer");
    await userEvent.click(screen.getByText("vote-going"));
    expect(saveAttendance).toHaveBeenCalledWith("grp-1", "evt-1", "user-1", {
      response: "going",
      linkedResponses: {},
    });
  });

  it("muestra el error de voto cuando saveAttendance falla", async () => {
    setup();
    vi.mocked(saveAttendance).mockRejectedValue(new Error());
    await screen.findByTestId("vote-footer");
    await userEvent.click(screen.getByText("vote-going"));
    expect(await screen.findByTestId("vote-error")).toBeInTheDocument();
    expect(screen.getByTestId("vote-error")).toHaveTextContent("attendance.error");
  });
});
