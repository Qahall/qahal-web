import * as React from "react";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { type VariantProps } from "class-variance-authority";
import { toggleVariants } from "@/components/ui/toggle";

type ToggleGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;

  /** Opciones a renderizar */
  options: Array<{
    label: React.ReactNode;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;

  /** Props nativos del ToggleGroup */
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
  spacing?: number;
  disabled?: boolean;
};

export function ToggleGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  options,
  variant = "default",
  size = "default",
  spacing = 0,
  disabled = false,
}: ToggleGroupFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "ToggleGroupField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          {label ? <FieldLabel>{label}</FieldLabel> : null}

          <FieldContent>
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={(val) => field.onChange(val || "")}
              variant={variant}
              size={size}
              spacing={spacing}
              disabled={disabled}
            >
              {options.map((opt) => (
                <ToggleGroupItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    {opt.icon && <span>{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {description ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}

            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </FieldContent>
        </Field>
      )}
    />
  );
}
