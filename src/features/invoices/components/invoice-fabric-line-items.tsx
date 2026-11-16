import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { Fragment, useEffect } from "react";
import {
  useFieldArray,
  UseFieldArrayAppend,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { InvoiceFormValues } from "../schemas/invoice.schema";
import { ColorSuggestInput } from "./color-suggest-input";

interface Props {
  index: number;
  onReady?: (handlers: {
    append: UseFieldArrayAppend<
      InvoiceFormValues,
      `lineItems.${number}.fabricLineItems`
    >;
    canAdd: boolean;
  }) => void;
}

const InvoiceFabricLineItems = ({ index, onReady }: Props) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    getValues,
  } = useFormContext<InvoiceFormValues>();

  const fabricLineItems = useWatch({
    control,
    name: `lineItems.${index}.fabricLineItems`,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `lineItems.${index}.fabricLineItems` as const,
  });

  const canAdd =
    fields.length === 0 ||
    fields.every((_, idx) => {
      const item = fabricLineItems?.[idx];

      return (
        item?.style?.trim() &&
        item?.color?.trim() &&
        Number(item?.quantity) > 0 &&
        Number(item?.unitPrice) >= 0
      );
    });

  useEffect(() => {
    onReady?.({ append, canAdd });
  }, [append, canAdd, onReady]);

  return (
    <>
      {fields.map((field, i) => {
        const basePath = `lineItems.${index}.fabricLineItems.${i}` as const;
        const errorBase = errors.lineItems?.[index]?.fabricLineItems?.[i];

        return (
          <Fragment key={field.id}>
            {/* Style */}
            <Field
              className="col-span-1 sm:col-span-4 lg:col-span-12 xl:col-span-6 2xl:col-span-4"
              data-invalid={Boolean(errorBase?.style)}
            >
              <FieldLabel htmlFor={`${basePath}.style`}>Style</FieldLabel>
              <Input
                id={`${basePath}.style`}
                aria-invalid={Boolean(errorBase?.style)}
                {...register(`${basePath}.style`)}
                placeholder="Style"
              />
              {errorBase?.style?.message && (
                <p className="text-xs text-destructive">
                  {errorBase.style.message}
                </p>
              )}
            </Field>

            {/* Color */}
            <Field
              className="col-span-1 sm:col-span-3 lg:col-span-5 xl:col-span-6 2xl:col-span-3"
              data-invalid={Boolean(errorBase?.color)}
            >
              <FieldLabel htmlFor={`${basePath}.color`}>Color</FieldLabel>
              <ColorSuggestInput
                id={`${basePath}.color`}
                value={fabricLineItems?.[i]?.color ?? ""}
                invalid={Boolean(errorBase?.color)}
                onCommit={(color) =>
                  setValue(`${basePath}.color`, color, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                onDraft={() =>
                  setValue(`${basePath}.color`, "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {errorBase?.color?.message && (
                <p className="text-xs text-destructive">
                  {errorBase.color.message}
                </p>
              )}
            </Field>

            {/* Quantity */}
            <Field
              className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-6 2xl:col-span-2"
              data-invalid={Boolean(errorBase?.quantity)}
            >
              <FieldLabel htmlFor={`${basePath}.quantity`}>Quantity</FieldLabel>
              <Input
                id={`${basePath}.quantity`}
                type="number"
                min={1}
                aria-invalid={Boolean(errorBase?.quantity)}
                {...register(`${basePath}.quantity`, {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const quantity = e.target.valueAsNumber;
                    const total = parseFloat(
                      (getValues(`${basePath}.unitPrice`) * quantity).toFixed(
                        2,
                      ),
                    );

                    setValue(`${basePath}.quantity`, quantity, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setValue(`${basePath}.totalAmount`, total);
                    setValue(
                      "totalQuantity",
                      getValues("totalQuantity") + quantity,
                    );
                  },
                })}
                placeholder="1"
              />
              {errorBase?.quantity?.message && (
                <p className="text-xs text-destructive">
                  {errorBase.quantity.message}
                </p>
              )}
            </Field>

            {/* Unit Price */}
            <Field
              className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-5 2xl:col-span-2"
              data-invalid={Boolean(errorBase?.unitPrice)}
            >
              <FieldLabel htmlFor={`${basePath}.unitPrice`}>Price</FieldLabel>
              <Input
                id={`${basePath}.unitPrice`}
                type="number"
                step="0.01"
                min={0}
                aria-invalid={Boolean(errorBase?.unitPrice)}
                {...register(`${basePath}.unitPrice`, {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const price = e.target.valueAsNumber;
                    const total = parseFloat(
                      (getValues(`${basePath}.quantity`) * price).toFixed(2),
                    );

                    setValue(`${basePath}.unitPrice`, price, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setValue(
                      "totalUnitPrice",
                      parseFloat(
                        (getValues("totalUnitPrice") + price).toFixed(2),
                      ),
                    );
                    setValue(`${basePath}.totalAmount`, total);
                    setValue(
                      "totalAmount",
                      parseFloat((getValues("totalAmount") + total).toFixed(2)),
                    );
                  },
                })}
                placeholder="0.00"
              />
              {errorBase?.unitPrice?.message && (
                <p className="text-xs text-destructive">
                  {errorBase.unitPrice.message}
                </p>
              )}
            </Field>

            <div className="col-span-1 flex items-end justify-end h-full">
              <Button
                type="button"
                variant={"ghost"}
                size={"icon-sm"}
                onClick={() => remove(i)}
                className="text-sm text-destructive"
              >
                <TrashIcon />
              </Button>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default InvoiceFabricLineItems;
