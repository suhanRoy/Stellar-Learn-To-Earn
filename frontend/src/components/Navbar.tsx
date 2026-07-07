"use client";

import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, LogOut, Coins, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, balance, connect, disconnect, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/activity", label: "Activity" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <>
      <nav className="w-full bg-[#fdfdfd]/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-800 tracking-tight flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white font-serif shrink-0">L</div>
            <span className="hidden sm:inline">LearnToEarn</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-emerald-600 transition-colors ${pathname === link.href ? "text-emerald-700 font-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
              <span className="text-emerald-600">●</span>
              <span>Testnet</span>
            </div>

            <Link href="/settings" className="hidden sm:flex p-2 text-gray-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors" title="Settings">
              <Settings size={18} />
            </Link>

            {mounted && address ? (
              <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-full overflow-hidden h-9 sm:h-10">
                <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-gray-50 border-r border-gray-200 text-[11px] sm:text-sm font-semibold text-gray-700 h-full">
                  <Coins size={14} className="text-amber-500" />
                  <span className="max-w-[5rem] sm:max-w-none truncate">{balance} XLM</span>
                </div>
                <button onClick={disconnect} className="group hover:bg-red-50 text-gray-700 hover:text-red-600 px-2 sm:px-4 text-[11px] sm:text-sm font-medium h-full relative">
                  <span className="hidden sm:block group-hover:opacity-0 transition-opacity duration-200">
                    {address.slice(0, 4)}...{address.slice(-4)}
                  </span>
                  <span className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold">
                    Disconnect
                  </span>
                  <span className="sm:hidden">
                    <LogOut size={14} className="text-red-500" />
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="rounded-full bg-slate-700 hover:bg-slate-800 text-white shadow-sm font-semibold px-3 sm:px-4 text-xs sm:text-sm h-9 sm:h-10 flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Wallet size={14} />
                <span className="hidden sm:inline">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
                <span className="sm:hidden">{isConnecting ? "..." : "Connect"}</span>
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-600 hover:text-emerald-600 bg-gray-50 rounded-lg border border-gray-100"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              type="button"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-16 left-0 w-full z-40 bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-2 text-base font-medium text-gray-600">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg transition-colors ${pathname === link.href ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 hover:text-emerald-600"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
