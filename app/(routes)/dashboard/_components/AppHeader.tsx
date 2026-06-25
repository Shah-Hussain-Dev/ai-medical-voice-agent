"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  History as HistoryIcon, 
  CreditCard, 
  User, 
  Coins, 
  Menu, 
  X
} from "lucide-react";

const AppHeader = () => {
  const pathname = usePathname();
  const userDetails = useContext(UserDetailsContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "History", href: "/dashboard/history", icon: HistoryIcon },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/10 transition-transform group-hover:scale-105">
            <Image 
              src="/logo.svg" 
              alt="VoiceMed Logo" 
              width={24} 
              height={24} 
              className="brightness-0 invert p-0.5"
            />
          </div>
          <div className="hidden sm:block">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-white dark:to-slate-200">
              VoiceMed AI
            </span>
            <span className="block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 -mt-1 uppercase tracking-wider">
              Dashboard
            </span>
          </div>
        </Link>

        {/* Center: Menus (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/30">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-950 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400"}`} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: User & Clerk Profile */}
        <div className="flex items-center gap-4">
          {/* Credits Badge */}
          {userDetails && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-1.5 shadow-sm hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50 transition-colors"
            >
              <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-850 dark:text-emerald-300">
                {userDetails.credits} <span className="font-normal text-slate-500 dark:text-slate-400">credits</span>
              </span>
            </motion.div>
          )}

          {/* User Button */}
          <div className="flex items-center justify-center p-0.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 hover:ring-2 hover:ring-emerald-500/20 transition-all bg-white dark:bg-slate-900 shadow-sm">
            <UserButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="space-y-1.5 px-4 py-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 font-bold border-l-4 border-emerald-600 pl-3"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AppHeader;

