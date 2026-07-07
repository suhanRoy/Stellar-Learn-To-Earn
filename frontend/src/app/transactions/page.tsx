"use client";

import { useWallet } from "@/components/WalletProvider";
import { useAppStore } from "@/store";
import { motion } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const { address, connect } = useWallet();
  const { getTransactions } = useAppStore();
  const [mounted, setMounted] = useState(false);

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
          <p className="text-slate-500 mb-8 font-medium">Connect your wallet to view your transaction history.</p>
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

  const transactions = getTransactions(address);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transaction Center</h1>
        <p className="text-slate-500 font-medium mt-1">A complete history of your on-chain and off-chain activities.</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] overflow-hidden">
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                  <th className="p-4 font-bold">Action</th>
                  <th className="p-4 font-bold hidden sm:table-cell">Date</th>
                  <th className="p-4 font-bold">Hash</th>
                  <th className="p-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{tx.courseTitle || tx.type.replace(/_/g, " ")}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium hidden sm:table-cell">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {tx.hash.startsWith("claim-") || tx.hash.startsWith("wd-") ? (
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">Local Auth</span>
                      ) : (
                        <a 
                          href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline font-mono flex items-center gap-1 w-fit"
                          title="View on Stellar Expert"
                        >
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                        tx.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        tx.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">No transactions yet</p>
            <p className="text-slate-400">Complete a course to earn rewards!</p>
          </div>
        )}
      </div>
    </div>
  );
}
