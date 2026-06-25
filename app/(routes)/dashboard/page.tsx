"use client";

import React, { useContext, useState, useEffect } from "react";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ArrowRight, 
  History, 
  Coins, 
  Activity, 
  Plus,
  CheckCircle,
  FileText,
  Stethoscope,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AIDoctorAgents } from "@/shared/list";
import StartConsultationModal from "./_components/StartConsultationModal";
import ReportBottomSheet from "@/components/ReportBottomSheet";
import ReportModal from "@/components/ReportModal";

const DEFAULT_CONSULTATIONS = [
  {
    id: "consult-001",
    date: "Jun 02, 2026",
    time: "10:24 AM",
    duration: "2m 45s",
    patientName: "Patient A-28",
    patientAge: "45",
    patientGender: "Male",
    symptoms: "Acute chest pressure, radiating to left arm, mild diaphoresis, shortness of breath.",
    severity: "Critical",
    status: "Completed",
    recommendation: "Immediate emergency department evaluation (Severity Level 1).",
  },
  {
    id: "consult-002",
    date: "May 29, 2026",
    time: "4:12 PM",
    duration: "1m 18s",
    patientName: "Patient B-91",
    patientAge: "32",
    patientGender: "Female",
    symptoms: "Productive cough, low-grade fever (100.2 F), wheezing, fatigue for 3 days.",
    severity: "Moderate",
    status: "Completed",
    recommendation: "Outpatient clinical visit within 24-48 hours. Supportive respiratory care.",
  },
  {
    id: "consult-003",
    date: "May 28, 2026",
    time: "09:05 AM",
    duration: "3m 02s",
    patientName: "Patient C-15",
    patientAge: "28",
    patientGender: "Female",
    symptoms: "Sharp localized pain in lower right quadrant of abdomen, nauseous, pain increases with motion.",
    severity: "High",
    status: "Completed",
    recommendation: "Urgent care assessment needed for rule-out appendicitis.",
  }
];

// Vector SVG Medical Consultation Illustration
const MedicalIllustration = () => {
  return (
    <svg
      width="240"
      height="180"
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto select-none drop-shadow-md transition-all duration-300 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="tabletGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="doctorGownGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Glow effect */}
      <circle cx="120" cy="85" r="65" fill="url(#glowGrad)" filter="blur(15px)" />

      {/* Isometric Tablet shadow */}
      <path d="M 46 122 L 136 78 L 148 138 L 58 182 Z" fill="#cbd5e1" opacity="0.35" className="dark:fill-slate-950" />

      {/* Tablet Border Frame */}
      <path
        d="M 40 42 L 140 22 C 143 21, 146 24, 146 27 L 138 122 C 138 125, 135 127, 132 127 L 32 147 C 29 148, 26 145, 26 142 L 34 47 C 34 44, 37 42, 40 42 Z"
        fill="url(#tabletGrad)"
        stroke="#475569"
        strokeWidth="2.5"
      />

      {/* Tablet Screen */}
      <path
        d="M 46 48 L 134 32 C 136 32, 138 33, 138 35 L 131 116 C 131 118, 129 119, 127 119 L 39 135 C 37 135, 35 134, 35 132 L 42 51 C 42 49, 44 48, 46 48 Z"
        fill="#ffffff"
        className="dark:fill-slate-800"
      />

      {/* Grid Pattern inside Screen */}
      <path d="M 50 60 L 126 46" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-700/50" />
      <path d="M 47 78 L 123 64" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-700/50" />
      <path d="M 44 96 L 120 82" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-700/50" />

      {/* Doctor Video Avatar on Screen */}
      <ellipse cx="84" cy="74" rx="19" ry="17" fill="url(#avatarGrad)" />
      
      {/* Doctor shape inside avatar */}
      <path d="M 70 88 C 70 78, 98 78, 98 88 Z" fill="#ccfbf1" />
      <path d="M 80 74 L 80 88 M 88 74 L 88 88" stroke="#0d9488" strokeWidth="1.5" />
      <circle cx="84" cy="69" r="7" fill="#fed7aa" />
      <path d="M 79 72 C 79 80, 89 80, 89 72" stroke="#64748b" strokeWidth="0.8" fill="none" />
      <path d="M 77 67 C 77 59, 91 59, 91 67 Z" fill="#1e293b" />

      {/* Green Call Status Button */}
      <path
        d="M 74 104 L 99 100 C 101 100, 102 101, 102 103 L 100 110 C 100 112, 98 113, 96 113 L 71 117 C 69 117, 68 116, 68 114 L 70 107 C 70 105, 72 104, 74 104 Z"
        fill="#10b981"
      />
      <circle cx="76" cy="110" r="1.5" fill="#ffffff" />
      <path d="M 81 108 L 94 106" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

      {/* Standing Doctor Character on Right */}
      {/* Legs & Shoes */}
      <path d="M 172 110 L 172 155 M 180 110 L 180 155" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <path d="M 168 155 L 173 155 M 177 155 L 182 155" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

      {/* Coat Body */}
      <path
        d="M 160 76 C 160 66, 192 66, 192 76 L 188 115 L 164 115 Z"
        fill="url(#doctorGownGrad)"
      />

      {/* Character Head */}
      <circle cx="176" cy="56" r="9.5" fill="#fbcfe8" />
      <path d="M 167 53 C 167 44, 185 44, 185 53 Z" fill="#475569" />

      {/* Arm pointing to tablet */}
      <path
        d="M 164 78 L 146 83 C 144 84, 143 86, 144 88 L 145 90 C 146 91, 148 91, 149 90 L 164 83 Z"
        fill="#fbcfe8"
        stroke="#4f46e5"
        strokeWidth="1.2"
      />
      <circle cx="143" cy="86" r="2.2" fill="#fbcfe8" />

      {/* Left Arm hanging down */}
      <path d="M 188 78 L 193 103 L 188 103 Z" fill="#4338ca" />
      <circle cx="193" cy="105" r="2.2" fill="#fbcfe8" />

      {/* ECG waveform floating */}
      <path
        d="M 140 45 Q 144 35, 147 45 T 152 25 T 157 55 T 162 45"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="animate-pulse"
      />

      {/* Plus/cross decor */}
      <path d="M 205 38 L 211 38 M 208 35 L 208 41" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      <path d="M 33 24 L 37 24 M 35 22 L 35 26" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

interface Consultation {
  id: string;
  date: string;
  time: string;
  duration: string;
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  symptoms: string;
  severity: string;
  status: string;
  recommendation: string;
  doctorSpecialty?: string;
  doctorVoice?: string;
  doctorImage?: string;
}

interface DoctorAgent {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
}

export default function DashboardHome() {
  const { user, isLoaded } = useUser();
  const {has} = useAuth()
  const paidUser = has({plan:'pro'})
  
  const userDetails = useContext(UserDetailsContext);

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Modal creation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  
  // Selected Doctor Agent state
  const [selectedAgent, setSelectedAgent] = useState<DoctorAgent>(AIDoctorAgents[0]);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleConsultAgent = (agent: DoctorAgent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };


  useEffect(() => {
    // Load from local storage or set default mock data
    const stored = localStorage.getItem("dashboard_consultations");
    if (stored) {
      setConsultations(JSON.parse(stored));
    } else {
      setConsultations(DEFAULT_CONSULTATIONS);
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchDbSessions = async () => {
      try {
        const response = await fetch("/api/create-session");
        const resData = await response.json();
        if (resData?.success && Array.isArray(resData?.data)) {
          const dbSessions = resData.data.map((dbSession: any) => {
            let notesObj: any = {};
            try {
              notesObj = typeof dbSession.notes === "string" ? JSON.parse(dbSession.notes) : dbSession.notes;
            } catch (e) {
              console.error("Error parsing session notes:", e);
            }

            let reportObj: any = {};
            try {
              reportObj = typeof dbSession.report === "string" ? JSON.parse(dbSession.report) : dbSession.report;
            } catch (e) {
              // not JSON or parsing failed
            }

            const now = new Date(dbSession.createdOn || Date.now());
            const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
            const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return {
              id: dbSession.sessionId,
              sessionId: dbSession.sessionId,
              date: dateStr,
              time: timeStr,
              duration: notesObj.duration || "N/A",
              patientName: notesObj.patientName || "Anonymous",
              patientAge: notesObj.patientAge || "",
              patientGender: notesObj.patientGender || "",
              symptoms: notesObj.symptoms || "",
              severity: notesObj.severity || "Moderate",
              status: "Completed",
              recommendation: reportObj?.recommendations?.[0] || notesObj.recommendation || "Observe symptoms closely and follow up.",
              doctorSpecialty: notesObj.doctorSpecialty || dbSession.selectedDoctor?.specialist || "General Physician",
              doctorImage: notesObj.doctorImage || dbSession.selectedDoctor?.image || "/images/doctor1.png",
              report: dbSession.report || null,
              conversation: dbSession.conversation || []
            };
          });

          setConsultations(dbSessions);
          localStorage.setItem("dashboard_consultations", JSON.stringify(dbSessions));
        }
      } catch (err) {
        console.error("Failed to sync consultations with backend DB:", err);
      }
    };

    fetchDbSessions();
  }, [isLoaded, user]);

  useEffect(() => {
    if (userDetails) {
      const savedCredits = localStorage.getItem("user_credits");
      if (savedCredits === null) {
        localStorage.setItem("user_credits", String(userDetails.credits));
      }
    }
  }, [userDetails]);

  const saveConsultations = (items: Consultation[]) => {
    setConsultations(items);
    localStorage.setItem("dashboard_consultations", JSON.stringify(items));
  };

  // Switchers/Developer controls to show states easily
  const handleClearAll = () => {
    saveConsultations([]);
  };

  const handleResetDemo = () => {
    saveConsultations(DEFAULT_CONSULTATIONS);
  };


  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-450 border-rose-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "Moderate":
        return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
      default:
        return "bg-slate-500/10 text-slate-750 dark:text-slate-400 border-slate-500/20";
    }
  };


  if (!isClient) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Activity className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Header section matching mockup requirements */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review past voice consultation reports, check credits, and perform instant AI triage assessments.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick simulator controls */}
            <button 
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-colors shadow-xs active:scale-[0.98]"
              title="Reload Mock Data"
            >
              Reset Demo
            </button>
            <button 
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-455 transition-colors shadow-xs active:scale-[0.98]"
              title="Clear All (Show Empty State)"
            >
              Clear All
            </button>

            <button 
              disabled={!paidUser && consultations.length >= 1}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4.5 w-4.5" />
              Consult With Doctor
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-md border border-slate-800/40 mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.15),_transparent_40%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-450 animate-ping" />
                Online Portal Active
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Hello, {isLoaded && user ? user.firstName : "Doctor"}!
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/80 max-w-xl">
                VoiceMed AI is ready to assess patients, transcribe clinical symptoms, and compile comprehensive triage report suggestions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link 
                href="/dashboard/history" 
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <History className="h-4 w-4" />
                Past Consultations
              </Link>
              <Link 
                href="/dashboard/billing" 
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all active:scale-[0.98] shadow-sm"
              >
                <Coins className="h-4 w-4" />
                Refill Credits
              </Link>
            </div>
          </div>
        </div>


        {/* Main Content (Full Width) */}
        <div className="space-y-10">
            <AnimatePresence mode="wait">
              {consultations.length === 0 ? (
                // Empty State matching mockup perfectly with enhanced UI/UX
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center py-14 px-6 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl shadow-xs flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="mb-4">
                    <MedicalIllustration />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 mb-2">
                    No Recent Consultations
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-450 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                    It looks like you haven&apos;t consulted with any doctors yet.
                  </p>
                  
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    disabled={!paidUser && consultations.length >= 1}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    Start a Consultation
                  </button>
                </motion.div>
              ) : (
                // Past 3 History List
                <motion.div
                  key="history-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-teal-800 dark:text-teal-405 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-teal-650 dark:text-teal-400" />
                      Past 3 History List
                    </h3>
                    <Link 
                      href="/dashboard/history"
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-855 dark:text-teal-450 dark:hover:text-teal-350 transition-colors"
                    >
                      View All History 
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Simple responsive grid section that looks good */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {consultations.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 hover:border-slate-350 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[410px] h-full"
                      >
                        {/* Top severity indicator ribbon */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                          item.severity === "Critical" ? "bg-rose-500" :
                          item.severity === "High" ? "bg-amber-500" :
                          item.severity === "Moderate" ? "bg-teal-500" :
                          "bg-slate-400"
                        }`} />

                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-1">
                              <span>{item.id.toUpperCase()}</span>
                              <div className="flex items-center gap-1.5">
                                <span>{item.date.toUpperCase()}</span>
                                <span>•</span>
                                <span>{item.duration.toUpperCase()}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                                <span className="truncate">{item.patientName}</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getSeverityStyles(item.severity)}`}>
                                  {item.severity}
                                </span>
                              </h4>
                              {(item.patientAge || item.patientGender) && (
                                <div className="text-[11px] text-slate-455 dark:text-slate-550 font-semibold mt-1 flex items-center gap-1">
                                  <span>Patient Info:</span>
                                  <span className="text-slate-655 dark:text-slate-300">{item.patientGender || "N/A"}</span>
                                  {item.patientAge && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-655 dark:text-slate-300">{item.patientAge} yrs</span>
                                    </>
                                  )}
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-emerald-705 dark:text-emerald-450 flex items-center gap-1.5 mt-2.5 uppercase tracking-wider">
                                <Activity className="h-3.5 w-3.5" />
                                AI specialist: {item.doctorSpecialty?.toUpperCase() || "GENERAL PHYSICIAN"}
                              </span>
                            </div>

                            {/* Symptoms transcript box */}
                            <div className="bg-slate-55 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center min-h-[90px]">
                              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                Voice Intake Transcript
                              </p>
                              <p className="text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed font-semibold">
                                &quot;{item.symptoms}&quot;
                              </p>
                            </div>

                            {/* Recommendations */}
                            <div className="flex items-start gap-2 pt-1.5">
                              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-455 mt-0.5 shrink-0" />
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wider block">
                                  AI Recommendation
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                  {item.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setSelectedConsultation(item);
                                setIsReportOpen(true);
                              }}
                              className="flex-1 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all justify-center cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Report
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedConsultation(item);
                                setIsChatOpen(true);
                              }}
                              className="flex-1 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-800/80 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all justify-center cursor-pointer"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Chat History
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Doctor Specialist Agents Grid */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-emerald-650 animate-pulse" />
                    AI Specialist Doctors Agent
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                    Consult with expert AI medical profiles tailored for specific healthcare domains.
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-455 border border-emerald-500/20 dark:border-emerald-850/50 rounded-full px-3 py-1 text-xs font-bold">
                  {AIDoctorAgents.length} Agents
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {AIDoctorAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="group flex flex-col space-y-3"
                  >
                    {/* Doctor Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm shrink-0">
                      {!imageError[agent.id] ? (
                        <img
                          src={agent.image.startsWith('.') ? agent.image.substring(1) : agent.image}
                          alt={agent.specialist}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={() => setImageError(prev => ({ ...prev, [agent.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 text-3xl font-extrabold">
                          {agent.specialist.charAt(0)}
                        </div>
                      )}
                      
                      {/* Subscription Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {agent.subscriptionRequired ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white shadow-xs">Pro</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">Free</span>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="space-y-1 flex-1 flex flex-col">
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {agent.specialist}
                      </h4>
                      <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                        {agent.description}
                      </p>
                    </div>

                    {/* Doctor Call Button */}
                    <button
                      disabled={!paidUser && agent.subscriptionRequired}
                      onClick={() => handleConsultAgent(agent)}
                      className="w-full bg-[#0f172a] hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      Start Consultation
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Dynamic Simulated Consultation Dialog */}
        <AnimatePresence>
          {isModalOpen && (
            <StartConsultationModal
              onClose={() => setIsModalOpen(false)}
              selectedAgent={selectedAgent}
            />
          )}
        </AnimatePresence>
      </main>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        consultation={selectedConsultation}
        onOpenChat={() => {
          setIsReportOpen(false);
          setIsChatOpen(true);
        }}
      />

      <ReportBottomSheet
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        consultation={selectedConsultation}
      />

      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 py-16 dark:border-slate-850 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow shadow-emerald-500/10">
                <Stethoscope className="h-4.5 w-4.5 text-white" />
              </div>
              <h3 className="text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-200">
                VoiceMed AI
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Secure, HIPAA-compliant patient voice intake and structured EHR diagnostic report generators built for clinics.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Product</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/dashboard" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/history" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">History Log</Link></li>
              <li><Link href="/dashboard/billing" className="text-xs text-slate-550 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-450 transition-colors">Refill Credits</Link></li>
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
