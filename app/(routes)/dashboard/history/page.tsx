"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Volume2, 
  FileText,
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";
import { motion } from "motion/react";

// Mock data for clinical triage history
const MOCK_HISTORY = [
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
  },
  {
    id: "consult-004",
    date: "May 25, 2026",
    time: "11:50 AM",
    duration: "0m 55s",
    patientName: "Patient D-08",
    patientAge: "19",
    patientGender: "Male",
    symptoms: "Mild seasonal allergies, nasal congestion, sneezing, itchy eyes.",
    severity: "Low",
    status: "Completed",
    recommendation: "Over-the-counter antihistamines and symptom tracking.",
  },
];

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

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [history, setHistory] = useState<Consultation[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      const stored = localStorage.getItem("dashboard_consultations");
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory(MOCK_HISTORY);
      }
    }, 0);
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterSeverity === "All" || item.severity === filterSeverity;
    
    return matchesSearch && matchesFilter;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "Moderate":
        return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Activity className="h-8 w-8 text-emerald-650 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Consultation History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past voice consultation recordings, AI analysis reports, and clinical recommendations.
          </p>
        </div>
        
        {/* Status count pills */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-2.5 text-center shadow-sm">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Runs</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{history.length}</span>
          </div>
          <div className="rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-2.5 text-center shadow-sm">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Severity</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-455">
              {history.filter((item) => item.severity === "Critical").length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search symptoms, assessments, or patient keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm placeholder-slate-450 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-450 hidden sm:block" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-350 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Severity</option>
            <option value="High">High Severity</option>
            <option value="Moderate">Moderate Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200/80 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-900/50">
            <Activity className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No results found</p>
            <p className="text-xs text-slate-400 mt-1 px-4 max-w-sm mx-auto">
              We couldn&apos;t find any medical history matching your search query or filters.
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Highlight ribbon based on severity */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                item.severity === "Critical" ? "bg-rose-500" :
                item.severity === "High" ? "bg-amber-500" :
                item.severity === "Moderate" ? "bg-teal-500" :
                "bg-slate-400"
              }`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      {item.id}
                    </span>
                    <span className="text-slate-300 dark:text-slate-750 font-normal">|</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {item.date} at {item.time}
                    </div>
                    <span className="text-slate-300 dark:text-slate-750 font-normal">|</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {item.duration}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    {item.patientName}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityStyles(item.severity)}`}>
                      {item.severity}
                    </span>
                  </h3>
                  {(item.patientAge || item.patientGender) && (
                    <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <span>Patient Info:</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.patientGender || "N/A"}</span>
                      {item.patientAge && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 dark:text-slate-300">{item.patientAge} yrs</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-850/45 p-3 rounded-lg border border-slate-100 dark:border-slate-850">
                    <p className="text-sm font-semibold text-slate-505 text-xs mb-1 uppercase tracking-wider">
                      Patient Voice Intake Transcript
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-350 italic">
                      &quot;{item.symptoms}&quot;
                    </p>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wider block">
                        AI Clinical Report Suggestion
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-450 mt-0.5">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side buttons */}
                <div className="flex sm:flex-row lg:flex-col items-center justify-end gap-2.5 border-t lg:border-t-0 border-slate-100 dark:border-slate-850 pt-4 lg:pt-0 shrink-0">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-750 transition-colors w-full sm:w-auto text-center justify-center cursor-pointer">
                    <Volume2 className="h-3.5 w-3.5 text-slate-500" />
                    Play Audio
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm transition-all w-full sm:w-auto text-center justify-center cursor-pointer">
                    <FileText className="h-3.5 w-3.5" />
                    Full Report
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
