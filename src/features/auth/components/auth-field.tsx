import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import type { InputHTMLAttributes } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function AuthField({ id, label, error, ...inputProps }: AuthFieldProps) {
  const inputClassName =
    "h-11 rounded-xl border-border/80 bg-background px-3.5 shadow-sm transition-shadow focus-visible:shadow-md";

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {inputProps.type === "password" ? (
        <PasswordInput
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClassName}
          containerClassName="h-11 rounded-xl bg-background shadow-sm transition-shadow focus-within:shadow-md"
          {...inputProps}
        />
      ) : (
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClassName}
          {...inputProps}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
