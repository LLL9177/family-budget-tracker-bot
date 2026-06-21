export const NotificationKeyEnum = {
  YOURE_KICKED: "YOURE_KICKED",
  USER_KICKED: "USER_KICKED",
  JOIN_REQUEST: "JOIN_REQUEST",
  JOIN_ACCEPTED: "JOIN_ACCEPTED",
  JOIN_REJECTED: "JOIN_REJECTED",
  USER_JOINED: "USER_JOINED",

  LOGIN_REQUEST: "LOGIN_REQUEST",
} as const;

export type NotificationKeyEnum =
  (typeof NotificationKeyEnum)[keyof typeof NotificationKeyEnum];
