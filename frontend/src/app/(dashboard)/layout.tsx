import { AppSidebar } from "@/app/(dashboard)/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "./navbar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
