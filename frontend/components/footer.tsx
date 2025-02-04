"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Mail, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// import emailjs from "@emailjs/browser";
// import { toast } from "sonner";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
  }, []);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  //   const handleSubscribe = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!email) {
  //       toast.error("Please enter your email address.");
  //       return;
  //     }

  //     if (!isValidEmail(email)) {
  //       toast.error("Please enter a valid email address.");
  //       return;
  //     }

  //     setIsLoading(true);

  //     try {
  //       const templateParams = {
  //         to_email: email,
  //       };

  //       await emailjs.send(
  //         process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
  //         process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
  //         templateParams,
  //         process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  //       );

  //       toast.success("Thank you for subscribing to our newsletter!");

  //       setEmail("");
  //     } catch (error) {
  //       toast.error("An error occurred. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <footer className="bg-background border-t">
        {/* Newsletter Section */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-muted-foreground text-sm">
                  Subscribe to our newsletter for the latest insights and
                  updates.
                </p>
              </div>
              <form onSubmit={() => {}} className="flex w-full max-w-md gap-2">
                <div className="flex w-full max-w-md gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="bg-emerald-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <Link href="/" className="text-xl font-bold text-emerald-600">
                Quantum
              </Link>
              <p className="text-muted-foreground text-sm mt-5 mb-6">
                Quantum is a data-driven platform that provides insights and
                predictions for the financial markets.
              </p>
              <div className="flex space-x-4">
                {[
                  // { icon: Facebook, href: "#" },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/ask_studio.agency/",
                  },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-emerald-600 transition-colors"
                    target="_blank"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6 text-sm">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "Prediction", href: "/prediction" },
                  { label: "US Market", href: "/markets/stocks" },
                  { label: "Crypto Market", href: "/markets/crypto" },
                  // { label: "Blog", href: "/blog" },
                  // { label: "Careers", href: "/careers" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-6 text-sm">Insights</h3>
              <ul className="space-y-3">
                {[
                  {
                    label: "News",
                    href: "/news",
                  },
                  { label: "Learn", href: "/learn" },
                  // {
                  //   label: "Mobile Development",
                  //   href: "/services/mobile-development",
                  // },
                  // {
                  //   label: "Cloud Solutions",
                  //   href: "/services/cloud-solutions",
                  // },
                ].map((service, index) => (
                  <li key={index}>
                    <Link
                      href={service.href}
                      className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-6 text-sm">Contact Us</h3>
              <ul className="space-y-4">
                {/* <li className="flex items-start">
                  <MapPin className="h-4 w-4 mt-2 mr-3 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    123 Business Street, Suite 100, New York, NY 10001
                  </span>
                </li> */}
                <li>
                  <Link
                    href="mailto:hello@quantum.com"
                    className="flex items-center text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4 mr-3" />
                    hello@quantum.com
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="tel:(+91) 982-040-4970"
                    className="flex items-center text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4 mr-3" />
                    (+91) 982-040-4970
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Quantum. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors "
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
