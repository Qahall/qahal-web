import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

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

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
  disabledDays?: React.ComponentProps<typeof Calendar>["disabled"];
  popoverClassName?: string;
};

export function DatePickerField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  placeholder = "Seleccionar fecha",
  disabled,
  disabledDays,
  popoverClassName,
}: DatePickerFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "DatePickerField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={resolvedControl}
      name={name}
      render={({ field, fieldState }) => {
        const id = field.name;

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

            <FieldContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                  <button
                    type="button"
                    id={id}
                    aria-invalid={fieldState.invalid || undefined}
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between font-normal inline-flex items-center",
                      "rounded-md border bg-background px-3 py-2 text-sm",
                      "ring-offset-background placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : placeholder}

                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className={cn("w-auto p-0", popoverClassName)}
                  align="start"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ?? undefined);
                      setOpen(false);
                    }}
                    disabled={disabled || disabledDays}
                  />
                </PopoverContent>
              </Popover>

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
