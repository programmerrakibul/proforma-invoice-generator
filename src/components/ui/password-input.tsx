"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "cn";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  containerClassName?: string;
};

function PasswordInput({
  className,
  containerClassName,
  ...props
}: PasswordInputProps): React.JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <InputGroup className={cn("h-7", containerClassName)}>
      <InputGroupInput
        {...props}
        className={cn("pr-1.5", className)}
        type={isPasswordVisible ? "text" : "password"}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          aria-pressed={isPasswordVisible}
          onClick={() => setIsPasswordVisible((visible) => !visible)}
          size="icon-xs"
          type="button"
        >
          {isPasswordVisible ? (
            <EyeOff aria-hidden="true" />
          ) : (
            <Eye aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export { PasswordInput };
