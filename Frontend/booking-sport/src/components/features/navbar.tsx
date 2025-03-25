"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X,  } from "lucide-react";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
    NavigationMenuContent,
    NavigationMenuTrigger,
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
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Trang Chủ
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/dat-san" legacyBehavior passHref>
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Tất cả sân
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/lien-he" legacyBehavior passHref>
                                    <NavigationMenuLink className="hover:text-black transition hover:font-bold">
                                        Trở thành chủ sân
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            {/* Hover Dropdown Menu - Về chúng tôi */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="flex items-center gap-1 font-normal hover:text-black transition hover:font-bold cursor-pointer leading-none">
                                    Về chúng tôi
                             {/*        <ChevronDown className="w-4 h-4" /> */}
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="bg-white shadow-md rounded-md p-2 mt-2">
                                    <ul className="flex flex-col space-y-2 w-48">
                                        <li>
                                            <Link href="/dich-vu/sua-san" legacyBehavior passHref>
                                                <a className="block text-gray-800 hover:text-black transition">
                                                    Liên hệ
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dich-vu/bao-tri" legacyBehavior passHref>
                                                <a className="block text-gray-800 hover:text-black transition">
                                                    Dịch vụ
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dich-vu/thue-doi" legacyBehavior passHref>
                                                <a className="block text-gray-800 hover:text-black transition">
                                                    Giới thiệu
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Nút bên phải */}
                <div className="hidden md:flex items-center space-x-2 z-10">
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-800 hover:bg-black hover:text-white transition"
                    >
                        Đăng nhập
                    </Button>
                    <Button className="bg-black text-white border border-transparent hover:bg-white hover:text-black hover:border-black transition">
                        Đăng ký
                    </Button>
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
                    <Link href="/" passHref legacyBehavior>
                        <a className="block text-gray-800 hover:text-black transition">
                            Trang Chủ
                        </a>
                    </Link>
                    <Link href="/dat-san" passHref legacyBehavior>
                        <a className="block text-gray-800 hover:text-black transition">
                            Tất cả sân
                        </a>
                    </Link>
                    <Link href="/lien-he" passHref legacyBehavior>
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
                            {/* <ChevronDown
                                className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""
                                    }`}
                            /> */}
                        </button>
                        {isMenuOpen && (
                            <div className="pl-4 space-y-2">
                                <Link href="/dich-vu/sua-san" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Liên hệ
                                    </a>
                                </Link>
                                <Link href="/dich-vu/bao-tri" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Dịch vụ
                                    </a>
                                </Link>
                                <Link href="/dich-vu/thue-doi" passHref legacyBehavior>
                                    <a className="block text-gray-600 hover:text-black">
                                        Giới thiệu
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Đăng nhập / Đăng ký mobile */}
                    <div className="flex flex-col space-y-2 pt-4">
                        <Button
                            variant="outline"
                            className="border-gray-300 text-gray-800 hover:bg-black hover:text-white transition"
                        >
                            Đăng nhập
                        </Button>
                        <Button className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition">
                            Đăng ký
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
