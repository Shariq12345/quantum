import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, X, BarChart2 } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "#" },
  { name: "Predictions", href: "#" },
  { name: "Analytics", href: "#" },
  { name: "Portfolio", href: "#" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
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
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center">
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5"
          >
            Start Free Trial
          </a>
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
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="mt-4 block rounded-lg px-3 py-2.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-600 text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
