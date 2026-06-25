"use client";

import Navbar from "@/components/Navbar";
import { motion } from "motion/react";
import Link from "next/link";
import { 
  Stethoscope, 
  Mic, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Activity, 
  FileText, 
  Check, 
  ArrowRight, 
  Dna, 
  FileCheck, 
  Brain, 
  Star
} from "lucide-react";
import { PricingTable } from "@clerk/nextjs";

const features = [
  {
    icon: Mic,
    title: "Voice-Powered Consultations",
    description: "Speak naturally to input symptoms. Our audio engine transcribes, processes, and structured-formats medical inputs in real-time.",
  },
  {
    icon: FileText,
    title: "Detailed Clinical Reports",
    description: "Receive comprehensive, download-ready clinical reports detailing symptom summaries, severity scoring, and assessment suggestions.",
  },
  {
    icon: Clock,
    title: "Instant 24/7 Care Support",
    description: "Get immediate medical assessments anytime, anywhere. Bypass scheduling friction and waiting rooms for instant care advice.",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant Security",
    description: "Patient health data is secured with advanced AES-256 encryption. We enforce rigorous HIPAA privacy protocols for all transcripts.",
  },
  {
    icon: Brain,
    title: "AI Medical Intelligence",
    description: "Cross-references multi-dimensional clinical knowledge databases to deliver highly accurate, guideline-aligned assessments.",
  },
  {
    icon: Dna,
    title: "EHR-Ready Integration",
    description: "Seamlessly export generated reports, vital structures, and diagnostic suggestions straight into your provider's EHR database.",
  },
];

const steps = [
  {
    step: "01",
    title: "Record Symptoms",
    description: "Activate the clinical voice intake. Describe patient signs, pain location, duration, and baseline vitals naturally.",
  },
  {
    step: "02",
    title: "AI Clinical Analysis",
    description: "Our localized healthcare models process the voice data, cross-reference medical literature, and formulate clinical ratings.",
  },
  {
    step: "03",
    title: "Generate EHR Report",
    description: "Review a beautifully structured PDF/EHR-compliant clinical report with active diagnosis support and recommendations.",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah M.",
    role: "Emergency Physician",
    content: "VoiceMed has completely optimized our front-desk patient sorting. The voice-to-assessment accuracy is stunning and cuts sorting times in half.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Outpatient Care Director",
    content: "The HIPAA-compliant structure and seamless PDF report exports allow our clinicians to quickly update active electronic health records.",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "Family Nurse Practitioner",
    content: "An intuitive layout combined with a highly responsive audio intake. It handles clinical jargon flawlessly and drafts solid primary assessments.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Starter Pack",
    price: "$4.99",
    description: "Ideal for quick symptoms verification",
    features: [
      "10 voice consultation credits",
      "Standard audio processing",
      "Immediate AI clinical response",
      "Printable PDF reports",
      "Secure encrypted storage",
    ],
    cta: "Purchase Pack",
    popular: false,
  },
  {
    name: "Clinician Choice",
    price: "$19.99",
    description: "Perfect for active practitioners",
    features: [
      "50 voice consultation credits",
      "High-priority voice engine",
      "Detailed clinical assessment reports",
      "Exportable EHR transcripts",
      "Dedicated email support",
      "Medication checking flags",
    ],
    cta: "Start Clinician Pack",
    popular: true,
  },
  {
    name: "Professional Plan",
    price: "$49.99",
    description: "Designed for small clinics & groups",
    features: [
      "150 voice consultation credits",
      "Ultra-low latency audio processing",
      "Advanced clinical coding logs",
      "Developer API tokens",
      "Priority customer service",
      "Multi-agent assessment suite",
    ],
    cta: "Start Pro Plan",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
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
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950">
      
      {/* Decorative Radial Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.5, 0.35],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-10 size-[450px] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.18),_transparent_60%)] blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-32 bottom-20 size-[500px] rounded-full bg-[radial-gradient(circle,_rgba(20,184,166,0.15),_transparent_60%)] blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-extrabold text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                Next-Gen Clinical Consultation Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Consult with our <br />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-450 dark:via-teal-405 dark:to-emerald-350">
                AI Voice Clinician
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto lg:mx-0 max-w-xl text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed"
            >
              Transform your patient care intake workflow. Speak naturally to dictate patient symptoms and instantly compile comprehensive diagnostic reports with actionable clinical suggestions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:shadow-lg transition active:scale-[0.98]"
              >
                <Mic className="h-4.5 w-4.5" />
                Start Voice Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-205 bg-white/40 hover:bg-slate-100/50 px-8 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/35 dark:text-slate-350 dark:hover:text-white transition active:scale-[0.98]"
              >
                <FileCheck className="h-4.5 w-4.5 text-slate-450" />
                How It Works
              </a>
            </motion.div>

            {/* Micro Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">98% Transcription Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">HIPAA Protected Records</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: 3D Console Graphic */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative w-full max-w-[420px] rounded-xl border border-slate-205 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Graphic Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intake Session Active</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Level 2
                </span>
              </div>

              {/* Pulsing Central Mic Ring */}
              <div className="flex flex-col items-center justify-center py-10 relative">
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute h-24 w-24 rounded-full bg-emerald-500/20 border border-emerald-500/35"
                />
                <motion.div 
                  animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute h-28 w-28 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                />

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                  <Mic className="h-6 w-6" />
                </div>
                
                <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200 mt-6 tracking-wide">
                  Listening to Patient Vitals...
                </span>

                {/* Animated waves */}
                <div className="flex items-center gap-1.5 h-6 mt-4">
                  {[0.85, 1.25, 0.95, 1.15, 1.05, 1.1].map((waveDuration, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: waveDuration, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-emerald-600 to-teal-400"
                    />
                  ))}
                </div>
              </div>

              {/* Patient report card snippet mock */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Live Diagnostic Structuring</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-0.5">
                    <Activity className="h-3 w-3" />
                    94% confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-350 italic">
                  &quot;...Complaining of chest pressure for 2 hours, pain index is 7 out of 10, minor dizziness...&quot;
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">Suggested: Cardiologist referral</span>
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Urgent Care</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Tag 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-20px] top-1/4 rounded-lg border border-slate-205 bg-white p-3.5 shadow-md dark:border-slate-800 dark:bg-slate-900 hidden sm:flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Decision Support</p>
                <p className="text-xs font-bold text-slate-850 dark:text-white">Active clinical guidelines</p>
              </div>
            </motion.div>

            {/* Floating Tag 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[-20px] bottom-1/4 rounded-lg border border-slate-205 bg-white p-3.5 shadow-md dark:border-slate-800 dark:bg-slate-900 hidden sm:flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-650">
                <FileCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">EHR Export</p>
                <p className="text-xs font-bold text-slate-850 dark:text-white">Structured PDF ready</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            ✨ Platform Highlights
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need for Accurate Clinical Intake
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Combining advanced speech recognition models with localized healthcare intelligence to deliver highly optimized assessments.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-xl border border-slate-205 bg-white p-6 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-750 dark:text-emerald-450 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            🔄 Simple Workflow
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three Steps to Assessment Success
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Engineered to remove charting workload, so clinicians can prioritize patient outcomes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connector line for desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 -translate-y-1/2 hidden md:block z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative z-10 rounded-xl border border-slate-205 bg-white p-6 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300"
            >
              <div className="mb-4 text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">
                {step.step}
              </div>
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            💬 Clinical Praise
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Trusted by Practitioners Globally
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-slate-205 bg-slate-50 p-6 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-450 text-yellow-450" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-350 italic leading-relaxed">
                  &quot;{t.content}&quot;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-850">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs">
                  {t.name.charAt(4)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.name}</h4>
                  <p className="text-[10px] text-slate-500">{t.role}</p>
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
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            💰 Simple Billing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pricing Plans
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            No recurring contracts, no monthly setup fees. Buy consultation credits only when you need them.
          </p>
        </div>

        <div className="">
          <PricingTable/>
        </div>

      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-955 via-teal-900 to-emerald-955 p-8 sm:p-12 text-center text-white shadow-xl border border-emerald-800/40"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_40%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight">
              Ready to Upgrade Patient Sorting?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl mx-auto leading-relaxed">
              Join thousands of clinical workers optimizing patient queues and drafting structured reports using VoiceMed AI.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 px-8 py-3.5 text-xs sm:text-sm font-bold text-emerald-950 transition active:scale-[0.98] shadow-md shadow-emerald-500/10"
              >
                Start Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-xs sm:text-sm font-bold text-white transition active:scale-[0.98]"
              >
                Sign Up Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200/80 bg-slate-50 py-16 dark:border-slate-850 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow shadow-emerald-500/10">
                <Stethoscope className="h-4.5 w-4.5 text-white" />
              </div>
              <h3 className="text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-200">
                VoiceMed AI
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Secure, HIPAA-compliant patient voice intake and structured EHR diagnostic report generators built for clinics.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Product</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#features" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Outcome Workflow</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Resources</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Developer Portal</a></li>
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Clinical Guidelines</a></li>
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">EHR Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Compliance</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">HIPAA Standards</a></li>
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/50 pt-8 md:flex-row dark:border-slate-850">
          <p className="text-[11px] text-slate-500">
            © 2026 VoiceMed AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <a href="#" className="hover:text-emerald-750 dark:hover:text-emerald-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-750 dark:hover:text-emerald-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-emerald-750 dark:hover:text-emerald-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}