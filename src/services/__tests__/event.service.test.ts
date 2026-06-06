import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDocs, Timestamp } from "firebase/firestore";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import { getEvents } from "../event.service";
import type { FallesEvent } from "../../models/event.model";

vi.mock("../../plugins/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(),
  };
});

const makeDoc = (data: object, id = "evt-1") => ({
  id,
  data: () => data,
});

const baseDocData = {
  groupId: "grp-1",
  createdBy: "user-1",
  name: "Falla Major",
  date: Timestamp.fromDate(new Date("2030-06-15T20:00:00")),
  location: "Valencia",
  startTime: "20:00",
  requiresConfirmation: false,
  sendReminder: false,
  createdAt: Timestamp.fromDate(new Date("2025-01-01T00:00:00")),
};

describe("event.service — toEvent mapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("convierte Timestamp de Firestore a Date correctamente", async () => {
    const eventDate = new Date("2030-06-15T20:00:00");
    const createdAt = new Date("2025-01-01T00:00:00");

    vi.mocked(getDocs).mockResolvedValue({
      docs: [makeDoc({
        ...baseDocData,
        date: Timestamp.fromDate(eventDate),
        createdAt: Timestamp.fromDate(createdAt),
      })],
    } as unknown as QuerySnapshot<DocumentData>);

    const events = await getEvents("grp-1");
    const event = (events as FallesEvent[])[0];

    expect(events).toHaveLength(1);
    expect(event.date).toEqual(eventDate);
    expect(event.createdAt).toEqual(createdAt);
  });

  it("confirmationDeadline es undefined cuando no viene de Firestore", async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [makeDoc(baseDocData)],
    } as unknown as QuerySnapshot<DocumentData>);

    const events = await getEvents("grp-1");

    expect((events as FallesEvent[])[0].confirmationDeadline).toBeUndefined();
  });

  it("confirmationDeadline se convierte a Date cuando está presente", async () => {
    const deadline = new Date("2030-06-01T00:00:00");

    vi.mocked(getDocs).mockResolvedValue({
      docs: [makeDoc({
        ...baseDocData,
        requiresConfirmation: true,
        confirmationDeadline: Timestamp.fromDate(deadline),
      })],
    } as unknown as QuerySnapshot<DocumentData>);

    const events = await getEvents("grp-1");

    expect((events as FallesEvent[])[0].confirmationDeadline).toEqual(deadline);
  });

  it("devuelve null si Firestore falla", async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error("permission-denied"));

    const events = await getEvents("grp-1");

    expect(events).toBeNull();
  });
});
