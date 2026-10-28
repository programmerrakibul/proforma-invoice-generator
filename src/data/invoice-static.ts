import { BANK_ACCOUNT_DEFAULTS } from "@/config/bank-accounts";

export const defaultTermsAndConditions = [
  "Negotiable: Any bank in Bangladesh.",
  "L/C amendment charge are on L/C applicant account.",
  "Maturity date must be calculated from the date of delivery.",
  "After signature the delivery challan any discrepancy won't be acceptable.",
  "Overdue interest (if any) should be paid by opener.",
  "Payment to be made on maturity date in the invoice currency.",
  "All apparent errors/discrepancy (if any) would be acceptable by opener.",
];

export const defaultNotes = {
  goodsDeliveryDestination: "Entrust Fashion Limited",
  goodsOrigin: "Bangladesh",
  advisingBank: BANK_ACCOUNT_DEFAULTS.USD.advisingBank,
  allowance: "3% more or less to be accepted in quantity and amount.",
  packing: "By standard Packing.",
  shipmentDate: "30 Days after Getting Approval",
  payment: BANK_ACCOUNT_DEFAULTS.USD.payment,
  partialShipment: "Should be allowed.",
  piValidity: "15 days from the issuing date.",
};
