import { describe, it, expect, vi, beforeEach } from "vitest";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { saveAttendance } from "../attendance.service";

vi.mock("../../plugins/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    setDoc: vi.fn().mockResolvedValue(undefined),
    doc: vi.fn().mockReturnValue("mock-doc-ref"),
    getDocs: vi.fn(),
    serverTimestamp: vi.fn().mockReturnValue("mock-server-timestamp"),
    deleteField: vi.fn().mockReturnValue("mock-delete-field"),
  };
});

describe("saveAttendance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("llama a setDoc con la ruta correcta y merge:true", async () => {
    await saveAttendance("group1", "event1", "user1", {
      response: "yes",
      linkedResponses: {},
    });

    expect(doc).toHaveBeenCalledWith(
      {},
      "groups", "group1", "events", "event1", "attendances", "user1"
    );
    expect(setDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        response: "yes",
        linkedResponses: {},
        userId: "user1",
        eventId: "event1",
      }),
      { merge: true }
    );
  });

  it("incluye confirmedAt usando serverTimestamp", async () => {
    await saveAttendance("group1", "event1", "user1", {
      response: "no",
      linkedResponses: {},
    });

    expect(serverTimestamp).toHaveBeenCalled();
    const payload = vi.mocked(setDoc).mock.calls[0][1] as Record<string, unknown>;
    expect(payload.confirmedAt).toBe("mock-server-timestamp");
  });

  it("guarda linkedResponses en el documento", async () => {
    await saveAttendance("group1", "event1", "user1", {
      response: "yes",
      linkedResponses: { linked1: "yes", linked2: "no" },
    });

    expect(setDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        linkedResponses: { linked1: "yes", linked2: "no" },
      }),
      { merge: true }
    );
  });
});
