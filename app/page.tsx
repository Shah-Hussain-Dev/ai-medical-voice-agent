"use client";

import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

const features = [
  {
    icon: "🎙️",
    title: "Voice-Powered Consultations",
    description: "Speak naturally with our AI doctor. No typing required — just describe your symptoms and get instant responses.",
  },
  {
    icon: "📋",
    title: "Detailed Medical Reports",
    description: "Receive comprehensive medical reports with diagnosis, treatment recommendations, and next steps.",
  },
  {
    icon: "🕐",
    title: "24/7 Availability",
    description: "Access medical consultations anytime, anywhere. No waiting rooms, no appointments needed.",
  },
  {
    icon: "🔒",
    title: "HIPAA Compliant",
    description: "Your health data is protected with enterprise-grade encryption and strict privacy standards.",
  },
  {
    icon: "💊",
    title: "Smart Medication Suggestions",
    description: "Get AI-generated medication recommendations based on your symptoms and medical history.",
  },
  {
    icon: "📱",
    title: "Multi-Device Support",
    description: "Access your medical reports and consultation history from any device — phone, tablet, or desktop.",
  },
];

const steps = [
  {
    step: "01",
    title: "Start Your Consultation",
    description: "Click the microphone button and describe your symptoms in your own words. Our AI listens and understands.",
  },
  {
    step: "02",
    title: "AI Medical Analysis",
    description: "Our advanced AI processes your symptoms, cross-references medical databases, and generates a preliminary assessment.",
  },
  {
    step: "03",
    title: "Receive Your Report",
    description: "Get a detailed medical report with diagnosis, treatment recommendations, and actionable next steps.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Patient",
    content: "Incredible experience! I got a proper diagnosis within minutes without leaving my home. The medical report was detailed and easy to understand.",
    rating: 5,
  },
  {
    name: "Dr. James K.",
    role: "Physician",
    content: "As a doctor, I'm impressed by the accuracy of the AI consultations. It's a great tool for preliminary assessments and patient triage.",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "Patient",
    content: "The voice interface is so intuitive. I was nervous about AI medical advice, but the thorough report gave me confidence in the diagnosis.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for trying out the service",
    features: [
      "3 consultations per month",
      "Basic medical reports",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Best for regular users",
    features: [
      "Unlimited consultations",
      "Detailed medical reports",
      "Priority support",
      "Medication reminders",
      "Medical history tracking",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Family",
    price: "$39",
    period: "/month",
    description: "Care for your entire family",
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Family medical history",
      "Pediatric consultations",
      "24/7 phone support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 dark:from-slate-950 dark:via-teal-950 dark:to-slate-950">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 500,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -50, null],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute size-2 rounded-full bg-teal-400/50 blur-sm"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
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
            ].map((stat, index) => (
              <div key={stat.label} className="group relative rounded-2xl border border-white/20 bg-white/40 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:shadow-xl dark:border-teal-800/30 dark:bg-slate-950/40 dark:hover:bg-slate-900/60">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
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
            <div className="relative rounded-3xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-xl dark:border-teal-800/30 dark:bg-slate-950/20">
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/60 to-teal-50/60 dark:border-teal-800/30 dark:from-slate-950/60 dark:to-teal-950/60">
                <div className="flex aspect-video items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-md">
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
              className="absolute -left-8 top-1/4 rounded-2xl border border-white/30 bg-white/40 p-4 backdrop-blur-md shadow-lg dark:border-teal-800/30 dark:bg-slate-950/40"
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
              className="absolute -right-8 bottom-1/4 rounded-2xl border border-white/30 bg-white/40 p-4 backdrop-blur-md shadow-lg dark:border-teal-800/30 dark:bg-slate-950/40"
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

function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-200/50 bg-white/40 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-md dark:border-teal-800/50 dark:bg-slate-950/40 dark:text-teal-300">
            ✨ Features
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Everything You Need for Better Health
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-600 dark:text-teal-400">
            Our AI-powered platform combines cutting-edge technology with medical
            expertise to provide you with the best possible care.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer rounded-2xl border border-white/30 bg-white/40 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-teal-800/30 dark:bg-slate-950/40"
            >
              {/* Hover gradient overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-teal-500/5"
              />
              {/* Icon animation */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-2xl backdrop-blur-md"
              >
                {feature.icon}
              </motion.div>
              <h3 className="relative text-xl font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="relative mt-3 text-teal-600 dark:text-teal-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-200/50 bg-white/40 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-md dark:border-teal-800/50 dark:bg-slate-950/40 dark:text-teal-300">
            🔄 How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Three Simple Steps to Better Health
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer rounded-2xl border border-white/30 bg-white/40 p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:bg-white/60 dark:border-teal-800/30 dark:bg-slate-950/40 dark:hover:bg-slate-900/60"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mb-4 text-6xl font-bold bg-gradient-to-br from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent"
              >
                {step.step}
              </motion.div>
              <h3 className="text-xl font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
                {step.title}
              </h3>
              <p className="mt-3 text-teal-600 dark:text-teal-400">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block"
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25"
                  >
                    <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-200/50 bg-white/40 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-md dark:border-teal-800/50 dark:bg-slate-950/40 dark:text-teal-300">
            💬 Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="group cursor-pointer rounded-2xl border border-white/30 bg-white/40 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:shadow-xl dark:border-teal-800/30 dark:bg-slate-950/40 dark:hover:bg-slate-900/60"
            >
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-yellow-400"
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-4 text-teal-600 dark:text-teal-400"
              >
                "{testimonial.content}"
              </motion.p>
              <div className="mt-6 flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="size-10 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 flex items-center justify-center text-lg font-bold text-white"
                >
                  {testimonial.name[0]}
                </motion.div>
                <div>
                  <p className="font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-teal-500 dark:text-teal-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-200/50 bg-white/40 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-md dark:border-teal-800/50 dark:bg-slate-950/40 dark:text-teal-300">
            💰 Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className={`relative cursor-pointer rounded-2xl border p-8 backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${plan.popular
                ? "border-teal-500/50 bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-teal-500/20 shadow-xl shadow-teal-500/10 dark:border-teal-400/50 dark:from-teal-500/10 dark:via-cyan-500/10 dark:to-teal-500/10"
                : "border-white/30 bg-white/40 shadow-lg hover:shadow-xl dark:border-teal-800/30 dark:bg-slate-950/40"
                }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  Most Popular
                </span>
              )}

              <h3 className={`text-xl font-semibold ${plan.popular ? "bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent" : "text-teal-900 dark:text-teal-100"}`}>
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.popular ? "bg-gradient-to-br from-teal-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent" : "text-teal-900 dark:text-teal-50"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={plan.popular ? "text-teal-600" : "text-teal-500 dark:text-teal-400"}>
                    {plan.period}
                  </span>
                )}
              </div>

              <p className={`mt-2 ${plan.popular ? "text-teal-600" : "text-teal-500 dark:text-teal-400"}`}>
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className={plan.popular ? "text-teal-500" : "text-teal-500"}>✓</span>
                    <span className={plan.popular ? "text-teal-700" : "text-teal-600 dark:text-teal-400"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`group relative mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25`}
              >
                <span className="relative z-10">{plan.cta}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-br from-white/20 via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-teal-500/20 p-12 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10" />
          <div className="absolute -left-20 -top-20 size-64 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-gradient-to-r from-cyan-500/30 to-teal-500/30 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">
                Ready to Transform Your Healthcare Experience?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-teal-600 dark:text-teal-400">
              Join thousands of users who have already improved their health with VoiceMed AI.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 px-8 py-4 font-semibold text-white shadow-xl shadow-teal-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/40"
              >
                <span className="relative z-10">Start Free Consultation</span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-br from-white/30 via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-300 via-cyan-300 to-teal-200 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/20 px-8 py-4 font-semibold text-teal-700 backdrop-blur-md transition-all duration-300 hover:bg-white/40 dark:border-teal-700/30 dark:bg-slate-900/20 dark:text-teal-300"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="about" className="border-t border-white/20 bg-white/40 py-12 backdrop-blur-md dark:border-teal-800/30 dark:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-400 shadow-lg shadow-teal-500/25">
                <span className="text-xl">⚕️</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-br from-teal-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                VoiceMed AI
              </h1>
            </div>
            <p className="mt-4 text-teal-600 dark:text-teal-400">
              Your trusted AI-powered voice doctor for instant medical consultations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Features</a></li>
              <li><a href="#pricing" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Pricing</a></li>
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">About</a></li>
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Blog</a></li>
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold bg-gradient-to-br from-teal-700 via-cyan-600 to-teal-400 bg-clip-text text-transparent">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Privacy Policy</a></li>
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">Terms of Service</a></li>
              <li><a href="#" className="text-teal-600 transition-colors hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent hover:from-teal-600 hover:via-cyan-500 hover:to-teal-400 dark:text-teal-400 dark:hover:text-teal-200">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row dark:border-teal-800/30">
          <p className="text-sm text-teal-500 dark:text-teal-400">
            © 2026 VoiceMed AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-teal-500 transition-colors hover:text-teal-700 dark:hover:text-teal-300">Twitter</a>
            <a href="#" className="text-teal-500 transition-colors hover:text-teal-700 dark:hover:text-teal-300">LinkedIn</a>
            <a href="#" className="text-teal-500 transition-colors hover:text-teal-700 dark:hover:text-teal-300">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}