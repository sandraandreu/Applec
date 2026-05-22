import { describe, it, expect, vi, beforeEach } from "vitest";
import { setDoc, doc } from "firebase/firestore";
import { saveAttendance } from "../attendance.service";

vi.mock("../../plugins/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    setDoc: vi.fn().mockResolvedValue(undefined),
    doc: vi.fn().mockReturnValue("mock-doc-ref"),
    getDocs: vi.fn(),
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

  it("incluye confirmedAt de tipo Date en el documento", async () => {
    const before = new Date();
    await saveAttendance("group1", "event1", "user1", {
      response: "no",
      linkedResponses: {},
    });
    const after = new Date();

    const payload = vi.mocked(setDoc).mock.calls[0][1] as Record<string, unknown>;
    expect(payload.confirmedAt).toBeInstanceOf(Date);
    const ts = (payload.confirmedAt as Date).getTime();
    expect(ts).toBeGreaterThanOrEqual(before.getTime());
    expect(ts).toBeLessThanOrEqual(after.getTime());
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
