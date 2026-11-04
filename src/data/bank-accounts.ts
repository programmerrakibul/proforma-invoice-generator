import type { InvoiceCurrency } from "@/config/bank-accounts";

export const bankAccounts = {
  "NRBC BANK LIMITED": {
    bankName: "NRBC BANK LIMITED",
    branchName: "Kamarpara Sub Branch",
    accountNumber: "5209-33300000609",
    swiftCode: "NRBBBDDH",
    vatRegistrationNumber: "004906505-0306",
  },
  "BRAC Bank PLC": {
    bankName: "BRAC Bank PLC",
    accountName: "M.M FABRICS",
    accountNumber: "4402203955228001",
    branchName: "MADHABDI BRANCH",
    routingNumber: "060680673",
    swiftCode: "BRAKBDDH",
  },
} as const;

export const bankAccountByCurrency: Readonly<
  Record<InvoiceCurrency, keyof typeof bankAccounts>
> = {
  USD: "NRBC BANK LIMITED",
  BDT: "BRAC Bank PLC",
};

export const paymentTermsByCurrency: Readonly<Record<InvoiceCurrency, string>> =
  {
    USD: "By 100% confirmed irrevocable L/C at 90 days sight in US Dollars.",
    BDT: "By 100% confirmed irrevocable L/C at 90 days sight in Bangladeshi Taka.",
  };

export function getBankAccountDetails(currency: InvoiceCurrency): string {
  const account = bankAccounts[bankAccountByCurrency[currency]];

  return Object.entries(account)
    .filter(([key]) => key !== "bankName")
    .map(([key, value]) => `${formatBankField(key)}: ${value}`)
    .reduce(
      (details, field) => `${details}${details ? " | " : ""}${field}`,
      account.bankName
    );
}

export function getPaymentTerms(currency: InvoiceCurrency): string {
  return paymentTermsByCurrency[currency];
}

function formatBankField(field: string): string {
  return field
    .replace(/[A-Z]/g, (letter) => ` ${letter}`)
    .replace(/^./, (letter) => letter.toUpperCase());
}
