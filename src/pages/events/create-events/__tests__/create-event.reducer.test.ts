import { describe, it, expect } from "vitest";
import { createEventReducer, initialState } from "../create-event.reducer";
import type { CreateEventStep1Data } from "../CreateEventStep1Page";
import type { CreateEventStep2Data, CreateEventStep2Draft } from "../CreateEventStep2Page";
import type { CreateEventStep3Draft } from "../CreateEventStep3Page";

const step1Fixture: CreateEventStep1Data = {
  eventType: "normal",
  eventName: "Falla Major",
  description: "Descripció de la falla",
};

const step2Fixture: CreateEventStep2Data = {
  date: new Date("2026-03-19T20:00:00"),
  startTime: "20:00",
  endTime: "23:00",
  location: "Plaça del Poble",
};

const step2DraftFixture: CreateEventStep2Draft = {
  date: new Date("2026-03-19T20:00:00"),
  startTime: "20:00",
  endTime: "23:00",
  location: "Plaça del Poble",
};

const step3DraftFixture: CreateEventStep3Draft = {
  requiresConfirmation: true,
  sendReminder: false,
  deadlineOpen: true,
  deadlineDate: new Date("2026-03-15"),
  deadlineTime: "23:59",
  allowExternalGuests: false,
};

describe("createEventReducer", () => {
  it("COMPLETE_STEP1 advances to step 2 with forward direction", () => {
    const result = createEventReducer(initialState, { type: "COMPLETE_STEP1", payload: step1Fixture });
    expect(result.step).toBe(2);
    expect(result.direction).toBe("forward");
    expect(result.step1Data).toBe(step1Fixture);
  });

  it("COMPLETE_STEP2 advances to step 3 and builds step2Draft with endTime", () => {
    const state = createEventReducer(initialState, { type: "COMPLETE_STEP1", payload: step1Fixture });
    const result = createEventReducer(state, { type: "COMPLETE_STEP2", payload: step2Fixture });
    expect(result.step).toBe(3);
    expect(result.direction).toBe("forward");
    expect(result.step2Data).toBe(step2Fixture);
    expect(result.step2Draft?.endTime).toBe("23:00");
  });

  it("COMPLETE_STEP2 sets step2Draft endTime to empty string when endTime is undefined", () => {
    const step2NoEnd: CreateEventStep2Data = { ...step2Fixture, endTime: undefined };
    const state = createEventReducer(initialState, { type: "COMPLETE_STEP1", payload: step1Fixture });
    const result = createEventReducer(state, { type: "COMPLETE_STEP2", payload: step2NoEnd });
    expect(result.step2Draft?.endTime).toBe("");
  });

  it("BACK_TO_STEP1 goes back to step 1 with backward direction and saves draft", () => {
    const result = createEventReducer(initialState, { type: "BACK_TO_STEP1", payload: step2DraftFixture });
    expect(result.step).toBe(1);
    expect(result.direction).toBe("backward");
    expect(result.step2Draft).toBe(step2DraftFixture);
  });

  it("BACK_TO_STEP2 goes back to step 2 with backward direction and saves draft", () => {
    const result = createEventReducer(initialState, { type: "BACK_TO_STEP2", payload: step3DraftFixture });
    expect(result.step).toBe(2);
    expect(result.direction).toBe("backward");
    expect(result.step3Draft).toBe(step3DraftFixture);
  });

  it("SET_SUBMITTING sets isLoading and clears errorKey", () => {
    const state = { ...initialState, errorKey: "events:error.generic" };
    const result = createEventReducer(state, { type: "SET_SUBMITTING" });
    expect(result.isLoading).toBe(true);
    expect(result.errorKey).toBeUndefined();
  });

  it("SET_ERROR clears isLoading and sets errorKey", () => {
    const state = { ...initialState, isLoading: true };
    const result = createEventReducer(state, { type: "SET_ERROR", payload: "events:error.generic" });
    expect(result.isLoading).toBe(false);
    expect(result.errorKey).toBe("events:error.generic");
  });

  it("SET_ERROR with undefined payload clears errorKey", () => {
    const state = { ...initialState, errorKey: "events:error.generic" };
    const result = createEventReducer(state, { type: "SET_ERROR", payload: undefined });
    expect(result.errorKey).toBeUndefined();
  });

  it("full forward flow reaches step 3 with all data preserved", () => {
    const s1 = createEventReducer(initialState, { type: "COMPLETE_STEP1", payload: step1Fixture });
    const s2 = createEventReducer(s1, { type: "COMPLETE_STEP2", payload: step2Fixture });
    const s3 = createEventReducer(s2, { type: "SET_SUBMITTING" });
    expect(s3.step).toBe(3);
    expect(s3.step1Data).toBe(step1Fixture);
    expect(s3.step2Data).toBe(step2Fixture);
    expect(s3.isLoading).toBe(true);
  });

  it("unknown action returns state unchanged", () => {
    const result = createEventReducer(initialState, { type: "UNKNOWN" } as never);
    expect(result).toBe(initialState);
  });
});
