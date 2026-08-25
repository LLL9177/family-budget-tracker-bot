export const CategoryUsedInEnum = {
  EARNING: "EARNING",
  PAYMENT: "PAYMENT",
  BOTH: "BOTH",
} as const;

export type CategoryUsedInEnum =
  (typeof CategoryUsedInEnum)[keyof typeof CategoryUsedInEnum];
