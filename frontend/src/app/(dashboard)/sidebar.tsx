import { Home, CreditCard, Folder, IndianRupee } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LogoutComp } from "./logout";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Usage",
    url: "/usage",
    icon: CreditCard,
  },
  {
    title: "Uplaods",
    url: "/uploads",
    icon: Folder,
  },
  {
    title: "Purchase",
    url: "/pricing",
    icon: IndianRupee,
  },
];
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="w-full text-center font-bold text-lg">Dashboard</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          
          <SidebarGroupContent>
            {/* <SidebarHeader>Dashboard</SidebarHeader> */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutComp />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
