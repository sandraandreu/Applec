import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VoteStickyFooter from "../VoteStickyFooter";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../../../ui-kit/icons/icon/Icon", () => ({
  default: () => null,
}));

vi.mock("../../../../../ui-kit/button/Button", () => ({
  default: ({ text, variant, onClick }: { text: string; variant?: string; onClick?: () => void }) => (
    <button type="button" data-variant={variant} onClick={onClick}>{text}</button>
  ),
}));

const threeMembers = [
  { id: "lm-1", firstName: "Anna" },
  { id: "lm-2", firstName: "Pere" },
  { id: "lm-3", firstName: "Maria" },
];

const defaultProps = {
  eventStatus: "activo" as "activo" | "plazo-cerrado" | "finalizado",
  myResponse: undefined as "going" | "not-going" | undefined,
  visibleLinkedMembers: [] as { id: string; firstName: string }[],
  myLinkedResponses: {} as Record<string, "going" | "not-going">,
  voteError: null as string | null,
  onVote: vi.fn(),
  onCompanionsClick: vi.fn(),
  onAddLinked: vi.fn(),
};

const renderFooter = (props: Partial<typeof defaultProps> = {}) =>
  render(<VoteStickyFooter {...defaultProps} {...props} />);

describe("VoteStickyFooter", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("subtítulo de acompañantes", () => {
    it("no muestra subtítulo si no hay acompañantes", () => {
      renderFooter({ visibleLinkedMembers: [] });
      expect(screen.queryByText("vote.companionsPrompt")).not.toBeInTheDocument();
    });

    it("muestra el prompt cuando nadie ha votado todavía", () => {
      renderFooter({
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: {},
      });
      expect(screen.getByText("vote.companionsPrompt")).toBeInTheDocument();
    });

    it("muestra nombre + pendientes cuando 1 ha votado going y 2 están pendientes", () => {
      renderFooter({
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: { "lm-1": "going" },
      });
      const subtitle = screen.getByText(/Anna/);
      expect(subtitle.textContent).toContain("Anna");
      expect(subtitle.textContent).toContain("vote.companionsPending");
    });

    it("muestra dos nombres + pendiente cuando 2 han votado going y 1 está pendiente", () => {
      renderFooter({
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: { "lm-1": "going", "lm-2": "going" },
      });
      const subtitle = screen.getByText(/Anna/);
      expect(subtitle.textContent).toContain("Anna, Pere");
      expect(subtitle.textContent).toContain("vote.companionsPending");
    });

    it("muestra solo los nombres cuando todos han votado going", () => {
      renderFooter({
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: { "lm-1": "going", "lm-2": "going", "lm-3": "going" },
      });
      expect(screen.getByText("Anna, Pere, Maria")).toBeInTheDocument();
    });

    it("no muestra subtítulo cuando todos han votado not-going", () => {
      renderFooter({
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: { "lm-1": "not-going", "lm-2": "not-going", "lm-3": "not-going" },
      });
      expect(screen.queryByText("vote.companionsPrompt")).not.toBeInTheDocument();
      expect(screen.queryByText(/Anna/)).not.toBeInTheDocument();
    });

    it("muestra solo el nombre going cuando hay going y not-going pero nadie pendiente", () => {
      renderFooter({
        visibleLinkedMembers: [threeMembers[0], threeMembers[1]],
        myLinkedResponses: { "lm-1": "going", "lm-2": "not-going" },
      });
      expect(screen.getByText("Anna")).toBeInTheDocument();
    });
  });

  describe("estado activo", () => {
    it("muestra los botones de voto activos", () => {
      renderFooter();
      expect(screen.getByRole("button", { name: "vote.yes" })).not.toBeDisabled();
      expect(screen.getByRole("button", { name: "vote.no" })).not.toBeDisabled();
    });

    it("myResponse going activa el botón Voy con aria-pressed", () => {
      renderFooter({ myResponse: "going" });
      expect(screen.getByRole("button", { name: "vote.yes" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "vote.no" })).toHaveAttribute("aria-pressed", "false");
    });

    it("myResponse not-going activa el botón No voy con aria-pressed", () => {
      renderFooter({ myResponse: "not-going" });
      expect(screen.getByRole("button", { name: "vote.no" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "vote.yes" })).toHaveAttribute("aria-pressed", "false");
    });

    it("sin myResponse ningún botón está activo", () => {
      renderFooter({ myResponse: undefined });
      expect(screen.getByRole("button", { name: "vote.yes" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "vote.no" })).toHaveAttribute("aria-pressed", "false");
    });

    it("llama a onVote con going al pulsar el botón Voy", async () => {
      const onVote = vi.fn();
      renderFooter({ onVote });
      await userEvent.click(screen.getByRole("button", { name: "vote.yes" }));
      expect(onVote).toHaveBeenCalledWith("going");
    });

    it("llama a onVote con not-going al pulsar el botón No voy", async () => {
      const onVote = vi.fn();
      renderFooter({ onVote });
      await userEvent.click(screen.getByRole("button", { name: "vote.no" }));
      expect(onVote).toHaveBeenCalledWith("not-going");
    });
  });

  describe("estado plazo-cerrado", () => {
    it("los botones de voto están desactivados", () => {
      renderFooter({ eventStatus: "plazo-cerrado" });
      const buttons = screen.getAllByRole("button");
      buttons.forEach(btn => expect(btn).toBeDisabled());
    });

    it("muestra el mensaje de plazo cerrado", () => {
      renderFooter({ eventStatus: "plazo-cerrado" });
      expect(screen.getByText("vote.closed")).toBeInTheDocument();
    });

    it("muestra los nombres going en plazo-cerrado", () => {
      renderFooter({
        eventStatus: "plazo-cerrado",
        visibleLinkedMembers: threeMembers,
        myLinkedResponses: { "lm-1": "going", "lm-2": "going" },
      });
      expect(screen.getByText("Anna, Pere")).toBeInTheDocument();
    });
  });

  describe("botón de acompañantes", () => {
    it("muestra el botón de acompañantes cuando hay linked members", () => {
      renderFooter({ visibleLinkedMembers: threeMembers });
      expect(screen.getByText("vote.companions")).toBeInTheDocument();
    });

    it("muestra el botón de añadir acompañante cuando no hay linked members", () => {
      renderFooter({ visibleLinkedMembers: [] });
      expect(screen.getByText("vote.addLinked")).toBeInTheDocument();
    });

    it("el botón de acompañantes es secondary cuando myResponse es not-going", () => {
      renderFooter({ visibleLinkedMembers: threeMembers, myResponse: "not-going" });
      expect(screen.getByText("vote.companions")).toHaveAttribute("data-variant", "secondary");
    });

    it("el botón de acompañantes es primary cuando myResponse no es not-going", () => {
      renderFooter({ visibleLinkedMembers: threeMembers, myResponse: "going" });
      expect(screen.getByText("vote.companions")).toHaveAttribute("data-variant", "primary");
    });

    it("llama a onCompanionsClick al pulsar el botón de acompañantes", async () => {
      const onCompanionsClick = vi.fn();
      renderFooter({ visibleLinkedMembers: threeMembers, onCompanionsClick });
      await userEvent.click(screen.getByText("vote.companions"));
      expect(onCompanionsClick).toHaveBeenCalledOnce();
    });
  });

  describe("error de voto", () => {
    it("muestra el mensaje de error cuando voteError tiene valor", () => {
      renderFooter({ voteError: "events:attendance.error" });
      expect(screen.getByText("events:attendance.error")).toBeInTheDocument();
    });

    it("no muestra error cuando voteError es null", () => {
      renderFooter({ voteError: null });
      expect(screen.queryByText("events:attendance.error")).not.toBeInTheDocument();
    });
  });
});
