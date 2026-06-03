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
  onAccept: vi.fn().mockResolvedValue(undefined),
  onReject: vi.fn().mockResolvedValue(undefined),
};

const renderItem = (props: Partial<typeof defaultProps> = {}) =>
  render(<JoinRequestItem {...defaultProps} {...props} />);

describe("JoinRequestItem", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra título y mensaje", () => {
    renderItem();
    expect(screen.getByText("Pere Mas Carbonell")).toBeTruthy();
    expect(screen.getByText("Ha pedido unirse a la falla.")).toBeTruthy();
  });

  it("muestra los botones de aceptar y rechazar", () => {
    renderItem();
    expect(screen.getByText("buttons.accept")).toBeTruthy();
    expect(screen.getByText("buttons.reject")).toBeTruthy();
  });

  it("llama a onAccept al pulsar aceptar", async () => {
    const onAccept = vi.fn().mockResolvedValue(undefined);
    renderItem({ onAccept });
    await userEvent.click(screen.getByText("buttons.accept"));
    expect(onAccept).toHaveBeenCalledOnce();
    expect(defaultProps.onReject).not.toHaveBeenCalled();
  });

  it("llama a onReject al pulsar rechazar", async () => {
    const onReject = vi.fn().mockResolvedValue(undefined);
    renderItem({ onReject });
    await userEvent.click(screen.getByText("buttons.reject"));
    expect(onReject).toHaveBeenCalledOnce();
    expect(defaultProps.onAccept).not.toHaveBeenCalled();
  });

  it("muestra error si onAccept lanza excepción", async () => {
    renderItem({ onAccept: vi.fn().mockRejectedValue(new Error("fail")) });
    await userEvent.click(screen.getByText("buttons.accept"));
    expect(screen.getByText("requestsPage.acceptError")).toBeTruthy();
  });

  it("muestra error si onReject lanza excepción", async () => {
    renderItem({ onReject: vi.fn().mockRejectedValue(new Error("fail")) });
    await userEvent.click(screen.getByText("buttons.reject"));
    expect(screen.getByText("requestsPage.rejectError")).toBeTruthy();
  });

  it("no muestra error en estado inicial", () => {
    renderItem();
    expect(screen.queryByText("requestsPage.acceptError")).toBeNull();
    expect(screen.queryByText("requestsPage.rejectError")).toBeNull();
  });
});
