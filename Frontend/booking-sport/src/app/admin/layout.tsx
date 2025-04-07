"use client"; // Ensure client-side rendering for this component

import AdminHeader from "@/components/features/admin-header";
import AdminSidebar from "@/components/features/admin-sidebar";
import { ReactNode } from "react";

export interface PageProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: PageProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <AdminSidebar />
      </div>
      <div className="flex flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
