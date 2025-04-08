"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User, Clock } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-white text-black shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo bên trái */}
        <Link href="/">
          <Image
            src="/images/logos/1.jpeg"
            alt="Logo"
            width={100}
            height={50}
            className="h-auto w-auto"
          />
        </Link>

        {/* Menu giữa (bỏ nếu không cần) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex space-x-6">
            <Link href="/" className="hover:text-black hover:font-bold transition">
              Trang Chủ
            </Link>
            <Link href="/all-fields" className="hover:text-black hover:font-bold transition">
              Tất cả sân
            </Link>
            <Link href="/owner-fields/owner-manage" className="hover:text-black hover:font-bold transition">
              Trở thành chủ sân
            </Link>
            <Link href="/about" className="hover:text-black hover:font-bold transition">
              Liên hệ
            </Link>
          </nav>
        </div>

        {/* Tài khoản bên phải */}
        {isLoggedIn && user ? (
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar>
                    <AvatarImage src="/images/avatar.jpg" alt="Avatar"/>
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="flex items-center gap-2">
                    <User size={16} /> Trang cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/bookings" className="flex items-center gap-2">
                    <Clock size={16} /> Lịch sử đặt sân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/LoginForm">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link href="/RegisterForm">
              <Button>Đăng ký</Button>
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center z-10">
          <button onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
          <Link href="/" className="block text-gray-800 hover:text-black transition">
            Trang Chủ
          </Link>
          <Link href="/all-fields" className="block text-gray-800 hover:text-black transition">
            Tất cả sân
          </Link>
          <Link href="/owner-fields/owner-manage" className="block text-gray-800 hover:text-black transition">
            Trở thành chủ sân
          </Link>
          <Link href="/about" className="block text-gray-800 hover:text-black transition">
            Liên hệ
          </Link>

          {/* Mobile Auth */}
          {isLoggedIn && user ? (
            <>
              <div className="pt-4 border-t">
                <p className="text-sm mb-2 font-semibold">{user.username}</p>
                <Button variant="ghost" className="w-full text-left" onClick={logout}>
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Link href="/LoginForm">
                <Button variant="outline" className="w-full">Đăng nhập</Button>
              </Link>
              <Link href="/RegisterForm">
                <Button className="w-full">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
