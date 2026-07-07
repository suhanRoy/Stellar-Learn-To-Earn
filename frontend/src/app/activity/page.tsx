"use client";

import { useAppStore } from "@/store";
import { useWallet } from "@/components/WalletProvider";
import { ActivityFeed } from "@/components/ActivityFeed";
import { motion } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const { getTransactions } = useAppStore();
  const { address } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => { setMounted(true); }, []);

  const allTransactions = mounted && address ? getTransactions(address) : [];
  const transactions = allTransactions.filter(tx => filter === "all" || tx.status === filter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Network Activity</h1>
        <p className="text-slate-500 font-medium mt-1">Track your transactions and on-chain events on the Stellar Testnet.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[500px] min-w-0">
          
          {!mounted ? null : !address ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 border-dashed p-10 text-center shadow-sm h-full flex flex-col justify-center">
              <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Connect wallet to view</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 border-dashed p-10 text-center shadow-sm h-full flex flex-col justify-center">
              <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No transactions yet.</p>
              <p className="text-slate-400 text-sm mt-1">Complete a course to see your first transaction.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-[3px] border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b-2 border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Transaction History</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors shadow-sm cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex-1 overflow-y-auto">
              {transactions.map((tx, i) => (
                <div key={tx.hash} className="px-5 py-4 border-b border-slate-100 last:border-0 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm shrink-0 ${
                      tx.status === "success" ? "bg-emerald-500" :
                      tx.status === "failed" ? "bg-red-500" :
                      "bg-amber-500 animate-pulse"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{tx.courseTitle || tx.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{tx.hash}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      tx.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      tx.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {tx.status}
                    </span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* On-Chain Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="min-w-0">
          <ActivityFeed />
        </motion.div>
      </div>
    </div>
  );
}
