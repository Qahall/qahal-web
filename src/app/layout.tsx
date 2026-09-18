import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { findModuleByPath } from "@/config/modules";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import type { ReactNode } from "react";

import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type CSSVars = React.CSSProperties & {
  "--sidebar-width"?: string;
  "--sidebar-width-mobile"?: string;
};

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentModule = findModuleByPath(location.pathname);
  const breadcrumbItems = currentModule?.breadcrumb ?? [
    { label: "Inicio", to: "/" },
  ];
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const sidebarStyles: CSSVars = {
    "--sidebar-width": "20rem",
    "--sidebar-width-mobile": "20rem",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex w-full items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;

                  return (
                    <Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : item.to ? (
                          <BreadcrumbLink asChild>
                            <Link to={item.to}>{item.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink>{item.label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast ? <BreadcrumbSeparator /> : null}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Hola, {user.name}!</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              <span className="hidden md:inline">
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Cerrar sesión</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 px-4 pb-4 pt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
