"use client";

import { ArrowRight, Sparkles, BookOpen, Award, Activity, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="text-slate-600 w-6 h-6" />,
      title: "Interactive Quests",
      description: "Complete hands-on Stellar & Soroban quests that teach you real blockchain development skills step by step."
    },
    {
      icon: <Award className="text-slate-600 w-6 h-6" />,
      title: "Earn LRN Tokens",
      description: "Automatically receive LRN tokens on-chain when you complete quests. Rewards are minted directly by the smart contract."
    },
    {
      icon: <Shield className="text-slate-600 w-6 h-6" />,
      title: "Soroban Security",
      description: "Built on Stellar's Rust-based Soroban smart contracts with cross-contract calls, ensuring secure state transitions."
    },
    {
      icon: <Activity className="text-slate-600 w-6 h-6" />,
      title: "Real-Time Tracking",
      description: "Monitor quest completions, token rewards, and on-chain events instantly through our live dashboard synced with the blockchain."
    }
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-20 pb-20 font-sans mt-8 sm:mt-10 overflow-hidden relative">
      {/* Hero */}
      <section className="relative pt-8 sm:pt-16 pb-12 text-center max-w-4xl mx-auto flex flex-col items-center px-4">
        
        {/* Sketchy background elements */}
        <div className="absolute top-10 left-4 sm:left-12 w-32 h-32 opacity-15 pointer-events-none text-slate-600 -rotate-12">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
             <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
             <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
             <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5-4 5-4"/>
             <circle cx="15" cy="9" r="1"/>
           </svg>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 w-32 h-32 opacity-15 pointer-events-none text-slate-600 rotate-12">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
             <circle cx="12" cy="12" r="8"/>
             <path d="M12.5 7.5A2.5 2.5 0 0 0 10 10a2.5 2.5 0 0 0 5 0c0-1.38-1.12-2.5-2.5-2.5z"/>
             <path d="M10 14a2.5 2.5 0 0 0 5 0c0-1.38-1.12-2.5-2.5-2.5"/>
             <path d="M12 7v10"/>
           </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100/80 text-slate-700 font-semibold text-sm tracking-widest mb-8 border border-slate-300 shadow-sm font-kalam uppercase"
        >
          <Sparkles size={16} />
          <span>Powered by Soroban</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-800 leading-[1.1]"
        >
          Master Soroban. <br className="hidden md:block" />
          <span className="font-kalam text-slate-600 relative inline-block">
            Get Paid.
            <motion.svg 
              className="absolute w-full h-4 -bottom-1 left-0 text-slate-400 opacity-60" 
              viewBox="0 0 100 10" 
              preserveAspectRatio="none"
              animate={{ scaleX: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.path 
                d="M0,5 Q50,0 100,8" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </motion.svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-600 mb-12 max-w-2xl leading-relaxed text-lg sm:text-xl px-2 font-medium"
        >
          A decentralized platform that rewards you with LRN tokens for learning Stellar's Rust-based smart contracts.
          Learn, build, and earn—all secured on-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-stretch sm:items-center w-full px-4 sm:px-0"
        >
          <Link
            href="/courses"
            className="relative px-8 py-4 bg-slate-800 text-white hover:bg-slate-700 font-bold text-lg transition-all flex items-center justify-center gap-2 group w-full sm:w-auto min-w-[200px] shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(148,163,184,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] rounded-sm"
          >
            Start Learning
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-4 bg-transparent border-2 border-slate-300 text-slate-600 font-bold text-lg hover:border-slate-800 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 group w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(203,213,225,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] rounded-sm"
          >
            <Activity size={20} className="group-hover:scale-110 transition-transform" />
            My Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 w-full pt-10">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-kalam">How It Works</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">A dual-contract architecture: CourseManager tracks your progress, RewardToken mints your earnings.</p>
          <div className="absolute top-4 right-1/4 w-8 h-8 opacity-20 pointer-events-none text-slate-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16 4.6V3.86a2.92 2.92 0 0 0-.86-2.25L13.89.36l-3.36 3.36a2.12 2.12 0 0 1-3 0 2.12 2.12 0 0 0-3 0 2.12 2.12 0 0 0 0 3 2.12 2.12 0 0 1 0 3l3.36 3.36 9.64-9.64"/></svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] hover:shadow-[4px_4px_0px_0px_rgba(148,163,184,0.6)] transition-all group"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:bg-slate-200 transition-all duration-300 border border-slate-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Sticky Note */}
      <section className="max-w-4xl mx-auto px-4 w-full text-center pb-20 pt-10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative sticky-note bg-slate-50 p-10 sm:p-14 mx-auto transform rotate-1 hover:rotate-0 transition-all duration-500 border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(203,213,225,1)] max-w-2xl"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-slate-200/60 border border-slate-300/50 shadow-sm backdrop-blur-md rotate-[-3deg]" />
          <h3 className="text-3xl font-bold text-slate-800 mb-4 font-kalam">Ready to start earning?</h3>
          <p className="text-slate-600 mb-8 font-medium text-lg">
            Connect your Freighter wallet to interact with the deployed Soroban contracts on the Stellar Testnet and claim your LRN tokens.
          </p>
          <Link href="/courses" className="inline-block bg-slate-800 text-white font-bold py-4 px-10 rounded-sm hover:bg-slate-700 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)]">
            Browse Courses
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
