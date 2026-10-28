export const INVOICE_CURRENCIES = ["USD", "EUR", "GBP", "BDT"] as const;

export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];

export interface BankAccountDefaults {
  advisingBank: string;
  payment: string;
}

const unconfiguredBankAccountDefaults: BankAccountDefaults = {
  advisingBank: "",
  payment: "",
};

export const BANK_ACCOUNT_DEFAULTS: Readonly<
  Record<InvoiceCurrency, Readonly<BankAccountDefaults>>
> = {
  USD: {
    advisingBank:
      "NRBC BANK LIMITED (Kamarpara Sub Branch) A/C: 5209-33300000609 | Swift Code: NRBBBDDH | VAT Reg. No: 004906505-0306",
    payment: "By 100% confirmed irrevocable L/C at 90 days sight",
  },
  EUR: unconfiguredBankAccountDefaults,
  GBP: unconfiguredBankAccountDefaults,
  BDT: unconfiguredBankAccountDefaults,
};

export function isInvoiceCurrency(value: string): value is InvoiceCurrency {
  return INVOICE_CURRENCIES.some((currency) => currency === value);
}
