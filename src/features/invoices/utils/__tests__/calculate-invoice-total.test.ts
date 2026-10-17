import assert from "node:assert";
import {
  calculateLineItemTotal,
  calculateInvoiceTotals,
  roundMoney,
} from "../calculate-invoice-total.ts";

function expectClose(actual: number, expected: number, label: string) {
  assert.strictEqual(roundMoney(actual), roundMoney(expected), label);
}

// roundMoney
expectClose(roundMoney(10.005), 10.01, "rounds half up");
expectClose(roundMoney(10.004), 10, "rounds down");
expectClose(roundMoney(0.1 + 0.2), 0.3, "avoids float drift");

// calculateLineItemTotal
expectClose(calculateLineItemTotal(2, 10), 20, "whole numbers");
expectClose(calculateLineItemTotal(0, 10), 0, "zero quantity");
expectClose(calculateLineItemTotal(1.5, 10.33), 15.5, "decimal quantity");
expectClose(calculateLineItemTotal(100, 0.007), 0.7, "small unit price");
expectClose(calculateLineItemTotal(10000, 1234.56), 12345600, "large quantity");

// calculateInvoiceTotals
const items = [
  { quantity: 2, unitPrice: 10 },
  { quantity: 1.5, unitPrice: 20.33 },
];
const result = calculateInvoiceTotals(items);
assert.strictEqual(result.lineItems[0].totalAmount, 20, "line 1 total");
expectClose(result.lineItems[1].totalAmount, 30.5, "line 2 total");
expectClose(result.subtotal, 50.5, "subtotal");
expectClose(result.totalAmount, 50.5, "total amount");

const empty = calculateInvoiceTotals([]);
assert.strictEqual(empty.subtotal, 0, "empty subtotal");
assert.strictEqual(empty.totalAmount, 0, "empty total");

console.log("calculate-invoice-total tests passed");
