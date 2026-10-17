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
        <h2 className=" font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Invoice details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="piNumber">PI number</Label>
            <Input
              id="piNumber"
              {...register("piNumber")}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
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
              <p className="text-xs text-destructive mt-1">{errors.issueDate.message}</p>
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

      {/* Seller details - static from company profile */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className=" font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Seller details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="sellerCompany">Company name</Label>
            <Input
              id="sellerCompany"
              defaultValue={companyProfile.companyName}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="sellerAddress">Address</Label>
            <Input
              id="sellerAddress"
              defaultValue={companyProfile.address}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerOffice">Corporate office</Label>
            <Input
              id="sellerOffice"
              defaultValue={companyProfile.corporateOffice}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerContact">Contact number</Label>
            <Input
              id="sellerContact"
              defaultValue={companyProfile.contactNumber}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="sellerEmail">Email</Label>
            <Input
              id="sellerEmail"
              type="email"
              defaultValue={companyProfile.email}
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Buyer / consignee - static */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className=" font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Buyer / consignee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="buyerName">Buyer name</Label>
            <Input
              id="buyerName"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="buyerAddress">Address</Label>
            <Input
              id="buyerAddress"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="buyerCountry">Destination country</Label>
            <Input
              id="buyerCountry"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Products / line items */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className=" font-semibold text-ink text-sm mb-2">
          Products / line items
        </h2>
        <InvoiceLineItems currency="USD" onAdd={() => {}} />
      </section>

      <Separator />

      {/* Notes and terms - static */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className=" font-semibold text-ink text-sm mb-4">
          Notes and terms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sayTotal">Say total</Label>
            <Textarea
              id="sayTotal"
              defaultValue=""
              className="h-24 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="goodsDeliveryDestination">
              Goods delivery destination
            </Label>
            <Textarea
              id="goodsDeliveryDestination"
              defaultValue=""
              className="h-24 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="goodsOrigin">Goods origin</Label>
            <Input
              id="goodsOrigin"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="advisingBank">Advising bank</Label>
            <Input
              id="advisingBank"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="allowance">Allowance</Label>
            <Input
              id="allowance"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="packing">Packing</Label>
            <Input
              id="packing"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="shipmentDate">Shipment date</Label>
            <Input
              id="shipmentDate"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="payment">Payment</Label>
            <Input
              id="payment"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="partialShipment">Partial shipment</Label>
            <Input
              id="partialShipment"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="piValidity">PI validity</Label>
            <Input
              id="piValidity"
              defaultValue=""
              className="h-7 text-xs bg-muted text-ink"
              readOnly
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="termsAndConditions">Terms and conditions</Label>
          <Textarea
            id="termsAndConditions"
            defaultValue=""
            className="h-32 text-xs bg-muted text-ink"
            readOnly
            placeholder="Enter one term per line"
          />
        </div>
      </section>

      <Separator />

      {/* Signatures - only seller signature editable */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className=" font-semibold text-ink text-sm mb-4">
          Signatures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
