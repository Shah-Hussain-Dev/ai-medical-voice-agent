"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const navLinks = [
    { name: "Clinical Flow", href: "#features" },
    { name: "Outcome", href: "#how-it-works" },
    { name: "Plans", href: "#pricing" },
    { name: "Contact", href: "#about" },
  ];

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });

    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#features");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run once initially

    return () => {
      unsubscribe();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [scrollY]);

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled 
          ? "border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 shadow-sm" 
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/10 transition-transform group-hover:scale-105">
            <Image 
              src="/logo.svg" 
              alt="VoiceMed Logo" 
              width={24} 
              height={24} 
              className="brightness-0 invert p-0.5"
            />
          </div>
          <div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-white dark:to-slate-200">
              VoiceMed AI
            </span>
            <span className="block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 -mt-1 uppercase tracking-wider">
              Care Portal
            </span>
          </div>
        </Link>

        {/* Center: Menus (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-850/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-750/30">
          {navLinks.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative flex items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-950 dark:text-white"
                    : "text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Side: Auth buttons */}
        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white transition shadow-sm hover:shadow active:scale-[0.98]"
            >
              Sign In
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm active:scale-[0.98]"
              >
                Dashboard
              </Link>
              <div className="flex items-center justify-center p-0.5 rounded-full border border-slate-200/85 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm">
                <UserButton />
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="space-y-1.5 px-4 py-4">
              {navLinks.map((link) => {
                const isActive = activeHash === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 font-bold border-l-4 border-emerald-600 pl-3"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              {!user && (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

