/**
 * Decimal-safe invoice calculation utilities.
 *
 * Strategy: all multiplication is performed on scaled integers so binary
 * floating-point drift never affects money. The result is rounded to two
 * decimal places in one documented place (`roundMoney`). This preserves
 * sub-cent inputs (e.g. quantity 100 × price 0.007 = 0.70) which a naive
 * cents-conversion would lose.
 *
 * The server calculation is authoritative; client previews use the same
 * functions so the numbers always match.
 */

const CENTS_PER_UNIT = 100;

/** Round a monetary amount to two decimal places. */
export function roundMoney(amount: number): number {
  return Math.round(amount * CENTS_PER_UNIT) / CENTS_PER_UNIT;
}

/**
 * Scale a decimal number into an integer significand and a decimal count.
 * E.g. 20.33 -> { int: 2033, decimals: 2 }; 100 -> { int: 100, decimals: 0 }.
 */
function scaleDecimal(num: number): { int: number; decimals: number } {
  const str = String(Math.abs(num));
  let decimals = 0;
  let intStr = str;
  if (str.includes(".")) {
    const [whole, fraction] = str.split(".");
    decimals = fraction.length;
    intStr = whole + fraction;
  }
  return { int: Number(intStr), decimals };
}

/**
 * Round `scaled` (which equals value × 10^totalDecimals) to the nearest cent,
 * using pure integer arithmetic to avoid float error.
 */
function roundToCents(scaled: number, totalDecimals: number): number {
  const m = totalDecimals - 2;
  if (m <= 0) {
    return scaled * 10 ** -m;
  }
  const divisor = 10 ** m;
  const half = 5 * 10 ** (m - 1);
  return Math.floor((scaled + half) / divisor);
}

/**
 * Calculate the total for a single line item: quantity × unit price.
 * Rounded once to two decimals using integer math.
 */
export function calculateLineItemTotal(
  quantity: number,
  unitPrice: number,
): number {
  const q = scaleDecimal(quantity);
  const p = scaleDecimal(unitPrice);
  const scaled = q.int * p.int;
  const totalDecimals = q.decimals + p.decimals;
  const roundedCents = roundToCents(scaled, totalDecimals);
  return roundedCents / CENTS_PER_UNIT;
}

/**
 * Calculate invoice subtotal and total from line items.
 * Missing quantity/unitPrice are treated as zero (supports incomplete drafts).
 * Server calculation is authoritative.
 * The full shape of each line item is preserved via generics.
 */
export function calculateInvoiceTotals<
  T extends {
    quantity?: number | null;
    unitPrice?: number | null;
  },
>(lineItems: Array<T>) {
  const lineTotals = lineItems.map((item) => {
    const quantity = item.quantity ?? 0;
    const unitPrice = item.unitPrice ?? 0;
    const total = calculateLineItemTotal(quantity, unitPrice);
    return {
      ...item,
      quantity,
      unitPrice,
      totalAmount: total,
    };
  });

  const subtotal = roundMoney(
    lineTotals.reduce((sum, item) => sum + item.totalAmount, 0),
  );
  const totalAmount = roundMoney(subtotal);

  return {
    lineItems: lineTotals,
    subtotal,
    totalAmount,
  };
}
