"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// assets
import logoImage from "@/assets/images/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      className="relative z-50 py-5"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 py-5 mr-9">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="md:hidden bg-transparent border-none p-2 inline-flex text-[#adb7bf] hover:text-[#f9fafb]"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logoImage}
                alt="Cheapbeats logo"
                className="h-6 w-6"
                width={24}
                height={24}
              />
              <motion.span
                className="hidden md:inline-block text-xl font-bold capitalize text-white whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Cheap Beats
              </motion.span>
            </Link>
          </div>

          <nav className="hidden sm:flex items-center flex-auto space-x-2 relative">
            <Link
              href="/licenses"
              className={`whitespace-nowrap font-bold text-base py-2 px-3 text-[#adb7bf] ${
                pathname === "/licenses"
                  ? "text-[#f9fafb]"
                  : "text-[#adb7bf] hover:text-[#f9fafb]"
              }`}
            >
              Licence
            </Link>
            <Link
              href="/faq"
              className={`whitespace-nowrap font-bold text-base py-2 px-3 text-[#adb7bf] ${
                pathname === "/licenses"
                  ? "text-[#f9fafb]"
                  : "text-[#adb7bf] hover:text-[#f9fafb]"
              }`}
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center pl-6">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/coming-soon"
                className={`text-base font-bold py-2 px-3 text-[#adb7bf] inline-flex items-center gap-x-2 ${
                  pathname === "/licenses"
                    ? "text-[#f9fafb]"
                    : "text-[#adb7bf] hover:text-[#f9fafb]"
                }`}
              >
                <Rocket size={20} className="text-yellow-500" />
                Start Selling
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 right-0 bg-background shadow-lg md:hidden"
          >
            <nav className="container mx-auto px-4 py-4">
              <motion.div whileHover={{ x: 5 }} whileTap={{ x: 0 }}>
                <Link
                  href="/licenses"
                  className={`flex items-center text-sm font-medium py-3 transition-colors duration-200 ${
                    pathname === "/licenses"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Licenses
                </Link>

                <Link
                  href="/faq"
                  className={`flex items-center text-sm font-medium py-3 transition-colors duration-200 ${
                    pathname === "/faq"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
