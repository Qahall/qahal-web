"use client";

import { useRef, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
  useFormContext,
} from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Camera, X } from "lucide-react";

export interface AvatarUploadFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
}

export function AvatarUploadField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  control,
}: AvatarUploadFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;

  if (!resolvedControl) {
    throw new Error(
      "AvatarUploadField debe usarse dentro de un FormProvider o recibir la prop `control`."
    );
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const isFile = (v: any): v is File =>
    v && typeof v === "object" && "name" in v && "size" in v && "type" in v;

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return "Formato inválido. Solo JPEG, PNG o WebP.";
    }
    if (file.size > maxSize) {
      return "La imagen no debe superar los 5MB.";
    }
    return null;
  };

  return (
    <Controller
      name={name}
      control={resolvedControl}
      render={({ field: { value, onChange }, fieldState }) => {
        let previewUrl: string | null = null;

        if (isFile(value)) {
          previewUrl = URL.createObjectURL(value);
        } else if (typeof value === "string") {
          previewUrl = value; // URL del backend
        }

        const handleSelectFile = (file: File) => {
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            return;
          }
          setError(null);
          onChange(file);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) handleSelectFile(file);
        };

        const handleRemove = () => {
          onChange(null);
          setError(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            {label ? <FieldLabel>{label}</FieldLabel> : null}

            <FieldContent>
              {/* Vista previa vertical fija */}
              <Card className="border relative w-40 h-50 overflow-hidden rounded-xl mb-3 p-2">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview carnet"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Sin imagen
                  </div>
                )}
              </Card>

              {/* Input de archivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleInputChange}
              />

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {value ? "Reemplazar" : "Subir foto"}
                </Button>

                {value && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Borrar
                  </Button>
                )}
              </div>

              {/* Descripción */}
              {description ? (
                <FieldDescription>{description}</FieldDescription>
              ) : null}

              {/* Error de RHF */}
              {fieldState.error && <FieldError errors={[fieldState.error]} />}

              {/* Error de validación del archivo */}
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
