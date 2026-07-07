"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Award, BarChart3, ArrowUpRight, Crown, Flame } from "lucide-react";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { courses } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // Mock global data for the platform
  const stats = [
    { name: "Total Users", value: "1,248", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { name: "Total LRN Minted", value: "45,000", change: "+25%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { name: "Courses Completed", value: "3,892", change: "+18%", icon: Award, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { name: "Active Learners", value: "432", change: "+5%", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  ];

  const chartData = [
    { label: "Mon", value: 40 },
    { label: "Tue", value: 55 },
    { label: "Wed", value: 45 },
    { label: "Thu", value: 70 },
    { label: "Fri", value: 65 },
    { label: "Sat", value: 85 },
    { label: "Sun", value: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Global statistics and learning metrics across the Stellar network.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-slate-200 shadow-sm px-4 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-700">Live Data Sync</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl border ${stat.border} ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-700 text-sm font-bold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-5xl font-black text-slate-800 tracking-tight mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Courses Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Trending Courses</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            {courses.slice(0, 4).map((course, idx) => (
              <div key={course.id} className="relative group p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-between overflow-hidden cursor-default">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center border border-slate-200 font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                    {idx === 0 ? <Crown className="w-4 h-4 text-amber-500" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{course.difficulty}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block font-black text-lg text-slate-800 group-hover:text-blue-700">{Math.floor(800 - idx * 150)}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Users</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Network Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-8 rounded-2xl border-[3px] border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] relative overflow-hidden flex flex-col"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800">Ecosystem Growth</h3>
              <p className="text-slate-500 font-medium mt-1">Weekly active users minting LRN tokens on Testnet</p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500">Total volume:</span>
              <span className="text-emerald-600 font-mono font-bold">142K XLM</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-end pt-10">
            {/* Chart Grid Lines */}
            <div className="absolute inset-x-0 inset-y-10 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((_, i) => (
                <div key={i} className="border-b border-slate-100 w-full h-0" />
              ))}
            </div>

            {/* Bars */}
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 relative">
              {chartData.map((data, i) => (
                <div 
                  key={i} 
                  className="w-full flex flex-col justify-end items-center group relative h-full"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredBar === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute -top-12 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-xl font-bold text-sm pointer-events-none whitespace-nowrap z-20 flex flex-col items-center"
                      >
                        {data.value * 12} Active
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.value}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 1, type: "spring", bounce: 0.3 }}
                    className={`w-full max-w-[4rem] rounded-t-xl transition-all duration-300 ${hoveredBar === i ? 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]' : 'bg-gradient-to-t from-blue-600 to-blue-500'}`}
                  />
                  <span className="text-slate-500 font-bold text-xs mt-3 group-hover:text-blue-600 transition-colors">{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
