"use client";

import { useAppStore } from "@/store";
import { useWallet } from "@/components/WalletProvider";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2,
  Award, Lock, Loader2, ChevronRight, AlertCircle
} from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);

  const { address, connect } = useWallet();
  const {
    courses, getCompletedCourses, getCourseProgress,
    markLessonRead, markQuizPassed, markCourseCompleted,
    addTransaction, updateTransaction
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"lessons" | "quiz" | "claim">("lessons");
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [shakeFailed, setShakeFailed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  const course = courses.find((c) => c.id === courseId);
  
  const completedCourses = mounted && address ? getCompletedCourses(address) : [];
  const progress = mounted && address ? getCourseProgress(address, courseId) : { lessonsRead: [], quizPassed: false, quizScore: null };
  const isCompleted = completedCourses.includes(courseId);

  // Scroll to content when changing lessons or tabs for better reading experience
  useEffect(() => {
    if (mounted && contentRef.current) {
      const yOffset = -100; // Offset for the sticky navbar
      const y = contentRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeLessonIndex, activeTab, mounted]);

  const allLessonsRead = useMemo(() => {
    if (!course) return false;
    return course.lessons.every((_, i) => progress.lessonsRead.includes(i));
  }, [course, progress.lessonsRead]);

  // Jump to claim if already passed but not completed
  useEffect(() => {
    if (progress.quizPassed && !isCompleted && activeTab === "lessons") {
       // Optional: auto-jump to claim tab
    }
  }, [progress.quizPassed, isCompleted, activeTab]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium text-lg">Course not found.</p>
        <Link href="/courses" className="text-blue-500 mt-4 font-bold hover:underline">← Back to courses</Link>
      </div>
    );
  }

  const handleMarkRead = () => {
    if (!address) return;
    markLessonRead(address, courseId, activeLessonIndex);
    if (activeLessonIndex < course.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const handleQuizSubmit = () => {
    const score = course.quiz.reduce((acc, q, i) => {
      return acc + (quizAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    const passed = score >= 2;
    setQuizSubmitted(true);
    
    if (passed) {
      if (address) markQuizPassed(address, courseId, score);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
    } else {
      setShakeFailed(true);
      setTimeout(() => setShakeFailed(false), 600);
    }
  };

  const quizScore = useMemo(() => {
    if (!quizSubmitted && !progress.quizPassed) return null;
    if (progress.quizScore !== null) return progress.quizScore;
    return course.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correctIndex ? 1 : 0), 0);
  }, [quizSubmitted, progress, quizAnswers, course.quiz]);

  const handleClaim = async () => {
    if (!address) return;
    setIsClaiming(true);

    const txHash = "claim-" + Date.now().toString(36);
    addTransaction(address, {
      hash: txHash,
      type: "complete_course",
      status: "pending",
      timestamp: Date.now(),
      courseTitle: course.title,
    });

    // Instant/smooth local update
    await new Promise((resolve) => setTimeout(resolve, 1000));

    markCourseCompleted(address, courseId);
    setClaimSuccess(true);
    setIsClaiming(false);
    setShowConfetti(true);

    updateTransaction(address, txHash, { status: "success" });
  };

  const tabs = [
    { id: "lessons" as const, label: "Lessons", icon: <BookOpen className="w-4 h-4" />, enabled: true },
    { id: "quiz" as const, label: "Quiz", icon: <CheckCircle2 className="w-4 h-4" />, enabled: allLessonsRead || progress.quizPassed },
    { id: "claim" as const, label: "Claim Reward", icon: <Award className="w-4 h-4" />, enabled: progress.quizPassed || isCompleted },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
        <Link href="/courses" className="hover:text-blue-500 transition-colors">Courses</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">{course.title}</span>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{course.title}</h1>
            <p className="text-slate-500 font-medium">{course.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                course.difficulty === "Beginner" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                course.difficulty === "Intermediate" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-purple-50 text-purple-700 border-purple-200"
              }`}>{course.difficulty}</span>
              <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Award className="w-4 h-4" /> {course.reward} LRN
              </span>
              {isCompleted && (
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl border border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
            disabled={!tab.enabled}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(203,213,225,1)] border border-slate-200"
                : tab.enabled
                  ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  : "text-slate-400 cursor-not-allowed opacity-50"
            }`}
          >
            {!tab.enabled && <Lock className="w-3.5 h-3.5" />}
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {!address && mounted && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Wallet not connected</p>
            <p className="text-sm text-amber-700 mt-1 font-medium">Please connect your wallet to save your progress and claim rewards.</p>
            <button onClick={connect} className="mt-2 text-sm font-bold text-amber-800 underline hover:text-amber-900">Connect now</button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div ref={contentRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          {activeTab === "lessons" && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Lesson sidebar */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {course.lessons.map((lesson, i) => {
                const isRead = progress.lessonsRead.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveLessonIndex(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all border-2 ${
                      activeLessonIndex === i
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : isRead
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {isRead && activeLessonIndex !== i && <CheckCircle2 className="w-3.5 h-3.5" />}
                    Lesson {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] p-6 sm:p-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-slate-100 pb-4">{course.lessons[activeLessonIndex].title}</h2>
              <div className="prose ppurple-slate ppurple-lg max-w-none font-medium leading-relaxed">
                {course.lessons[activeLessonIndex].content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-700 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('- **')) {
                    const parts = line.replace('- **', '').split('**');
                    return <p key={i} className="ml-4 mb-2"><strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}</p>;
                  }
                  if (line.startsWith('- ')) return <p key={i} className="ml-4 mb-2 text-slate-600 flex items-start gap-2"><span className="text-slate-300 mt-1">•</span><span>{line.replace('- ', '')}</span></p>;
                  if (line.startsWith('```')) return <div key={i} className="bg-slate-900 text-emerald-400 rounded-xl p-5 my-4 font-mono text-sm overflow-x-auto shadow-inner">{line.replace(/```\w*/, '')}</div>;
                  if (line.startsWith('|')) return <p key={i} className="font-mono text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-md border border-slate-100 my-1">{line}</p>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="text-slate-600 mb-4">{line}</p>;
                })}
              </div>

              {/* Mark as Read + Nav */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t-2 border-slate-100">
                <button
                  onClick={() => activeLessonIndex > 0 && setActiveLessonIndex(activeLessonIndex - 1)}
                  disabled={activeLessonIndex === 0}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                {!progress.lessonsRead.includes(activeLessonIndex) ? (
                  <button
                    onClick={handleMarkRead}
                    disabled={!address}
                    className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Read
                    {activeLessonIndex < course.lessons.length - 1 && <ArrowRight className="w-4 h-4" />}
                  </button>
                ) : activeLessonIndex < course.lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                    className="bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-700 font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]"
                  >
                    Next Lesson <ArrowRight className="w-4 h-4" />
                  </button>
                ) : allLessonsRead ? (
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)]"
                  >
                    Take Quiz <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-sm font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Read ✓</span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div 
              className={`bg-white rounded-2xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] p-6 sm:p-10 ${shakeFailed ? 'animate-shake' : ''}`}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Knowledge Check</h2>
              <p className="text-slate-500 font-medium mb-8">Score at least 2 out of 3 to pass and unlock your reward.</p>

              {(progress.quizPassed && !quizSubmitted) ? (
                <div className="text-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Quiz Passed!</h3>
                  <p className="text-slate-500 font-medium mb-6">Score: {progress.quizScore}/3</p>
                  <button
                    onClick={() => setActiveTab("claim")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition-all active:scale-95 flex items-center gap-2 mx-auto shadow-[4px_4px_0px_0px_rgba(147,197,253,0.5)]"
                  >
                    <Award className="w-5 h-5" /> Claim Your Reward
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {course.quiz.map((q, i) => (
                    <div key={i} className="space-y-4">
                      <p className="font-bold text-slate-800 text-lg">
                        <span className="text-blue-500 mr-2 text-xl">Q{i + 1}.</span>
                        {q.question}
                      </p>
                      <div className="grid gap-3">
                        {q.options.map((opt, j) => {
                          let optStyle = "bg-white border-slate-200 hover:border-slate-800 text-slate-600 hover:text-slate-800 shadow-sm";
                          if (quizAnswers[i] === j && !quizSubmitted) {
                            optStyle = "bg-blue-50 border-blue-400 text-blue-800 shadow-[2px_2px_0px_0px_rgba(96,165,250,1)]";
                          }
                          if (quizSubmitted) {
                            if (j === q.correctIndex) optStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-[2px_2px_0px_0px_rgba(52,211,153,1)]";
                            else if (quizAnswers[i] === j) optStyle = "bg-red-50 border-red-400 text-red-800 shadow-[2px_2px_0px_0px_rgba(248,113,113,1)]";
                            else optStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                          }
                          return (
                            <button
                              key={j}
                              onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [i]: j })}
                              disabled={quizSubmitted}
                              className={`text-left px-5 py-4 rounded-xl border-2 text-sm font-bold transition-all ${optStyle}`}
                            >
                              <span className="font-mono text-xs mr-3 opacity-50 bg-black/5 px-2 py-1 rounded">
                                {String.fromCharCode(65 + j)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < course.quiz.length || !address}
                      className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)] mt-4 text-lg"
                    >
                      {address ? "Submit Answers" : "Connect Wallet to Submit"}
                    </button>
                  ) : (
                    <div className={`text-center py-8 rounded-2xl border-2 mt-8 ${quizScore !== null && quizScore >= 2 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-2xl font-bold text-slate-800">
                        {quizScore !== null && quizScore >= 2 ? '🎉 You Passed!' : '❌ Almost there...'}
                      </p>
                      <p className="text-sm font-bold text-slate-500 mt-2">Score: {quizScore}/3</p>
                      {quizScore !== null && quizScore >= 2 ? (
                        <button
                          onClick={() => setActiveTab("claim")}
                          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(147,197,253,0.5)]"
                        >
                          Claim Reward →
                        </button>
                      ) : (
                        <button
                          onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                          className="mt-6 bg-white border-2 border-slate-300 hover:border-slate-800 text-slate-700 font-bold py-3 px-8 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "claim" && (
          <motion.div
            key="claim"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] p-6 sm:p-12 text-center">
              {isCompleted || claimSuccess ? (
                <div className="py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                  </motion.div>
                  <h2 className="text-4xl font-bold text-slate-800 mb-4">Reward Claimed! 🎉</h2>
                  <p className="text-slate-600 font-medium text-lg mb-2">You earned <strong className="text-blue-600 font-bold">{course.reward} LRN</strong> for completing {course.title}.</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 max-w-lg mx-auto flex items-start text-left gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">ℹ️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">How to Withdraw</h4>
                      <p className="text-blue-800 text-sm font-medium">Your earned LRN is convertible to Testnet XLM at a <strong className="font-extrabold">1:1 ratio</strong>. Visit your <Link href="/dashboard" className="underline font-bold hover:text-blue-600 transition-colors">Dashboard</Link> to withdraw your rewards to your Freighter wallet.</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">Transaction recorded on Stellar Testnet</p>
                  <Link href="/courses" className="inline-block mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-10 rounded-lg transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)]">
                    Continue Learning
                  </Link>
                </div>
              ) : !address ? (
                <div className="py-12">
                  <Lock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Connect Wallet to Claim</h2>
                  <p className="text-slate-500 font-medium mb-8 text-lg">You need a connected wallet to claim your on-chain reward.</p>
                  <button
                    onClick={connect}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-10 rounded-lg transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(148,163,184,0.5)]"
                  >
                    Connect Freighter
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-200">
                    <Award className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-800 mb-2">Claim Your Reward</h2>
                  <p className="text-slate-500 font-medium text-lg mb-4">You passed the quiz for <strong>{course.title}</strong>!</p>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 inline-block mx-auto mb-8 shadow-inner">
                     <p className="text-5xl font-extrabold text-blue-600">{course.reward} <span className="text-2xl text-slate-400">LRN</span></p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">This will call the CourseManager contract on Stellar Testnet</p>
                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-10 rounded-full transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-[4px_4px_0px_0px_rgba(147,197,253,0.5)] text-lg"
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Submitting Transaction...
                      </>
                    ) : (
                      <>
                        <Award className="w-6 h-6" />
                        Claim {course.reward} LRN
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
