"use client";

import { useAppStore } from "@/store";
import { useWallet } from "@/components/WalletProvider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BookOpen, CheckCircle2, Clock, ArrowRight, Filter } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export default function CoursesPage() {
  const { courses, getCompletedCourses, getCourseProgress } = useAppStore();
  const { address } = useWallet();
  const [filter, setFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const completedCourses = mounted && address ? getCompletedCourses(address) : [];

  const filteredCourses = useMemo(() => {
    if (filter === "All") return courses;
    return courses.filter((c) => c.difficulty === filter);
  }, [courses, filter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Courses</h1>
          <p className="text-slate-500 font-medium">Complete courses, pass quizzes, and earn LRN tokens on the Stellar Testnet.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          {["All", "Beginner", "Intermediate", "Advanced"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, i) => {
            const isCompleted = completedCourses.includes(course.id);
            const progress = mounted && address ? getCourseProgress(address, course.id) : { lessonsRead: [], quizPassed: false };
            const lessonsRead = progress?.lessonsRead?.length || 0;
            const quizPassed = progress?.quizPassed || false;
            const totalLessons = course.lessons.length;

            let statusLabel = "Not Started";
            let statusColor = "bg-slate-100 text-slate-500 border-slate-200";
            if (isCompleted) {
              statusLabel = "Completed ✓";
              statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            } else if (quizPassed) {
              statusLabel = "Quiz Passed — Claim!";
              statusColor = "bg-blue-50 text-blue-700 border-blue-200";
            } else if (lessonsRead > 0) {
              statusLabel = `${lessonsRead}/${totalLessons} lessons`;
              statusColor = "bg-amber-50 text-amber-700 border-amber-200";
            }

            const difficultyColor = {
              Beginner: "text-emerald-700 bg-emerald-50 border-emerald-200",
              Intermediate: "text-blue-700 bg-blue-50 border-blue-200",
              Advanced: "text-purple-700 bg-purple-50 border-purple-200",
            }[course.difficulty];

            return (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <div className="bg-white p-6 flex flex-col gap-4 relative group cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(148,163,184,0.3)] transition-all duration-200 border-2 border-slate-200 rounded-xl h-full">
                    
                    {isCompleted && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl rounded-tr-lg z-10 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${difficultyColor}`}>
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3">{course.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded-lg">
                        <Award className="w-4 h-4" />
                        {course.reward} LRN
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {!isCompleted && lessonsRead > 0 && (
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2 border border-slate-200 overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(lessonsRead / totalLessons) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
