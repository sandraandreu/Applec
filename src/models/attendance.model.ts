export interface Attendance {
  userId: string;
  eventId: string;
  response: "yes" | "no";
  confirmedAt: Date;
  linkedResponses?: { [linkedMemberId: string]: "yes" | "no" };
}

export type AttendanceResponse = Attendance["response"];
