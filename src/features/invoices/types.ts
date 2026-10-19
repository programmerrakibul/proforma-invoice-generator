export interface InvoiceLineItemView {
  id: string;
  description: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  unit: string;
}

export interface InvoiceDocumentLineItem {
  description: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface InvoiceDocumentSeller {
  companyName: string;
  address: string;
  corporateOffice: string;
  contactNumber: string;
  email: string;
}

export interface InvoiceDocumentBuyer {
  name: string;
  address: string;
  destinationCountry: string;
}

export interface InvoiceDocumentNotes {
  goodsDeliveryDestination?: string;
  goodsOrigin?: string;
  advisingBank?: string;
  allowance?: string;
  packing?: string;
  shipmentDate?: string;
  payment?: string;
  partialShipment?: string;
  piValidity?: string;
}

export interface InvoiceDocumentData {
  piNumber: string;
  issueDateLabel: string;
  currency: string;
  seller: InvoiceDocumentSeller;
  buyer: InvoiceDocumentBuyer;
  lineItems: InvoiceDocumentLineItem[];
  subtotal: number;
  totalUnitPrice: number;
  totalAmount: number;
  totalQuantity: number;
  sayTotal: string;
  notes: InvoiceDocumentNotes;
  termsAndConditions: string[];
}
