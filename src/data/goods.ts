import type { InvoiceCurrency } from "@/config/bank-accounts";
import { getBankAccountDetails, getPaymentTerms } from "@/data/bank-accounts";

export interface InvoiceFabricLineItem {
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface InvoiceLineItem {
  fabric: string;
  construction: string;
  width: string;
  fabricLineItems: InvoiceFabricLineItem[];
}

export interface InvoiceGoodsDetail {
  key: string;
  label: string;
  value: string;
}

export const defaultGoods: InvoiceLineItem[] = [
  {
    fabric: "",
    construction: "",
    width: "",
    fabricLineItems: [
      {
        style: "",
        color: "",
        quantity: 0,
        unitPrice: 0.0,
        totalAmount: 0.0,
      },
    ],
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
