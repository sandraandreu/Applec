import { describe, it, expect } from "vitest";
import { editEventReducer, initialState } from "../edit-event.reducer";
import type { FallesEvent } from "../../../../models/event.model";

const eventFixture: FallesEvent = {
  id: "evt-1",
  groupId: "grp-1",
  createdBy: "user-1",
  name: "Falla Major",
  date: new Date("2026-03-19T20:00:00"),
  location: "Plaça del Poble",
  startTime: "20:00",
  requiresConfirmation: true,
  sendReminder: true,
  createdAt: new Date("2026-01-01"),
  isSpecial: true,
  confirmationDeadline: new Date("2026-03-15T23:59:00"),
};

describe("editEventReducer", () => {
  describe("SET_EVENT_DATA", () => {
    it("populates all fields from the event and clears isLoading", () => {
      const result = editEventReducer(initialState, { type: "SET_EVENT_DATA", payload: eventFixture });
      expect(result.isLoading).toBe(false);
      expect(result.event).toBe(eventFixture);
      expect(result.eventType).toBe("special");
      expect(result.selectedDate).toBe(eventFixture.date);
      expect(result.currentMonth).toBe(eventFixture.date);
      expect(result.requiresConfirmation).toBe(true);
      expect(result.sendReminder).toBe(true);
      expect(result.deadlineOpen).toBe(true);
      expect(result.deadlineDate).toBe(eventFixture.confirmationDeadline);
      expect(result.deadlineMonth).toBe(eventFixture.confirmationDeadline);
    });

    it("sets eventType to normal for non-special events", () => {
      const normalEvent = { ...eventFixture, isSpecial: false };
      const result = editEventReducer(initialState, { type: "SET_EVENT_DATA", payload: normalEvent });
      expect(result.eventType).toBe("normal");
    });

    it("sets deadlineOpen to false when event has no confirmationDeadline", () => {
      const noDeadline = { ...eventFixture, confirmationDeadline: undefined };
      const result = editEventReducer(initialState, { type: "SET_EVENT_DATA", payload: noDeadline });
      expect(result.deadlineOpen).toBe(false);
      expect(result.deadlineDate).toBeUndefined();
    });

    it("formats deadlineTime from confirmationDeadline", () => {
      const result = editEventReducer(initialState, { type: "SET_EVENT_DATA", payload: eventFixture });
      expect(result.deadlineTime).toBe("23:59");
    });

    it("keeps initial deadlineTime when event has no deadline", () => {
      const noDeadline = { ...eventFixture, confirmationDeadline: undefined };
      const result = editEventReducer(initialState, { type: "SET_EVENT_DATA", payload: noDeadline });
      expect(result.deadlineTime).toBe(initialState.deadlineTime);
    });
  });

  describe("SET_DATE", () => {
    it("sets selectedDate and updates currentMonth", () => {
      const date = new Date("2026-05-01");
      const result = editEventReducer(initialState, { type: "SET_DATE", payload: date });
      expect(result.selectedDate).toBe(date);
      expect(result.currentMonth).toBe(date);
    });

    it("clears dateError when a date is provided", () => {
      const stateWithError = { ...initialState, dateError: true };
      const result = editEventReducer(stateWithError, { type: "SET_DATE", payload: new Date() });
      expect(result.dateError).toBe(false);
    });

    it("does not clear dateError when payload is undefined", () => {
      const stateWithError = { ...initialState, dateError: true };
      const result = editEventReducer(stateWithError, { type: "SET_DATE", payload: undefined });
      expect(result.dateError).toBe(true);
    });
  });

  it("SET_CURRENT_MONTH updates currentMonth", () => {
    const month = new Date("2026-08-01");
    const result = editEventReducer(initialState, { type: "SET_CURRENT_MONTH", payload: month });
    expect(result.currentMonth).toBe(month);
  });

  it("SET_EVENT_TYPE updates eventType", () => {
    const result = editEventReducer(initialState, { type: "SET_EVENT_TYPE", payload: "special" });
    expect(result.eventType).toBe("special");
  });

  it("SET_CONFIRMATION updates requiresConfirmation", () => {
    const result = editEventReducer(initialState, { type: "SET_CONFIRMATION", payload: true });
    expect(result.requiresConfirmation).toBe(true);
  });

  it("SET_REMINDER updates sendReminder", () => {
    const result = editEventReducer(initialState, { type: "SET_REMINDER", payload: true });
    expect(result.sendReminder).toBe(true);
  });

  it("TOGGLE_DEADLINE toggles deadlineOpen", () => {
    const opened = editEventReducer(initialState, { type: "TOGGLE_DEADLINE" });
    expect(opened.deadlineOpen).toBe(true);
    const closed = editEventReducer(opened, { type: "TOGGLE_DEADLINE" });
    expect(closed.deadlineOpen).toBe(false);
  });

  describe("SET_DEADLINE_DATE", () => {
    it("sets deadlineDate and updates deadlineMonth when provided", () => {
      const date = new Date("2026-03-15");
      const result = editEventReducer(initialState, { type: "SET_DEADLINE_DATE", payload: date });
      expect(result.deadlineDate).toBe(date);
      expect(result.deadlineMonth).toBe(date);
    });

    it("clears deadlineDate without changing deadlineMonth when payload is undefined", () => {
      const state = { ...initialState, deadlineMonth: new Date("2026-03-01") };
      const result = editEventReducer(state, { type: "SET_DEADLINE_DATE", payload: undefined });
      expect(result.deadlineDate).toBeUndefined();
      expect(result.deadlineMonth).toBe(state.deadlineMonth);
    });
  });

  it("SET_DEADLINE_MONTH updates deadlineMonth", () => {
    const month = new Date("2026-04-01");
    const result = editEventReducer(initialState, { type: "SET_DEADLINE_MONTH", payload: month });
    expect(result.deadlineMonth).toBe(month);
  });

  it("SET_DEADLINE_TIME updates deadlineTime", () => {
    const result = editEventReducer(initialState, { type: "SET_DEADLINE_TIME", payload: "18:00" });
    expect(result.deadlineTime).toBe("18:00");
  });

  it("SET_DATE_ERROR sets dateError to true", () => {
    const result = editEventReducer(initialState, { type: "SET_DATE_ERROR" });
    expect(result.dateError).toBe(true);
  });

  it("SET_SUBMITTING sets isSubmitting and clears errorKey", () => {
    const state = { ...initialState, errorKey: "events:error.generic" };
    const result = editEventReducer(state, { type: "SET_SUBMITTING" });
    expect(result.isSubmitting).toBe(true);
    expect(result.errorKey).toBeUndefined();
  });

  it("SET_ERROR clears isSubmitting and sets errorKey", () => {
    const state = { ...initialState, isSubmitting: true };
    const result = editEventReducer(state, { type: "SET_ERROR", payload: "events:error.generic" });
    expect(result.isSubmitting).toBe(false);
    expect(result.errorKey).toBe("events:error.generic");
  });

  it("unknown action returns state unchanged", () => {
    const result = editEventReducer(initialState, { type: "UNKNOWN" } as never);
    expect(result).toBe(initialState);
  });
});
