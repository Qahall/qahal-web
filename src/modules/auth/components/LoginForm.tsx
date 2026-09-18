import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types/auth.types";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({
    message: "El email no es válido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (
    data: LoginFormData
  ) => {
    try {
      setError(null);
      await login(data as LoginCredentials);

      // Redirigir a la página original o a la página por defecto
      const from = (location.state as { from?: { pathname: string } })?.from
        ?.pathname;
      navigate(from || "/", { replace: true });

      toast.success("Inicio de sesión exitoso");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <InputField
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          disabled={isLoading}
        />

        <InputField
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Credenciales de prueba:</p>
          <p className="font-mono text-xs">admin@example.com / admin123</p>
        </div>
      </form>
    </FormProvider>
  );
}
