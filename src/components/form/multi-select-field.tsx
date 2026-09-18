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
import {
  MultiSelect,
  type MultiSelectProps,
} from "@/components/ui/multi-select";

type MultiSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
} & Omit<MultiSelectProps, "defaultValue" | "onValueChange">;

export function MultiSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  id,
  ...multiSelectProps
}: MultiSelectFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "MultiSelectField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => {
        const inputId = id ?? field.name;

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}

            <FieldContent>
              <MultiSelect
                id={inputId}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                {...multiSelectProps}
              />

              {description ? (
                <FieldDescription>{description}</FieldDescription>
              ) : null}

              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
