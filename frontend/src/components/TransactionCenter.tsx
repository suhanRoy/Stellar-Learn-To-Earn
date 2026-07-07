"use client";

import { useAppStore } from "@/store";
import { ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useWallet } from "./WalletProvider";

export function TransactionCenter() {
  const { address } = useWallet();
  const transactions = useAppStore((state) => state.transactionsByWallet[address || ""] || []);

  if (transactions.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
        Transaction Center
        <span className="bg-zinc-100 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-500">
          {transactions.length}
        </span>
      </h3>
      
      <div className="flex flex-col gap-2">
        {transactions.map((tx) => (
          <div key={tx.hash} className="flex flex-col bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                {tx.type.replace("_", " ")}
              </span>
              
              {tx.status === "pending" || tx.status === "processing" ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              ) : tx.status === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">
                {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
              </span>
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
