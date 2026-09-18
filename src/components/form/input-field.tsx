import * as React from "react"

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type InputProps = React.ComponentProps<typeof Input>

type InputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName
  label?: React.ReactNode
  description?: React.ReactNode
  control?: Control<TFieldValues>
} & Omit<InputProps, "name" | "value" | "defaultValue" | "onChange" | "onBlur">

export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  id,
  ...inputProps
}: InputFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>()
  const resolvedControl = control ?? formContext?.control

  if (!resolvedControl) {
    throw new Error(
      "InputField debe usarse dentro de un FormProvider o recibir la prop `control`."
    )
  }

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => {
        const inputId = id ?? field.name
        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}

            <FieldContent>
              <Input
                id={inputId}
                aria-invalid={fieldState.invalid || undefined}
                {...inputProps}
                {...field}
              />

              {description ? <FieldDescription>{description}</FieldDescription> : null}

              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </FieldContent>
          </Field>
        )
      }}
    />
  )
}

