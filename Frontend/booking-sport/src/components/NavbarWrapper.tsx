"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/features/navbar";

const hiddenRoutes = ["/LoginForm", "/RegisterForm", "/ForgotPasswordForm"];

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  console.log("Current Path:", pathname);
  const shouldHideNavbar = hiddenRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
      {!shouldHideNavbar && (
        <footer className="bg-green-600 text-white text-center py-4 mt-10">
          © {new Date().getFullYear()} Đặt Sân Bóng. All rights reserved.
        </footer>
      )}
    </>
  );
}
