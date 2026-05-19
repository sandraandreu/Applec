import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "../PrivateRoutes";
import PublicRoutes from "../PublicRoutes";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { useGroupContext } from "../../../context/group/GroupContext";

vi.mock("../../../context/auth/AuthContext", () => ({ useAuthContext: vi.fn() }));
vi.mock("../../../context/group/GroupContext", () => ({ useGroupContext: vi.fn() }));
vi.mock("../../../components/loading/Loading", () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

const verifiedUser = { emailVerified: true } as any;

const mockAuth = (overrides = {}) =>
  vi.mocked(useAuthContext).mockReturnValue({
    user: null,
    profile: null,
    isLoading: false,
    isInitialized: true,
    logout: vi.fn(),
    refreshProfile: vi.fn(),
    ...overrides,
  });

const mockGroup = (overrides = {}) =>
  vi.mocked(useGroupContext).mockReturnValue({
    group: null,
    isLoading: false,
    refreshGroup: vi.fn(),
    ...overrides,
  });

const renderWithRouter = (element: React.ReactElement, initialPath = "/protected") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/protected" element={element} />
        <Route path="/landing" element={<div>landing</div>} />
        <Route path="/onboarding/welcome" element={<div>welcome</div>} />
        <Route path="/events" element={<div>events</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("PrivateRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGroup();
  });

  it("muestra el spinner mientras carga la autenticación", () => {
    mockAuth({ isLoading: true });
    renderWithRouter(<PrivateRoutes><div>contenido</div></PrivateRoutes>);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("redirige a /landing si el usuario no está autenticado", () => {
    mockAuth({ user: null });
    renderWithRouter(<PrivateRoutes><div>contenido</div></PrivateRoutes>);
    expect(screen.getByText("landing")).toBeInTheDocument();
  });

  it("redirige a /landing si el email no está verificado", () => {
    mockAuth({ user: { emailVerified: false } as any });
    renderWithRouter(<PrivateRoutes><div>contenido</div></PrivateRoutes>);
    expect(screen.getByText("landing")).toBeInTheDocument();
  });

  it("redirige a /onboarding/welcome si requiresGroup y el usuario no tiene grupo", () => {
    mockAuth({ user: verifiedUser, profile: { groupId: undefined } as any });
    renderWithRouter(
      <PrivateRoutes requiresGroup><div>contenido</div></PrivateRoutes>
    );
    expect(screen.getByText("welcome")).toBeInTheDocument();
  });

  it("renderiza el contenido si el usuario está autenticado y tiene grupo", () => {
    mockAuth({ user: verifiedUser, profile: { groupId: "grp-1" } as any });
    renderWithRouter(
      <PrivateRoutes requiresGroup><div>contenido</div></PrivateRoutes>
    );
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });
});

describe("PublicRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el spinner mientras se inicializa la app", () => {
    mockAuth({ isInitialized: false });
    renderWithRouter(<PublicRoutes><div>página pública</div></PublicRoutes>);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renderiza la página pública si el usuario no está autenticado", () => {
    mockAuth({ user: null });
    renderWithRouter(<PublicRoutes><div>página pública</div></PublicRoutes>);
    expect(screen.getByText("página pública")).toBeInTheDocument();
  });

  it("redirige a /events si el usuario autenticado tiene grupo", () => {
    mockAuth({ user: verifiedUser, profile: { groupId: "grp-1" } as any });
    renderWithRouter(<PublicRoutes><div>página pública</div></PublicRoutes>);
    expect(screen.getByText("events")).toBeInTheDocument();
  });

  it("redirige a /onboarding/welcome si el usuario autenticado no tiene grupo", () => {
    mockAuth({ user: verifiedUser, profile: null });
    renderWithRouter(<PublicRoutes><div>página pública</div></PublicRoutes>);
    expect(screen.getByText("welcome")).toBeInTheDocument();
  });
});
