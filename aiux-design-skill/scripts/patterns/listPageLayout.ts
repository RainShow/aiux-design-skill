/**
 * 列表分页默认条数。用户改条数时只动这里，不要在各页写死。
 * 表格 / 看板内嵌表：10。卡片 1 列、2 列：10。卡片 3 列：15。
 */
export const LIST_DEFAULT_PAGE_SIZE = 10

export const LIST_CARD_PAGE_SIZE_1COL = 10
export const LIST_CARD_PAGE_SIZE_2COL = 10
export const LIST_CARD_PAGE_SIZE_3COL = 15

/** 按卡片列数取默认每页条数。 */
export function listCardPageSize(cols: 1 | 2 | 3): number {
  if (cols === 3) return LIST_CARD_PAGE_SIZE_3COL
  if (cols === 2) return LIST_CARD_PAGE_SIZE_2COL
  return LIST_CARD_PAGE_SIZE_1COL
}
