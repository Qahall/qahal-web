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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button, buttonVariants } from "@/components/ui/button";

import { Loader2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onValueChange?: (value: string) => void;
    onSearchChange?: (value: string) => void;
} & Omit<
  React.ComponentProps<typeof Button>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "disabled"
>;

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
  options,
  placeholder = "Seleccione",
  disabled,
  isLoading = false,
  id,
  onValueChange,
  onSearchChange,
  className,
  variant = "outline",
  size,
  ...props
}: SelectFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;
  const [open, setOpen] = React.useState(false);

  if (!resolvedControl) {
    throw new Error(
      "SelectField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field, fieldState }) => {
        const inputId = id ?? field.name;
        const selectedValue = field.value;
        const selectedOption = options.find((o) => o.value === selectedValue);

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}

            <FieldContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  {/*
                    Using a native 'button' element instead of the 'Button' component 
                    because PopoverTrigger's 'asChild' requires a child that can accept a ref.
                    The current 'Button' component (in components/ui/button.tsx) is a 
                    functional component that does NOT use forwardRef, so it breaks the Popover.
                  */}
                  <button
                    type="button"
                    id={inputId}
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={fieldState.invalid || undefined}
                    disabled={disabled || isLoading}
                    className={cn(
                      buttonVariants({ variant, size }),
                      "w-full justify-between font-normal px-3",
                      !field.value && "text-muted-foreground",
                      fieldState.invalid &&
                        "border-destructive ring-destructive/20",
                      className
                    )}
                    {...props}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 opacity-60">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Cargando…</span>
                      </div>
                    ) : (
                      <>
                        <span className="truncate">
                          {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Buscar..."
                      onValueChange={onSearchChange}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="Ninguno"
                          onSelect={() => {
                            field.onChange(undefined);
                            if (onValueChange) {
                              onValueChange("__none__");
                            }
                            setOpen(false);
                          }}
                          className="italic text-muted-foreground"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Ninguno
                        </CommandItem>
                        <CommandSeparator />
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            disabled={option.disabled}
                            onSelect={() => {
                              field.onChange(option.value);
                              if (onValueChange) {
                                onValueChange(option.value);
                              }
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
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
