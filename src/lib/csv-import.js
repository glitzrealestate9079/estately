// Pure utility helpers for bulk CSV property import (mock, frontend-only).
// No React here — this module is safe to unit test / reuse anywhere.
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";

export const REQUIRED_COLUMNS = [
  "title",
  "propertyType",
  "listingType",
  "city",
  "locality",
  "price",
  "carpetArea",
  "ownerName",
  "ownerPhone",
];

/**
 * Splits a raw CSV string into headers + rows.
 * Each line is split on commas and every cell is trimmed.
 * Full quoted-comma support is not required.
 */
export function parseCsv(text) {
  const lines = (text ?? "")
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((cell) => cell.trim());
  const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));

  return { headers, rows };
}

/**
 * Validates a single CSV row (an array of cells) against the given headers.
 * Checks that every required column is present and non-empty, and that
 * propertyType / listingType (if present) match the allowed constants.
 */
export function validatePropertyRow(row, headers) {
  const errors = [];
  const record = {};

  headers.forEach((header, index) => {
    record[header] = row[index]?.trim() ?? "";
  });

  REQUIRED_COLUMNS.forEach((column) => {
    if (!record[column]) {
      errors.push(`${column} is required`);
    }
  });

  if (record.propertyType && !PROPERTY_TYPES.includes(record.propertyType)) {
    errors.push(`propertyType "${record.propertyType}" is not a valid property type`);
  }

  if (record.listingType && !LISTING_TYPES.includes(record.listingType)) {
    errors.push(`listingType "${record.listingType}" is not a valid listing type`);
  }

  return {
    valid: errors.length === 0,
    errors,
    record,
  };
}
