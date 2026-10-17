import assert from "node:assert";
import { formatInvoiceNumber } from "../format-invoice-number.ts";

assert.strictEqual(formatInvoiceNumber(new Date("2026-01-15"), 1), "PI-20260115-001");
assert.strictEqual(formatInvoiceNumber("2026-10-15", 42), "PI-20261015-042");
assert.strictEqual(formatInvoiceNumber(new Date("2026-05-03"), 999), "PI-20260503-999");

console.log("format-invoice-number tests passed");
