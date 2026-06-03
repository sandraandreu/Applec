import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinRequestItem from "../JoinRequestItem";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../../ui-kit/button/Button", () => ({
  default: ({
    text,
    onClick,
    isLoading,
    disabled,
  }: {
    text: string;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled} data-loading={isLoading}>
      {text}
    </button>
  ),
}));

vi.mock("../../../../ui-kit/icons/icon/Icon", () => ({ default: () => null }));

const defaultProps = {
  iconName: "person-add" as const,
  iconBg: "teal" as const,
  title: "Pere Mas Carbonell",
  message: "Ha pedido unirse a la falla.",
};

const renderItem = (props = {}) =>
  render(<JoinRequestItem {...defaultProps} {...props} />);

describe("JoinRequestItem", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra título y mensaje", () => {
    renderItem();
    expect(screen.getByText("Pere Mas Carbonell")).toBeTruthy();
    expect(screen.getByText("Ha pedido unirse a la falla.")).toBeTruthy();
  });

  it("muestra los botones de aceptar y rechazar", () => {
    renderItem({
      onAccept: vi.fn().mockResolvedValue(undefined),
      onReject: vi.fn().mockResolvedValue(undefined),
    });
    expect(screen.getByText("buttons.accept")).toBeTruthy();
    expect(screen.getByText("buttons.reject")).toBeTruthy();
  });

  it("llama a onAccept al pulsar aceptar", async () => {
    const onAccept = vi.fn().mockResolvedValue(undefined);
    const onReject = vi.fn().mockResolvedValue(undefined);
    renderItem({ onAccept, onReject });
    await userEvent.click(screen.getByText("buttons.accept"));
    expect(onAccept).toHaveBeenCalledOnce();
    expect(onReject).not.toHaveBeenCalled();
  });

  it("llama a onReject al pulsar rechazar", async () => {
    const onAccept = vi.fn().mockResolvedValue(undefined);
    const onReject = vi.fn().mockResolvedValue(undefined);
    renderItem({ onAccept, onReject });
    await userEvent.click(screen.getByText("buttons.reject"));
    expect(onReject).toHaveBeenCalledOnce();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("muestra error si onAccept lanza excepción", async () => {
    const onAccept = vi.fn().mockRejectedValue(new Error("fail"));
    const onReject = vi.fn().mockResolvedValue(undefined);
    renderItem({ onAccept, onReject });
    await userEvent.click(screen.getByText("buttons.accept"));
    expect(screen.getByText("requestsPage.acceptError")).toBeTruthy();
  });

  it("muestra error si onReject lanza excepción", async () => {
    const onAccept = vi.fn().mockResolvedValue(undefined);
    const onReject = vi.fn().mockRejectedValue(new Error("fail"));
    renderItem({ onAccept, onReject });
    await userEvent.click(screen.getByText("buttons.reject"));
    expect(screen.getByText("requestsPage.rejectError")).toBeTruthy();
  });

  it("no muestra error en estado inicial", () => {
    renderItem({
      onAccept: vi.fn().mockResolvedValue(undefined),
      onReject: vi.fn().mockResolvedValue(undefined),
    });
    expect(screen.queryByText("requestsPage.acceptError")).toBeNull();
    expect(screen.queryByText("requestsPage.rejectError")).toBeNull();
  });
});
