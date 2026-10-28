/**
 * Convert a monetary amount to English words for the "say total" callout.
 * Supports whole dollars and cents up to 999 trillion.
 */

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const GROUPS = ["", "thousand", "million", "billion", "trillion"];

function convertThreeDigits(n: number): string {
  if (n === 0) return "";
  let out = "";
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds > 0) {
    out += `${ONES[hundreds]} hundred`;
  }
  if (rest > 0) {
    if (hundreds > 0) out += " ";
    if (rest < 20) {
      out += ONES[rest];
    } else {
      const tens = Math.floor(rest / 10);
      const ones = rest % 10;
      out += TENS[tens];
      if (ones > 0) out += ` ${ONES[ones]}`;
    }
  }
  return out;
}

/**
 * Convert a whole number to words.
 */
export function numberToWordsWhole(amount: number): string {
  const n = Math.floor(amount);
  if (n === 0) return "zero";
  if (n < 0) return `negative ${numberToWordsWhole(-n)}`;
  const parts: string[] = [];
  let groupIndex = 0;
  let remaining = n;
  while (remaining > 0) {
    const group = remaining % 1000;
    if (group > 0) {
      const groupWords = convertThreeDigits(group);
      const scale = GROUPS[groupIndex];
      parts.unshift(scale ? `${groupWords} ${scale}` : groupWords);
    }
    remaining = Math.floor(remaining / 1000);
    groupIndex += 1;
  }
  return parts.join(" ");
}

/**
 * Convert a monetary amount to words with currency.
 * e.g. numberToWords(1234.56, "USD") -> "one thousand two hundred thirty-four USD and 56 cents"
 */
const MINOR_CURRENCY_UNITS: Record<InvoiceCurrency, string> = {
  USD: "cents",
  EUR: "cents",
  GBP: "pence",
  BDT: "poisha",
};

export function numberToWords(
  amount: number,
  currency: InvoiceCurrency = "USD",
): string {
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.floor(rounded);
  const cents = Math.round((rounded - whole) * 100);

  const wholeWords = numberToWordsWhole(whole);
  const capitalized = wholeWords.charAt(0).toUpperCase() + wholeWords.slice(1);

  let result = `${capitalized} ${currency}`;
  if (cents > 0) {
    const centsWord = numberToWordsWhole(cents);
    result += ` and ${centsWord} ${MINOR_CURRENCY_UNITS[currency]}`;
  } else {
    result += " only";
  }
  return result.trim();
}
import type { InvoiceCurrency } from "@/config/bank-accounts";
