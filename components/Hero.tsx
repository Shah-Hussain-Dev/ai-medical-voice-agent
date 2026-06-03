"use client";

import { motion, useScroll, useTransform } from "motion/react";

const STATIC_PARTICLES = [
  { x: 120, y: 350, animateY: -40, duration: 4.2, delay: 0.5, left: 15, top: 25 },
  { x: 540, y: 150, animateY: -30, duration: 3.8, delay: 1.2, left: 45, top: 65 },
  { x: 820, y: 420, animateY: -45, duration: 4.5, delay: 0.1, left: 75, top: 35 },
  { x: 230, y: 180, animateY: -25, duration: 3.5, delay: 0.8, left: 28, top: 50 },
  { x: 680, y: 290, animateY: -35, duration: 4.8, delay: 1.5, left: 60, top: 75 },
  { x: 410, y: 310, animateY: -50, duration: 4.0, delay: 0.3, left: 38, top: 30 }
];

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-20 size-96 rounded-full bg-gradient-to-r from-teal-400/30 to-cyan-400/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 bottom-20 size-96 rounded-full bg-gradient-to-r from-cyan-400/30 to-teal-400/30 blur-3xl"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl"
        />
        {/* Floating particles */}
        {STATIC_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
            }}
            animate={{
              y: [null, particle.animateY, null],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            className="absolute size-2 rounded-full bg-teal-400/50 blur-sm"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-teal-200/50 bg-white/40 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-md dark:border-teal-800/50 dark:bg-slate-950/40 dark:text-teal-300">
              🏥 #1 AI-Powered Medical Consultation Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-bold md:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Your AI Voice Doctor
            </span>
            <span className="block text-lg font-medium text-teal-600 dark:text-teal-400 md:text-2xl">
              — Instant Medical Consultations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-teal-700 dark:text-teal-300"
          >
            Consult with an AI-powered voice doctor anytime. Describe your symptoms,
            get diagnosed, and receive a detailed medical report with treatment
            recommendations — all through natural conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 px-8 py-4 font-semibold text-white shadow-xl shadow-teal-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1">
              <span className="relative z-10 flex items-center gap-2">
                🎤 Start Consultation
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-br from-white/30 via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-300 via-cyan-300 to-teal-200 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            </button>
            <button className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/30 px-8 py-4 font-semibold text-teal-700 backdrop-blur-md transition-all duration-300 hover:bg-white/50 hover:shadow-lg dark:border-teal-700/30 dark:bg-slate-900/30 dark:text-teal-300 dark:hover:bg-slate-800/50">
              <span className="relative z-10">📄 View Sample Report</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </motion.div>

          {/* Stats - Glassmorphism cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8"
          >
            {[
              { number: "500K+", label: "Consultations", color: "from-teal-500 via-cyan-500 to-teal-400" },
              { number: "98%", label: "Accuracy Rate", color: "from-cyan-500 via-teal-500 to-cyan-400" },
              { number: "24/7", label: "Available", color: "from-teal-400 via-cyan-400 to-teal-300" },
            ].map((stat) => (
              <div key={stat.label} className="group relative rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:shadow-xl dark:border-teal-800/30 dark:bg-slate-950/40 dark:hover:bg-slate-900/60">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                <div className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-sm text-teal-600 dark:text-teal-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Demo Preview - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="relative rounded-xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-xl dark:border-teal-800/30 dark:bg-slate-950/20">
              <div className="overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-white/60 to-teal-50/60 dark:border-teal-800/30 dark:from-slate-950/60 dark:to-teal-950/60">
                <div className="flex aspect-video items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-md">
                      <span className="text-5xl">🤖</span>
                    </div>
                    <p className="text-xl font-semibold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-200">
                      AI Doctor is listening...
                    </p>
                    <p className="mt-2 text-sm text-teal-600 dark:text-teal-400">
                      Click to start your consultation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements - Glassmorphism */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-8 top-1/4 rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md shadow-lg dark:border-teal-800/30 dark:bg-slate-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <span>✓</span>
                </div>
                <div>
                  <p className="text-xs text-teal-600 dark:text-teal-400">Diagnosis Complete</p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">98% Confidence</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-8 bottom-1/4 rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md shadow-lg dark:border-teal-800/30 dark:bg-slate-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white">
                  <span>📋</span>
                </div>
                <div>
                  <p className="text-xs text-teal-600 dark:text-teal-400">Report Generated</p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">View Details</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
