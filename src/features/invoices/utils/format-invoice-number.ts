/**
 * Format a proforma invoice number from an issue date and sequence.
 * Format: PI-YYYYMMDD-###
 */
export function formatInvoiceNumber(date: Date | string, sequence: number): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const seq = String(Math.max(1, sequence)).padStart(3, "0");
  return `PI-${yyyy}${mm}${dd}-${seq}`;
}
