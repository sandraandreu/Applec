export interface Attendance {
  userId: string;
  eventId: string;
  response?: "going" | "not-going";
  confirmedAt: Date;
  linkedResponses?: { [linkedMemberId: string]: "going" | "not-going" };
}

export type AttendanceResponse = Attendance["response"];

export interface EventAttendanceData {
  memberResponses: Record<string, "going" | "not-going">;
  linkedResponses: Record<string, Record<string, "going" | "not-going">>;
}
