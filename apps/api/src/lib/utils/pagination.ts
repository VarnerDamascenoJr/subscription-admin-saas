export const ALLOWED_PAGE_SIZES = [10, 25, 50, 100] as const;

export type AllowedPageSize = (typeof ALLOWED_PAGE_SIZES)[number];

export function normalizePage(page: number) {
  return Math.max(1, page);
}

export function normalizePageSize(pageSize: number): AllowedPageSize {
  if (ALLOWED_PAGE_SIZES.includes(pageSize as AllowedPageSize)) {
    return pageSize as AllowedPageSize;
  }

  throw new Error(
    `Invalid pageSize. Allowed values are: ${ALLOWED_PAGE_SIZES.join(', ')}.`,
  );
}
