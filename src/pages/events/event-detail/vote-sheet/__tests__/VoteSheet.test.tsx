import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import VoteSheet from "../VoteSheet";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: vi.fn((node: ReactNode) => node) };
});

vi.mock("react-swipeable", () => ({
  useSwipeable: () => ({ ref: vi.fn() }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../../../ui-kit/avatar/Avatar", () => ({
  default: ({ firstName }: { firstName: string }) => <span>{firstName}</span>,
}));

vi.mock("../../../../../ui-kit/button/Button", () => ({
  default: ({ text, onClick }: { text: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{text}</button>
  ),
}));

vi.mock("../../../../../ui-kit/icons/icon/Icon", () => ({
  default: () => null,
}));

const falleroA = { id: "lm-1", firstName: "Anna", lastName: "Garcia", relationship: "filla", type: "fallero" as const };
const falleroB = { id: "lm-2", firstName: "Pere", lastName: "Mas", relationship: "fill", type: "fallero" as const };
const externA = { id: "ext-1", firstName: "Joan", lastName: "Puig", relationship: "amic", type: "extern" as const };
const externB = { id: "ext-2", firstName: "Rosa", lastName: "Vila", relationship: "amiga", type: "extern" as const };

const defaultProps = {
  isOpen: true,
  onDismiss: vi.fn(),
  myResponse: undefined as "going" | "not-going" | undefined,
  linkedMembers: [falleroA, falleroB],
  allowExternalGuests: undefined as boolean | undefined,
  maxExternalGuests: undefined as number | undefined,
  onAddLinked: vi.fn(),
  initialLinkedResponses: {} as Record<string, "going" | "not-going">,
  onSaveCompanions: vi.fn().mockResolvedValue(undefined),
};

const renderSheet = (props: Partial<typeof defaultProps> = {}) =>
  render(<VoteSheet {...defaultProps} {...props} />);

describe("VoteSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLDialogElement.prototype.showModal = vi.fn(function(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function(this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
  });

  describe("filtrado de acompañantes", () => {
    it("muestra todos los acompañantes cuando allowExternalGuests no está restringido", () => {
      renderSheet({ linkedMembers: [falleroA, externA] });
      expect(screen.getByText("Anna")).toBeInTheDocument();
      expect(screen.getByText("Joan")).toBeInTheDocument();
    });

    it("oculta los externos cuando allowExternalGuests es false", () => {
      renderSheet({
        linkedMembers: [falleroA, falleroB, externA],
        allowExternalGuests: false,
      });
      expect(screen.getByText("Anna")).toBeInTheDocument();
      expect(screen.getByText("Pere")).toBeInTheDocument();
      expect(screen.queryByText("Joan")).not.toBeInTheDocument();
    });
  });

  describe("límite de externos", () => {
    it("oculta los botones del externo que supera el límite", () => {
      renderSheet({
        linkedMembers: [externA, externB],
        allowExternalGuests: true,
        maxExternalGuests: 1,
        initialLinkedResponses: { "ext-1": "going" },
      });
      expect(screen.getByRole("button", { name: "Joan vote.companionYes" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Rosa vote.companionYes" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Rosa vote.companionNo" })).not.toBeInTheDocument();
    });

    it("no deshabilita al externo que ya tiene going cuando se alcanza el límite", () => {
      renderSheet({
        linkedMembers: [externA, externB],
        allowExternalGuests: true,
        maxExternalGuests: 1,
        initialLinkedResponses: { "ext-1": "going" },
      });
      expect(screen.getByRole("button", { name: "Joan vote.companionYes" })).toBeInTheDocument();
    });
  });

  describe("toggle de votos", () => {
    it("al pulsar going el botón queda con aria-pressed true", async () => {
      renderSheet();
      const goingBtn = screen.getByRole("button", { name: "Anna vote.companionYes" });
      expect(goingBtn).toHaveAttribute("aria-pressed", "false");
      await userEvent.click(goingBtn);
      expect(goingBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("al pulsar not-going el botón queda con aria-pressed true", async () => {
      renderSheet();
      const notGoingBtn = screen.getByRole("button", { name: "Anna vote.companionNo" });
      expect(notGoingBtn).toHaveAttribute("aria-pressed", "false");
      await userEvent.click(notGoingBtn);
      expect(notGoingBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("pulsar going dos veces des-selecciona el voto", async () => {
      renderSheet();
      const goingBtn = screen.getByRole("button", { name: "Anna vote.companionYes" });
      await userEvent.click(goingBtn);
      expect(goingBtn).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(goingBtn);
      expect(goingBtn).toHaveAttribute("aria-pressed", "false");
    });

    it("seleccionar going des-selecciona not-going del mismo acompañante", async () => {
      renderSheet();
      const goingBtn = screen.getByRole("button", { name: "Anna vote.companionYes" });
      const notGoingBtn = screen.getByRole("button", { name: "Anna vote.companionNo" });
      await userEvent.click(notGoingBtn);
      expect(notGoingBtn).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(goingBtn);
      expect(goingBtn).toHaveAttribute("aria-pressed", "true");
      expect(notGoingBtn).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("votos iniciales", () => {
    it("carga el voto going inicial desde initialLinkedResponses", () => {
      renderSheet({ initialLinkedResponses: { "lm-1": "going" } });
      expect(screen.getByRole("button", { name: "Anna vote.companionYes" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Anna vote.companionNo" })).toHaveAttribute("aria-pressed", "false");
    });

    it("carga el voto not-going inicial desde initialLinkedResponses", () => {
      renderSheet({ initialLinkedResponses: { "lm-1": "not-going" } });
      expect(screen.getByRole("button", { name: "Anna vote.companionNo" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Anna vote.companionYes" })).toHaveAttribute("aria-pressed", "false");
    });

    it("el acompañante sin voto inicial tiene ambos botones en aria-pressed false", () => {
      renderSheet({ initialLinkedResponses: { "lm-1": "going" } });
      expect(screen.getByRole("button", { name: "Pere vote.companionYes" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Pere vote.companionNo" })).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("botón añadir acompañante", () => {
    it("llama a onAddLinked al pulsar el botón", async () => {
      const onAddLinked = vi.fn();
      renderSheet({ onAddLinked });
      await userEvent.click(screen.getByText("vote.addLinked"));
      expect(onAddLinked).toHaveBeenCalledOnce();
    });
  });
});
