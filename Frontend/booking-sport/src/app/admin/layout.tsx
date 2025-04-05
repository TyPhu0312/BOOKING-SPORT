"use client"; // Ensure client-side rendering for this component

import AdminHeader from "@/components/features/admin-header";
import AdminSidebar from "@/components/features/admin-sidebar";
import { ReactNode } from "react";

export interface PageProps {
  children: ReactNode; // Ensure children is passed down correctly to be rendered in the layout
}

export default function AdminLayout({ children }: PageProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar for larger screens */}
      <div className="hidden border-r bg-muted/40 md:block">
        <AdminSidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header */}
        <AdminHeader />
        {/* Page-specific Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children} {/* Render child components or page-specific content here */}
        </main>
      </div>
    </div>
  );
}
