import { UserButton, useUser } from "@clerk/nextjs";
import { motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Clinical Flow", href: "#features" },
    { name: "Outcome", href: "#how-it-works" },
    { name: "Plans", href: "#pricing" },
    { name: "Contact", href: "#about" },
  ];

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 36);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -28 }}
      animate={{ y: 0 }}
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/90 backdrop-blur-xl transition duration-300 ${scrolled ? "border-slate-200 shadow-sm" : "border-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18M3 12h18" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">VoiceMed AI</p>
            <p className="text-xs text-slate-500">Clinical triage and care workflow</p>
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
            >
              {link.name}
            </Link>
          ))}

          {!user ? (
            <Link
              href="/sign-in"
              className="rounded-full border border-emerald-700 bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="block h-0.5 w-6 bg-slate-700 transition duration-200" />
          <span className="my-1 block h-0.5 w-6 bg-slate-700 transition duration-200" />
          <span className="block h-0.5 w-6 bg-slate-700 transition duration-200" />
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 bg-white/95 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
