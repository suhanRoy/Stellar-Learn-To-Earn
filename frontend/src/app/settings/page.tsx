"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Bell, Shield, Wallet, Globe, Moon, Monitor, Key, Lock, ChevronRight } from "lucide-react";
import { useWallet } from "@/components/WalletProvider";
import { useEffect, useState } from "react";

type Tab = "wallet" | "notifications" | "security";

export default function SettingsPage() {
  const { address, connect, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("wallet");
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 max-w-md rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(203,213,225,1)]"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Connect Wallet</h2>
          <p className="text-slate-500 mb-8 font-medium">Connect your wallet to access your account settings.</p>
          <button
            onClick={connect}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-10 rounded-sm transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)] w-full"
          >
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  const tabClasses = (tab: Tab) => 
    `w-full text-left px-4 py-4 rounded-xl font-bold transition-all flex items-center justify-between group ${
      activeTab === tab 
        ? "bg-white text-slate-800 shadow-[4px_4px_0px_0px_rgba(203,213,225,1)] border-2 border-slate-200" 
        : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-2 border-transparent"
    }`;

  const renderWalletTab = () => (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Wallet Connection */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Wallet Connection</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Connected Address</p>
            <div className="flex items-center gap-2 max-w-full">
              <span className="font-mono bg-slate-100 px-3 py-1.5 rounded-md text-sm border border-slate-200 text-slate-700 break-all">
                {address}
              </span>
            </div>
          </div>
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-bold text-sm transition-colors shrink-0"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Network */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Network</h3>
        <div className="flex items-center gap-4 p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400 opacity-10 rounded-full blur-2xl pointer-events-none" />
          <Globe className="w-6 h-6 text-emerald-600 relative z-10" />
          <div className="relative z-10">
            <p className="font-bold text-slate-800">Stellar Testnet</p>
            <p className="text-xs text-slate-500 font-medium">Currently connected to soroban-testnet.stellar.org</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5" /> Note: Mainnet deployment coming soon.
        </p>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-500" /> Communication Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Email Alerts</p>
              <p className="text-sm text-slate-500 font-medium">Receive updates about rewards and withdrawals.</p>
            </div>
            <button 
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-purple-500' : 'bg-slate-300'}`}
            >
              <motion.div layout className="w-4 h-4 bg-white rounded-full absolute top-1" initial={false} animate={{ x: emailNotifs ? 28 : 4 }} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">New Course Releases</p>
              <p className="text-sm text-slate-500 font-medium">Get notified when new lessons are added to the platform.</p>
            </div>
            <button 
              onClick={() => setCourseUpdates(!courseUpdates)}
              className={`w-12 h-6 rounded-full transition-colors relative ${courseUpdates ? 'bg-purple-500' : 'bg-slate-300'}`}
            >
              <motion.div layout className="w-4 h-4 bg-white rounded-full absolute top-1" initial={false} animate={{ x: courseUpdates ? 28 : 4 }} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-slate-500" /> UI Preferences
        </h3>
        <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
          <div>
            <p className="font-bold text-slate-800">Dark Mode</p>
            <p className="text-sm text-slate-500 font-medium">Available in a future update.</p>
          </div>
          <div className="w-12 h-6 rounded-full bg-slate-200 relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" /> Contract Approvals
        </h3>
        <p className="text-sm text-slate-500 font-medium mb-4">
          Learn-to-Earn interacts with Soroban smart contracts on the testnet. You must sign all transaction approvals directly in your Freighter wallet.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 font-medium">We never have access to your private keys. All signing is completely non-custodial.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)]">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-500" /> Authorized Sessions
        </h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-bold text-slate-800">Current Session</p>
            <p className="text-sm text-slate-500 font-medium">Mac OS • Chrome • Active Now</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            Active
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-2 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center">
          <Settings2 className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your platform preferences and wallet connection.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-64 shrink-0 space-y-3">
          <button onClick={() => setActiveTab("wallet")} className={tabClasses("wallet")}>
            <div className="flex items-center gap-3">
              <Wallet className={`w-5 h-5 ${activeTab === "wallet" ? "text-emerald-500" : ""}`} /> Wallet Connection
            </div>
            {activeTab === "wallet" && <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          
          <button onClick={() => setActiveTab("notifications")} className={tabClasses("notifications")}>
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${activeTab === "notifications" ? "text-purple-500" : ""}`} /> Notifications
            </div>
            {activeTab === "notifications" && <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          
          <button onClick={() => setActiveTab("security")} className={tabClasses("security")}>
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${activeTab === "security" ? "text-blue-500" : ""}`} /> Security
            </div>
            {activeTab === "security" && <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "wallet" && renderWalletTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "security" && renderSecurityTab()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
