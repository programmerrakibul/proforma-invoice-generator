import assert from "node:assert";
import { numberToWords, numberToWordsWhole } from "../number-to-words.ts";

assert.strictEqual(numberToWordsWhole(0), "zero");
assert.strictEqual(numberToWordsWhole(7), "seven");
assert.strictEqual(numberToWordsWhole(21), "twenty one");
assert.strictEqual(numberToWordsWhole(100), "one hundred");
assert.strictEqual(numberToWordsWhole(123), "one hundred twenty three");
assert.strictEqual(numberToWordsWhole(1234), "one thousand two hundred thirty four");
assert.strictEqual(numberToWordsWhole(1234567), "one million two hundred thirty four thousand five hundred sixty seven");

// Currency amounts
assert.strictEqual(numberToWords(0, "USD"), "Zero USD only");
assert.strictEqual(numberToWords(10, "USD"), "Ten USD only");
assert.strictEqual(numberToWords(10.5, "USD"), "Ten USD and fifty cents");
assert.strictEqual(numberToWords(1234.56, "USD"), "One thousand two hundred thirty four USD and fifty six cents");

console.log("number-to-words tests passed");
