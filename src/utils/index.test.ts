import { describe, expect, it } from "vitest";
import {
  classNames,
  formatDate,
  getNumberInputValue,
  normalizeNumberInputValue,
  parseNumberInputValue,
  slugify,
} from "./index";

describe("classNames", () => {
  it("joins truthy class names with spaces", () => {
    expect(classNames("btn", false, undefined, "active")).toBe("btn active");
  });

  it("returns an empty string when no class names are truthy", () => {
    expect(classNames(false, undefined)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats ISO date values for display", () => {
    expect(formatDate("2026-01-15T12:00:00.000Z")).toBe("Jan 15, 2026");
  });

  it("returns an empty string for missing values", () => {
    expect(formatDate()).toBe("");
    expect(formatDate("")).toBe("");
  });
});

describe("getNumberInputValue", () => {
  it("returns 0 as a visible value for out-of-stock number inputs", () => {
    expect(getNumberInputValue(0)).toBe("0");
  });

  it("returns the string representation for non-zero values", () => {
    expect(getNumberInputValue(12.5)).toBe("12.5");
  });
});

describe("parseNumberInputValue", () => {
  it("parses numeric input strings", () => {
    expect(parseNumberInputValue("42.5")).toBe(42.5);
  });

  it("returns zero for an empty input", () => {
    expect(parseNumberInputValue("")).toBe(0);
  });
});

describe("normalizeNumberInputValue", () => {
  it("replaces a visible zero when the user types a whole number", () => {
    expect(normalizeNumberInputValue("01")).toBe("1");
    expect(normalizeNumberInputValue("003")).toBe("3");
  });

  it("preserves a single zero and decimal values", () => {
    expect(normalizeNumberInputValue("0")).toBe("0");
    expect(normalizeNumberInputValue("0.5")).toBe("0.5");
    expect(normalizeNumberInputValue("")).toBe("");
  });
});

describe("slugify", () => {
  it("normalizes text into a lowercase hyphenated slug", () => {
    expect(slugify(" Fresh Lime Juice ")).toBe("fresh-lime-juice");
  });

  it("removes leading and trailing separators from punctuation-heavy input", () => {
    expect(slugify("!!House Syrup!!")).toBe("house-syrup");
  });
});
