"use client";

import { useWallet } from "@/components/WalletProvider";
import { useAppStore } from "@/store";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, Coins, ArrowRight, Clock, CheckCircle2, Wallet, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { address, balance, connect } = useWallet();
  const { courses, getCompletedCourses, getTransactions, getCourseProgress, getWithdrawnAmount, recordWithdrawal, addTransaction, updateTransaction } = useAppStore();
  
  const [mounted, setMounted] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const completedCourses = mounted && address ? getCompletedCourses(address) : [];
  const transactions = mounted && address ? getTransactions(address) : [];
  const withdrawnAmount = mounted && address ? getWithdrawnAmount(address) : 0;

  const totalRewardsEarned = courses
    .filter((c) => completedCourses.includes(c.id))
    .reduce((sum, c) => sum + c.reward, 0);

  const availableBalance = totalRewardsEarned - withdrawnAmount;

  const progressPercent = courses.length > 0
    ? Math.round((completedCourses.length / courses.length) * 100)
    : 0;

  const handleWithdraw = async () => {
    if (!address || withdrawAmount <= 0 || withdrawAmount > availableBalance) return;
    setIsWithdrawing(true);
    setWithdrawError("");

    const tempHash = "wd-" + Date.now().toString(36);
    addTransaction(address, {
      hash: tempHash,
      type: "mint_reward",
      status: "pending",
      timestamp: Date.now(),
      courseTitle: "Withdraw to Wallet",
    });

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount: withdrawAmount }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to withdraw");

      recordWithdrawal(address, withdrawAmount);
      updateTransaction(address, tempHash, { hash: data.txHash, status: "success" });
      setShowWithdrawModal(false);
    } catch (err: any) {
      setWithdrawError(err.message);
      updateTransaction(address, tempHash, { status: "failed" });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 max-w-md rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(203,213,225,1)]"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Connect Your Wallet</h2>
          <p className="text-slate-500 mb-8 font-medium">Connect your Freighter wallet to view your dashboard, track progress, and claim rewards.</p>
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

  return (
    <div className="space-y-10 max-w-7xl mx-auto relative">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <h1 className="text-4xl font-bold mb-2 tracking-wide">Welcome Back!</h1>
        <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 w-fit px-4 py-1.5 rounded-full border border-slate-700">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-sm font-mono tracking-wider">{address.slice(0, 6)}...{address.slice(-6)}</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                <Coins className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">XLM Balance</span>
            </div>
            <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{balance}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Stellar Testnet Wallet</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">LRN Available</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{availableBalance}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Total Earned: {totalRewardsEarned} LRN</p>
          </div>
          <button
            onClick={() => {
              setWithdrawAmount(availableBalance);
              setShowWithdrawModal(true);
            }}
            disabled={availableBalance <= 0}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-[2px_2px_0px_0px_rgba(148,163,184,0.5)]"
          >
            <Wallet className="w-4 h-4" />
            Withdraw
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Progress</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{progressPercent}%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 border border-slate-200 overflow-hidden">
            <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Your Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => {
              const isCompleted = completedCourses.includes(course.id);
              const progress = getCourseProgress(address, course.id);
              const lessonsRead = progress?.lessonsRead?.length || 0;
              const quizPassed = progress?.quizPassed || false;

              let status = "Not Started";
              let statusColor = "text-slate-400 bg-slate-100 border-slate-200";
              let statusIcon = <Clock className="w-3.5 h-3.5" />;

              if (isCompleted) {
                status = "Completed";
                statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                statusIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
              } else if (lessonsRead > 0 || quizPassed) {
                status = "In Progress";
                statusColor = "text-blue-700 bg-blue-50 border-blue-200";
                statusIcon = <BookOpen className="w-3.5 h-3.5" />;
              }

              return (
                <Link key={course.id} href={`/courses/${course.id}`} className="block">
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(203,213,225,1)] hover:-translate-y-0.5 transition-all flex items-center justify-between group gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-lg border-2 flex items-center justify-center ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        <span className="text-lg md:text-xl font-bold">{course.id}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800 text-base md:text-lg group-hover:text-blue-600 transition-colors truncate">{course.title}</h3>
                        <div className={`mt-1 flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md border w-fit ${statusColor}`}>
                          {statusIcon}
                          {status}
                          {!isCompleted && lessonsRead > 0 && (
                            <span className="opacity-70 ml-1 border-l border-current pl-1">{lessonsRead}/{course.lessons.length}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 border-l border-slate-100 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs md:text-sm font-bold text-slate-800 block">{course.reward}</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">LRN</span>
                      </div>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors text-slate-400 border border-slate-200 group-hover:border-slate-800">
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Recent Transactions</h2>
          {transactions.length > 0 ? (
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] overflow-hidden">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.hash} className="px-5 py-4 border-b border-slate-100 last:border-0 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 pr-4 flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{tx.courseTitle || tx.type.replace("_", " ")}</p>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 underline font-mono mt-1 block truncate max-w-full"
                      title="View on Stellar Expert"
                    >
                      {tx.hash}
                    </a>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
                    tx.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    tx.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              ))}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <Link href="/transactions" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 group">
                  View Full History <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-slate-200 border-dashed p-10 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-sm text-slate-400 mt-1">Complete a course to earn rewards!</p>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(203,213,225,1)] p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Withdraw Rewards</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Convert your earned LRN into Native Testnet XLM and transfer to your Freighter wallet.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Amount (Max: {availableBalance} LRN)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Math.min(availableBalance, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg py-3 px-4 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-colors"
                      min="0"
                      max={availableBalance}
                    />
                    <button 
                      onClick={() => setWithdrawAmount(availableBalance)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-slate-300 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">You will receive:</span>
                  <span className="font-bold text-blue-800">{withdrawAmount} XLM</span>
                </div>

                {withdrawError && (
                  <p className="text-xs font-bold text-red-500 mt-2">{withdrawError}</p>
                )}

                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || withdrawAmount <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 shadow-[2px_2px_0px_0px_rgba(147,197,253,0.5)]"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Confirm Withdrawal
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
