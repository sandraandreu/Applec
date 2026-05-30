import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getEventStatus } from "../event.model";
import type { FallesEvent } from "../event.model";

const makeEvent = (overrides: Partial<FallesEvent> = {}): FallesEvent => ({
  id: "evt-1",
  groupId: "grp-1",
  createdBy: "user-1",
  name: "Test Event",
  date: new Date("2030-01-01T20:00:00"),
  location: "Valencia",
  startTime: "20:00",
  requiresConfirmation: false,
  sendReminder: false,
  createdAt: new Date("2025-01-01"),
  ...overrides,
});

describe("getEventStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("devuelve finalizado cuando la fecha del evento ya pasó", () => {
    vi.setSystemTime(new Date("2030-01-02T00:00:00"));
    expect(getEventStatus(makeEvent({ date: new Date("2030-01-01T20:00:00") }))).toBe("finalizado");
  });

  it("devuelve plazo-cerrado cuando el plazo de confirmación ha pasado pero el evento no", () => {
    vi.setSystemTime(new Date("2029-12-20T00:00:00"));
    expect(getEventStatus(makeEvent({
      date: new Date("2030-01-01T20:00:00"),
      requiresConfirmation: true,
      confirmationDeadline: new Date("2029-12-15T00:00:00"),
    }))).toBe("plazo-cerrado");
  });

  it("devuelve activo cuando el evento es futuro y no requiere confirmación", () => {
    vi.setSystemTime(new Date("2029-01-01T00:00:00"));
    expect(getEventStatus(makeEvent({
      date: new Date("2030-01-01T20:00:00"),
      requiresConfirmation: false,
    }))).toBe("activo");
  });

  it("devuelve activo cuando el evento es futuro y el plazo de confirmación aún no ha pasado", () => {
    vi.setSystemTime(new Date("2029-12-01T00:00:00"));
    expect(getEventStatus(makeEvent({
      date: new Date("2030-01-01T20:00:00"),
      requiresConfirmation: true,
      confirmationDeadline: new Date("2029-12-15T00:00:00"),
    }))).toBe("activo");
  });
});
