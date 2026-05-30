export const RolesEnum = {
  USER: "user",
  FAMILY_OWNER: "family_owner",
} as const;

export type RolesEnum =
(typeof RolesEnum)[keyof typeof RolesEnum];