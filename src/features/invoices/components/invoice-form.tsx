"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import { InvoiceSummary } from "@/features/invoices/components/invoice-summary";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";

type InvoiceFormValues = CreateInvoiceInput;

interface InvoiceFormProps {
  companyProfile: InvoiceFormValues["seller"];
}

export function InvoiceForm({ companyProfile }: InvoiceFormProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const currencyOptions = ["USD", "EUR", "GBP", "BDT"];

  return (
    <div className="space-y-6">
      {/* Invoice details */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Invoice details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="invoiceNumber">Invoice number</Label>
            <Input
              id="invoiceNumber"
              {...register("invoiceNumber")}
              className="h-7 text-xs"
            />
            {errors.invoiceNumber && (
              <p className="text-xs text-destructive mt-1">
                {errors.invoiceNumber.message}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="issueDate">Issue date</Label>
            <Controller
              control={control}
              name="issueDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger>
                    <Input
                      id="issueDate"
                      {...field}
                      placeholder="Select date"
                      className="h-7 text-xs"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-1 w-64">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectedDate: Date | undefined) => {
                        field.onChange(
                          selectedDate
                            ? selectedDate.toISOString().slice(0, 10)
                            : "",
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.issueDate && (
              <p className="text-xs text-destructive mt-1">
                {errors.issueDate.message}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="currency">Currency</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-7 text-xs" id="currency">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currency && (
              <p className="text-xs text-destructive mt-1">{errors.currency.message}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Seller details */}
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-ink text-sm flex items-center gap-2">
            <span className="h-3 w-0.5 bg-primary rounded-full" /> Seller details
          </h2>
          <Button variant="outline" size="sm" onClick={() => {
            setValue("seller.companyName", companyProfile.companyName);
            setValue("seller.address", companyProfile.address);
            setValue("seller.corporateOffice", companyProfile.corporateOffice);
            setValue("seller.contactNumber", companyProfile.contactNumber);
            setValue("seller.email", companyProfile.email);
          }}>
            Use company profile
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="sellerCompany">Company name</Label>
            <Input
              id="sellerCompany"
              {...register("seller.companyName")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="sellerAddress">Address</Label>
            <Input
              id="sellerAddress"
              {...register("seller.address")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerOffice">Corporate office</Label>
            <Input
              id="sellerOffice"
              {...register("seller.corporateOffice")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerContact">Contact number</Label>
            <Input
              id="sellerContact"
              {...register("seller.contactNumber")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerEmail">Email</Label>
            <Input
              id="sellerEmail"
              type="email"
              {...register("seller.email")}
              className="h-7 text-xs"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Buyer / consignee */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Buyer / consignee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="buyerName">Buyer name</Label>
            <Input id="buyerName" {...register("buyer.name")} className="h-7 text-xs" />
            {errors.buyer?.name && (
              <p className="text-xs text-destructive mt-1">{errors.buyer.name.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="buyerAddress">Address</Label>
            <Input id="buyerAddress" {...register("buyer.address")} className="h-7 text-xs" />
            {errors.buyer?.address && (
              <p className="text-xs text-destructive mt-1">{errors.buyer.address.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="buyerCountry">Destination country</Label>
            <Input id="buyerCountry" {...register("buyer.destinationCountry")} className="h-7 text-xs" />
            {errors.buyer?.destinationCountry && (
              <p className="text-xs text-destructive mt-1">{errors.buyer.destinationCountry.message}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Products / line items */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-2">
          Products / line items
        </h2>
        <InvoiceLineItems currency="USD" onAdd={() => {}} />
      </section>

      <Separator />

      {/* Notes and terms */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-4">
          Notes and terms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sayTotal">Say total</Label>
            <Textarea
              id="sayTotal"
              {...register("notes.sayTotal")}
              className="h-24 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="goodsDeliveryDestination">
              Goods delivery destination
            </Label>
            <Textarea
              id="goodsDeliveryDestination"
              {...register("notes.goodsDeliveryDestination")}
              className="h-24 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="goodsOrigin">Goods origin</Label>
            <Input
              id="goodsOrigin"
              {...register("notes.goodsOrigin")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="advisingBank">Advising bank</Label>
            <Input
              id="advisingBank"
              {...register("notes.advisingBank")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="allowance">Allowance</Label>
            <Input
              id="allowance"
              {...register("notes.allowance")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="packing">Packing</Label>
            <Input
              id="packing"
              {...register("notes.packing")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="shipmentDate">Shipment date</Label>
            <Input
              id="shipmentDate"
              {...register("notes.shipmentDate")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="payment">Payment</Label>
            <Input
              id="payment"
              {...register("notes.payment")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="partialShipment">Partial shipment</Label>
            <Input
              id="partialShipment"
              {...register("notes.partialShipment")}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="piValidity">PI validity</Label>
            <Input
              id="piValidity"
              {...register("notes.piValidity")}
              className="h-7 text-xs"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="termsAndConditions">Terms and conditions</Label>
          <Textarea
            id="termsAndConditions"
            {...register("termsAndConditions")}
            className="h-32 text-xs"
            placeholder="Enter one term per line"
          />
          {errors.termsAndConditions && (
            <p className="text-xs text-destructive mt-1">
              {errors.termsAndConditions.message}
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* Signatures */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-4">
          Signatures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="buyerLabel">Buyer authorized signature</Label>
            <Input
              id="buyerLabel"
              {...register("signatures.buyerLabel")}
              className="h-7 text-xs"
            />
            <label className="flex items-center gap-2 text-xs mt-3 cursor-pointer select-none">
              <input type="checkbox" {...register("signatures.includeBuyerSignature")} />
              <span>Include buyer signature</span>
            </label>
          </div>
          <div>
            <Label htmlFor="sellerLabel">Seller signature</Label>
            <Input
              id="sellerLabel"
              {...register("signatures.sellerLabel")}
              className="h-7 text-xs"
            />
            <label className="flex items-center gap-2 text-xs mt-3 cursor-pointer select-none">
              <input type="checkbox" {...register("signatures.includeSellerSignature")} />
              <span>Include seller signature</span>
            </label>
          </div>
        </div>
      </section>

      {/* Totals summary */}
      <InvoiceSummary />
    </div>
  );
}
