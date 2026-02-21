// components/ui/Checkbox.tsx
import React, {useId} from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

/* ================= TYPES ================= */

type CheckboxSize = "sm" | "default" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: CheckboxSize;
}

export interface CheckboxGroupProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/* ================= CHECKBOX ================= */

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      id,
      checked,
      indeterminate = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      size = "default",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const sizeClasses: Record<CheckboxSize, string> = {
      sm: "h-4 w-4",
      default: "h-4 w-4",
      lg: "h-5 w-5"
    };

    return (
      <div className={cn("flex items-start space-x-2", className)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />

          <label
            htmlFor={checkboxId}
            className={cn(
              "peer shrink-0 rounded-sm border border-primary ring-offset-background transition-colors cursor-pointer",
              sizeClasses[size],
              checked &&
                "bg-primary text-primary-foreground border-primary",
              indeterminate &&
                "bg-primary text-primary-foreground border-primary",
              error && "border-destructive",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {checked && !indeterminate && (
              <Check className="h-3 w-3 text-current flex items-center justify-center" />
            )}

            {indeterminate && (
              <Minus className="h-3 w-3 text-current flex items-center justify-center" />
            )}
          </label>
        </div>

        {(label || description || error) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  error ? "text-destructive" : "text-foreground"
                )}
              >
                {label}
                {required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}

            {description && !error && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

/* ================= CHECKBOX GROUP ================= */

const CheckboxGroup = React.forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      className,
      children,
      label,
      description,
      error,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        className={cn("space-y-3", className)}
        {...props}
      >
        {label && (
          <legend
            className={cn(
              "text-sm font-medium",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </legend>
        )}

        {description && !error && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="space-y-2">{children}</div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };