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

type MonthPickerFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
  popoverClassName?: string;
};

export function MonthPickerField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  placeholder = "Seleccionar meses",
  disabled,
  popoverClassName,
}: MonthPickerFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "MonthPickerField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={resolvedControl}
      name={name}
      render={({ field, fieldState }) => {
        const id = field.name;
        const value: Date[] = field.value ?? [];

        const normalizedSelected = value.map(
          (d) => new Date(d.getFullYear(), d.getMonth(), 1)
        );

        const handleSelect = (dates?: Date[]) => {
          if (!dates) {
            field.onChange([]);
            return;
          }

          const uniqueByMonth = Array.from(
            new Map(
              dates.map((d) => {
                const normalized = new Date(
                  d.getFullYear(),
                  d.getMonth(),
                  1
                );
                return [`${normalized.getFullYear()}-${normalized.getMonth()}`, normalized];
              })
            ).values()
          );

          field.onChange([...uniqueByMonth]);
        };

        const displayValue =
          value.length > 0
            ? value
                .sort(
                  (a, b) =>
                    a.getFullYear() - b.getFullYear() ||
                    a.getMonth() - b.getMonth()
                )
                .map((d) =>
                  d.toLocaleDateString("es-PE", {
                    month: "short",
                    year: "numeric",
                  })
                )
                .join(", ")
            : placeholder;

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
                    <span className="truncate">{displayValue}</span>
                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className={cn("w-auto p-0", popoverClassName)}
                  align="start"
                >
                  <Calendar
                    mode="multiple"
                    captionLayout="dropdown"
                    selected={normalizedSelected}
                    onSelect={handleSelect}
                    disabled={disabled}
                    fixedWeeks
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
