export const CategoryTypeEnum = {
  LOCAL: 'LOCAL',
  GLOBAL: 'GLOBAL',
} as const

export type CategoryTypeEnum = (typeof CategoryTypeEnum)[keyof typeof CategoryTypeEnum]
