"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  LineChart,
  BarChart,
  GlobeIcon,
  Bitcoin,
  ChartCandlestick,
  GraduationCapIcon,
  ImageIcon,
  History,
} from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { MyFundsDialog } from "./my-funds";
import { Button } from "./ui/button";
import Link from "next/link";

const marketItems = [
  { name: "Crypto", href: "/markets/crypto", icon: Bitcoin },
  { name: "Stock", href: "/markets/stocks", icon: ChartCandlestick },
  { name: "NFT's", href: "/markets/nfts", icon: ImageIcon },
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
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute top-0 left-0 w-64 h-full bg-slate-900 shadow-lg p-6">
              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              {/* Navigation Items */}
              <nav className="mt-8 space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.items ? (
                      // Dropdown for nested items
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-white text-lg">
                          <span className="flex items-center gap-2">
                            {item.icon && <item.icon className="w-5 h-5" />}
                            <span className="text-base">{item.name}</span>
                          </span>
                          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="mt-2 space-y-2 pl-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-gray-300 hover:text-white"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-white text-lg hover:text-emerald-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon && (
                          <item.icon className="w-5 h-5 mr-2 inline" />
                        )}
                        <span className="text-base">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="mt-6">
                <SignedIn>
                  <MyFundsDialog />
                  <Link href={"/portfolio"}>
                    <Button className="w-full mt-2 bg-white text-black hover:bg-gray-200">
                      Portfolio
                    </Button>
                  </Link>
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="block w-full text-white text-lg my-2">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignInButton>
                    <button className="block w-full text-lg px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-lg transition-all">
                      Free Trial
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        )}

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={() => setTimeout(() => handleMouseLeave(), 1000)} // Small delay
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

              {/* Dropdown menu */}
              {item.items && activeDropdown === item.name && (
                <div
                  className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5"
                  onMouseEnter={() => handleMouseEnter(item.name)} // Keep open when hovering dropdown
                  onMouseLeave={handleMouseLeave} // Close when leaving dropdown
                >
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
            <div className="flex items-center gap-x-4">
              <MyFundsDialog />
              <Link href={"/portfolio"}>
                <Button className="bg-white text-black hover:bg-gray-200">
                  Portfolio
                </Button>
              </Link>
              {/* Bell Icon for Transactions */}
              <Link
                href={"/transactions"}
                className="relative p-2 rounded-full hover:bg-gray-800"
              >
                <History className="w-5 h-5 text-gray-300 hover:text-white" />
                {/* Optional: Notification Badge */}
                {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
              </Link>
              <UserButton />
            </div>
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
