"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Menu,
  X,
  BarChart2,
  ChevronDown,
  LineChart,
  BarChart,
  NewspaperIcon,
} from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AddFundsDialog } from "./add-funds";

const marketItems = [
  { name: "Crypto", href: "/markets/crypto" },
  { name: "Stock", href: "/markets/stocks" },
  // { name: "Forex", href: "/markets/forex" },
  // { name: "Commodities", href: "/markets/commodities" },
];

const navigation = [
  {
    name: "Predictions",
    href: "/predict",
    icon: LineChart,
  },
  {
    name: "Markets",
    items: marketItems,
    icon: BarChart,
  },
  {
    name: "News",
    href: "/news",
    icon: NewspaperIcon,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveDropdown(null), 200); // Add a small delay
    setHoverTimeout(timeout);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" : "bg-slate-900"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex lg:flex-1">
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center">
              <Image
                src="/logo.svg"
                className=""
                height={30}
                width={30}
                alt="Logo"
              />
            </div>
            <span className="text-lg font-bold text-white">Quantum</span>
          </a>
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
              <a
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {item.icon && <item.icon className="size-5 mr-2" />}

                {item.name}
                {item.items && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </a>
              {item.items && activeDropdown === item.name && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-2 space-y-1">
                    {item.items.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center">
          <SignedIn>
            <AddFundsDialog />
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignInButton>
              <button className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5">
                Start Free Trial
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Quantum</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="space-y-1 py-6">
              {navigation.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                  {item.items && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <SignedIn>
                  <AddFundsDialog />
                  <UserButton />
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignInButton>
                    <button className="mt-4 block rounded-lg px-3 py-2.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-600 text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                      Start Free Trial
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
