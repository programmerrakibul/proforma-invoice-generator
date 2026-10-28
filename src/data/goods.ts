import type { InvoiceCurrency } from "@/config/bank-accounts";
import { getBankAccountDetails, getPaymentTerms } from "@/data/bank-accounts";

export interface InvoiceGood {
  fabric: string;
  construction: string;
  width: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceGoodsDetail {
  key: string;
  label: string;
  value: string;
}

export const defaultGoods: InvoiceGood[] = [
  {
    fabric: "35% Cotton 65% Polyester TC",
    construction: "45x45/90x60",
    width: "56",
    style: "Buyer: MAX DUBAI - B27MCSFEWB250B",
    color: "Navy",
    quantity: 1958,
    unitPrice: 0.7,
    totalPrice: 1370.6,
  },
];

const defaultGoodsDetailFields: ReadonlyArray<
  Omit<InvoiceGoodsDetail, "value">
> = [
  { key: "goodsDeliveryDestination", label: "Goods Delivery Destination" },
  { key: "goodsOrigin", label: "Goods Origin" },
  { key: "advisingBank", label: "Advising Bank" },
  { key: "allowance", label: "Allowance" },
  { key: "packing", label: "Packing" },
  { key: "shipmentDate", label: "Shipment date" },
  { key: "payment", label: "Payment" },
  { key: "partialShipment", label: "Partial shipment" },
  { key: "piValidity", label: "PI validity" },
];

const defaultGoodsDetailValues: Readonly<
  Record<string, (currency: InvoiceCurrency) => string>
> = {
  goodsDeliveryDestination: () => "",
  goodsOrigin: () => "Bangladesh",
  advisingBank: getBankAccountDetails,
  allowance: () => "3% more or less to be accepted in quantity and amount.",
  packing: () => "By standard Packing.",
  shipmentDate: () => "30 Days after Getting Approval",
  payment: getPaymentTerms,
  partialShipment: () => "Should be allowed.",
  piValidity: () => "15 days from the issuing date.",
};

export function getDefaultGoodsDetails(
  currency: InvoiceCurrency,
): InvoiceGoodsDetail[] {
  return defaultGoodsDetailFields.map((field) => ({
    ...field,
    value: defaultGoodsDetailValues[field.key](currency),
  }));
}
