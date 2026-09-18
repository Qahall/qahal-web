import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { moduleRoutes } from "@/config/modules";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar on navigation
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {moduleRoutes.map((route) => {
                const Icon = route.icon;
                const isActive =
                  location.pathname === route.path ||
                  location.pathname.startsWith(`${route.path}/`);

                return (
                  <SidebarMenuItem key={route.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={route.label}
                    >
                      <NavLink
                        to={route.path}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <Icon />
                        <span>{route.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!isMobile && <SidebarRail />}
    </Sidebar>
  );
}
