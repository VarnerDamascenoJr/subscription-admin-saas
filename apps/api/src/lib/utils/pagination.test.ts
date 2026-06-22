import { describe, expect, it } from "vitest";
import { ALLOWED_PAGE_SIZES, normalizePage, normalizePageSize } from "./pagination.js";

describe("pagination utils", () => {
  it("normalizes page values lower than 1", () => {
    expect(normalizePage(0)).toBe(1);
    expect(normalizePage(-5)).toBe(1);
  });

  it("keeps valid page values unchanged", () => {
    expect(normalizePage(1)).toBe(1);
    expect(normalizePage(3)).toBe(3);
  });

  it("accepts only standardized pageSize values", () => {
    for (const pageSize of ALLOWED_PAGE_SIZES) {
      expect(normalizePageSize(pageSize)).toBe(pageSize);
    }
  });

  it("rejects invalid pageSize values with a clear message", () => {
    expect(() => normalizePageSize(0)).toThrow(
      "Invalid pageSize. Allowed values are: 10, 25, 50, 100.",
    );
    expect(() => normalizePageSize(999)).toThrow(
      "Invalid pageSize. Allowed values are: 10, 25, 50, 100.",
    );
  });
});
