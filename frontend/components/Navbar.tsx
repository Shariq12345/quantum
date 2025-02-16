"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BarChart2,
  ChevronDown,
  LineChart,
  BarChart,
  GlobeIcon,
  Bitcoin,
  ChartCandlestick,
  GraduationCapIcon,
} from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { DepositFundsDialog } from "./deposit-funds";
import { Button } from "./ui/button";
import Link from "next/link";

const marketItems = [
  { name: "Crypto", href: "/markets/crypto", icon: Bitcoin },
  { name: "Stock", href: "/markets/stocks", icon: ChartCandlestick },
];

const navigation = [
  { name: "Prediction", href: "/predict", icon: LineChart },
  { name: "Markets", items: marketItems, icon: BarChart },
  { name: "News", href: "/news", icon: GlobeIcon },
  { name: "Learn", href: "/learn", icon: GraduationCapIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" : "bg-slate-900"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.svg" height={30} width={30} alt="Logo" />
            <span className="text-lg font-bold text-white">Quantum</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href || "#"}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive(item.href || "#")
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                {item.name}
                {item.items && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>
              {item.items && activeDropdown === item.name && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-2 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(subItem.href)
                            ? "bg-slate-700 text-white"
                            : "text-gray-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {subItem.icon && <subItem.icon className="w-4 h-4" />}
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center">
          <SignedIn>
            <DepositFundsDialog />
            <Link href={"/portfolio"}>
              <Button className="bg-white text-black hover:bg-gray-200">
                Portfolio
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-gray-300 hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignInButton>
              <button className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-lg transition-all">
                Free Trial
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
