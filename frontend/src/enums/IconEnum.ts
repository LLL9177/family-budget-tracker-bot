export const IconEnum = {
  JOIN_REQUEST: "JOIN_REQUEST",
  JOINED: "JOINED",
  KICKED: "KICKED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type IconEnum = (typeof IconEnum)[keyof typeof IconEnum];
