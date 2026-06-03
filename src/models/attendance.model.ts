export type AttendanceVote = "going" | "not-going";

export interface Attendance {
  userId: string;
  eventId: string;
  response?: AttendanceVote;
  confirmedAt: Date;
  linkedResponses?: { [linkedMemberId: string]: AttendanceVote };
}

export type AttendanceResponse = Attendance["response"];

export interface EventAttendanceData {
  memberResponses: Record<string, AttendanceVote>;
  linkedResponses: Record<string, Record<string, AttendanceVote>>;
}
