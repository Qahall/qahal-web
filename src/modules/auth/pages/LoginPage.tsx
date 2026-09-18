import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { SimpleCard } from "@/components/simple-card";
import { useAuthContext } from "../context/AuthContext";

export function LoginPage() {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SimpleCard
          title="Iniciar sesión"
          description="Ingresa tus credenciales para acceder al sistema"
          contentClassName="w-full"
        >
          <LoginForm />
        </SimpleCard>
      </div>
    </div>
  );
}
