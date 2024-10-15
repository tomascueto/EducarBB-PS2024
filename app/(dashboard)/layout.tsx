import { DashboardLayoutComponent } from "@/components/dashboard-layout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}