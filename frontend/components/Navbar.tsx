"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  LineChart,
  BarChart,
  GlobeIcon,
  Bitcoin,
  CandlestickChartIcon as ChartCandlestick,
  GraduationCapIcon,
  ImageIcon,
  History,
  LineChartIcon,
  LayoutIcon,
  X,
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
  {
    name: "Simulator",
    href: "/simulator",
    icon: LineChartIcon,
  },
  { name: "Map", href: "/maps", icon: LayoutIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileItem = (name: string) => {
    setExpandedMobileItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
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
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden">
            <div
              ref={mobileMenuRef}
              className="absolute top-0 left-0 w-80 h-full bg-slate-900 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Image src="/logo.svg" height={24} width={24} alt="Logo" />
                  <span className="text-lg font-bold text-white">Quantum</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-6 space-y-4">
                {navigation.map((item) => (
                  <div key={item.name} className="py-1">
                    {item.items ? (
                      <div>
                        <button
                          onClick={() => toggleMobileItem(item.name)}
                          className="flex items-center justify-between w-full text-left py-2 text-gray-200 hover:text-white"
                        >
                          <span className="flex items-center gap-3">
                            {item.icon && <item.icon className="w-5 h-5" />}
                            <span className="font-medium">{item.name}</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedMobileItems.includes(item.name)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {expandedMobileItems.includes(item.name) && (
                          <div className="mt-2 ml-8 space-y-2 border-l-2 border-slate-700 pl-4">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center gap-3 py-2 text-sm ${
                                  isActive(subItem.href)
                                    ? "text-emerald-400"
                                    : "text-gray-300 hover:text-white"
                                }`}
                              >
                                {subItem.icon && (
                                  <subItem.icon className="w-4 h-4" />
                                )}
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 py-2 ${
                          isActive(item.href)
                            ? "text-emerald-400"
                            : "text-gray-200 hover:text-white"
                        }`}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}

                {/* Transactions link in mobile menu */}
                <Link
                  href="/transactions"
                  className={`flex items-center gap-3 py-2 ${
                    isActive("/transactions")
                      ? "text-emerald-400"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span className="font-medium">Transactions</span>
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 bg-slate-900">
                <SignedIn>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Account</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MyFundsDialog />
                    <Link href="/portfolio">
                      <Button className="w-full bg-white text-black hover:bg-gray-200">
                        Portfolio
                      </Button>
                    </Link>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="grid grid-cols-2 gap-3">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Sign in
                      </Button>
                    </SignInButton>
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0">
                        Free Trial
                      </Button>
                    </SignInButton>
                  </div>
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
                {item.icon && <item.icon className="w-5 h-5 mr-1" />}
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
                <div className="absolute left-0 mt-2 w-48 rounded-xl overflow-hidden bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
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
              <Link href="/portfolio">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Portfolio
                </Button>
              </Link>
              {/* Transactions link */}
              <Link
                href="/transactions"
                className={`relative p-2 rounded-full hover:bg-gray-800 ${
                  isActive("/transactions") ? "text-white" : "text-gray-300"
                }`}
                aria-label="Transactions"
              >
                <History className="w-5 h-5" />
                {/* Optional: Notification Badge */}
                {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-x-4">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignInButton>
                <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0">
                  Free Trial
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
