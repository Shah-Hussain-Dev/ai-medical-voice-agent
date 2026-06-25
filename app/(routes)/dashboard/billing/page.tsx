"use client";

import React, { useContext } from "react";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { 
  Check, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";
import { PricingTable } from "@clerk/nextjs";

const pricingPackages = [
  {
    id: "pkg-bronze",
    name: "Starter Pack",
    credits: 10,
    price: "$4.99",
    savings: null,
    popular: false,
    description: "Great for quick symptoms check and basic consultation.",
    features: [
      "10 consultations credits",
      "Standard audio processing",
      "Immediate AI clinical response",
      "Printable PDF reports",
      "HIPAA-compliant secure storage",
    ],
  },
  {
    id: "pkg-silver",
    name: "Clinician Choice",
    credits: 50,
    price: "$19.99",
    savings: "Save 20%",
    popular: true,
    description: "Perfect for active users needing regular assessments.",
    features: [
      "50 consultations credits",
      "High-priority voice processing",
      "Detailed clinical assessment reports",
      "Exportable EHR transcripts",
      "Dedicated email support",
      "Medication check warnings",
    ],
  },
  {
    id: "pkg-gold",
    name: "Professional Plan",
    credits: 150,
    price: "$49.99",
    savings: "Save 33%",
    popular: false,
    description: "Designed for small clinics or medical practitioners.",
    features: [
      "150 consultations credits",
      "Ultra-low latency audio engine",
      "Advanced clinical coding suggestions",
      "API access (Beta)",
      "Priority customer service",
      "Multi-agent collaborative logs",
    ],
  },
];

const faqs = [
  {
    q: "How do voice consultation credits work?",
    a: "Every time you start a voice session, process symptoms, and receive a diagnosis or assessment report, 1 credit is consumed. If a session fails or is canceled before analysis, no credits are deducted.",
  },
  {
    q: "Do my voice credits expire?",
    a: "No! All credits purchased in the dashboard remain in your account indefinitely and do not expire as long as your account is active.",
  },
  {
    q: "Is payment processing secure?",
    a: "Yes, we use Stripe to securely process all payments. VoiceMed AI does not store or process your credit card details on our servers.",
  },
];

export default function BillingPage() {
  const userDetails = useContext(UserDetailsContext);

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          Pricing Plans
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Choose Your Credit Pack
        </h1>
        <p className="text-base text-slate-500 mt-2 max-w-2xl mx-auto">
          VoiceMed AI operates on a simple pay-as-you-go credit system. Purchase packs only when you need them. No sneaky monthly subscriptions.
        </p>

        {/* Current user balance highlight */}
        {userDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mt-6 bg-slate-100/80 dark:bg-slate-800/60 p-2 pl-4 pr-3 rounded-full border border-slate-200/60 dark:border-slate-700/50 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350 text-sm font-semibold">
              <Coins className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              Current Balance:
            </div>
            <div className="bg-emerald-650 text-dark px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {userDetails.credits} Credits Available
            </div>
          </motion.div>
        )}
      </div>

      {/* Pricing Grid */}
      <div className=" mb-16">
        {/* {pricingPackages.map((pkg, idx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 flex flex-col justify-between transition-all duration-300 ${
              pkg.popular 
                ? "border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20 scale-[1.02] md:translate-y-[-4px]" 
                : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
          
            {pkg.savings && (
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                {pkg.savings}
              </span>
            )}

          
            {pkg.popular && (
              <span className="absolute -top-3 left-6 bg-slate-950 dark:bg-white dark:text-slate-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{pkg.name}</h3>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                  <Coins className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</span>
                <span className="text-xs text-slate-555 font-semibold uppercase tracking-wider">one-time</span>
              </div>

              <p className="text-xs font-bold text-emerald-650 dark:text-emerald-400 mb-4 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Adds +{pkg.credits} Consultation Credits
              </p>

              <p className="text-sm text-slate-550 mb-6">{pkg.description}</p>

              <hr className="border-slate-100 dark:border-slate-850 mb-6" />

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-650 dark:text-slate-350">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className={`w-full py-3 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98] ${
              pkg.popular 
                ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-500/10" 
                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-white border border-slate-200/80 dark:border-slate-750"
            }`}>
              Purchase Credits
            </button>
          </motion.div>
        ))} */}

           <PricingTable/>
      </div>

      {/* HIPAA Trust Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 rounded-xl p-6 text-white mb-16 shadow-md border border-emerald-800/40 relative overflow-hidden flex flex-col sm:flex-row items-center gap-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),_transparent_40%)]" />
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-400/30 shrink-0 relative z-10">
          <ShieldCheck className="h-6 w-6 text-emerald-350" />
        </div>
        <div className="space-y-1 relative z-10 text-center sm:text-left">
          <h4 className="text-base font-bold tracking-tight">Enterprise Compliance & Security</h4>
          <p className="text-xs text-emerald-200 max-w-2xl">
            VoiceMed AI is fully HIPAA-compliant. All consultation voice data and generated reports are encrypted in transit and at rest. We never share patient health records.
          </p>
        </div>
        <div className="sm:ml-auto shrink-0 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 border border-emerald-400/40 rounded-full px-3 py-1.5 text-emerald-350">
            HIPAA COMPLIANT
          </span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 text-center mb-6 flex items-center justify-center gap-1.5">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-xl shadow-sm">
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{faq.q}</h5>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
