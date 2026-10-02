import { AppShell } from "@/components/layout/app-shell";

export default function MaterialsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
