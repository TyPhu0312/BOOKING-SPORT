"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, } from "lucide-react";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [isMenuOpen, setMenuOpen] = React.useState(false); // chỉ dùng cho mobile dropdown

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="w-full bg-white text-black shadow-md fixed top-0 left-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
                {/* Logo bên trái */}
                <Link href="/" passHref legacyBehavior>
                    <a>
                        <Image
                            src="/images/logos/1.jpeg"
                            alt="Logo"
                            width={100}
                            height={50}
                            className="h-auto w-auto"
                        />
                    </a>
                </Link>

                {/* Menu desktop ở giữa */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-6">
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref className="cursor-pointer">
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Trang Chủ
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref className="cursor-pointer">
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Tất cả sân
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/owner-fields/owner-manage" legacyBehavior passHref className="cursor-pointer">
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Trở thành chủ sân
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/about" legacyBehavior passHref className="cursor-pointer">
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Liên hệ
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Nút bên phải */}
                <div className="hidden md:flex items-center space-x-2 z-10">
                    <Link href={"/LoginForm"} className="cursor-pointer">
                        <Button className="bg-white text-gray-800 border border-gray-300 hover:bg-black hover:text-white transition">
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link href={"/RegisterForm"} className="cursor-pointer">
                        <Button className="bg-black text-white border border-transparent hover:bg-white hover:text-black hover:border-black transition">
                            Đăng ký
                        </Button>
                    </Link>
                    <Link href={"/admin"} className="cursor-pointer">
                        <Button className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition">
                            Admin
                        </Button>
                    </Link>
                </div>

                {/* Nút menu mobile */}
                <div className="md:hidden flex items-center z-10">
                    <button onClick={toggleMobileMenu} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
                    <Link href="/" passHref legacyBehavior className="cursor-pointer">
                        <a className="block text-gray-800 hover:text-black transition">
                            Trang Chủ
                        </a>
                    </Link>
                    <Link href="/" passHref legacyBehavior className="cursor-pointer">
                        <a className="block text-gray-800 hover:text-black transition">
                            Tất cả sân
                        </a>
                    </Link>
                    <Link href="/owner-fields/owner-manage" passHref legacyBehavior className="cursor-pointer">
                        <a className="block text-gray-800 hover:text-black transition">
                            Trở thành chủ sân
                        </a>
                    </Link>

                    {/* Dropdown mobile - Về chúng tôi */}
                    <div className="space-y-2">
                        <button
                            className="flex items-center justify-between w-full text-gray-800 hover:text-black transition"
                            onClick={() => setMenuOpen(!isMenuOpen)}
                        >
                            <span>Về chúng tôi</span>
                        </button>
                        {isMenuOpen && (
                            <div className="pl-4 space-y-2">
                                <Link href="/gioithieu" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Liên hệ
                                    </a>
                                </Link>
                                <Link href="/gioithieu" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Dịch vụ
                                    </a>
                                </Link>
                                <Link href="/gioithieu" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Giới thiệu
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Đăng nhập / Đăng ký mobile */}
                    <div className="flex flex-col space-y-2 pt-4">
                        <Link href={"/LoginForm"}>
                            <Button className="bg-white cursor-pointer text-gray-800 border border-gray-300 hover:bg-black hover:text-white transition">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link href={"/RegisterForm"}>
                            <Button className="bg-black cursor-pointer text-white border border-transparent hover:bg-white hover:text-black hover:border-black transition">
                                Đăng ký
                            </Button>
                        </Link>
                        <Link href={"/admin"}>
                            <Button className="bg-black cursor-pointer text-white hover:bg-white hover:text-black hover:border-black transition">
                                Admin
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
