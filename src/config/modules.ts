import type { LucideIcon } from "lucide-react";
import { BoltIcon, CoinsIcon, UserRound, UsersIcon } from "lucide-react";

export type ModuleBreadcrumb = {
  label: string;
  to?: string;
};

export type ModuleConfig = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  breadcrumb: ModuleBreadcrumb[];
};

export const moduleRoutes: ModuleConfig[] = [
  {
    id: "members",
    label: "Miembros",
    path: "/members",
    icon: UserRound,
    description: "Gestión de miembros",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Miembros" }],
  },
  {
    id: "birthdays",
    label: "Cumpleañeros",
    path: "/birthdays",
    icon: UsersIcon,
    description: "Reporte de cumpleaños",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Cumpleañeros" }],
  },
  {
    id: "families",
    label: "Familias",
    path: "/families",
    icon: UsersIcon,
    description: "Gestión de familias",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Familias" }],
  },
  {
    id: "diezmos",
    label: "Diezmos",
    path: "/diezmos",
    icon: CoinsIcon,
    description: "Gestión de diezmos",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Diezmos" }],
  },
  {
    id: "diezmos-report",
    label: "Reporte de diezmos",
    path: "/diezmos-report",
    icon: CoinsIcon,
    description: "Reporte de diezmos",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Reporte de diezmos" }],
  },
  {
    id: "bautizos",
    label: "Bautizos",
    path: "/bautizos",
    icon: BoltIcon,
    description: "Gestión de bautizos",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Bautizos" }],
  },
  {
    id: "configuration",
    label: "Configuración",
    path: "/configuration",
    icon: BoltIcon,
    description: "Configuración del sistema",
    breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Configuración" }],
  },
];

export const defaultModulePath = moduleRoutes[0]?.path ?? "/";

export function findModuleByPath(pathname: string) {
  return moduleRoutes.find((route) => {
    if (route.path === "/") {
      return pathname === "/";
    }
    return pathname === route.path || pathname.startsWith(`${route.path}/`);
  });
}
