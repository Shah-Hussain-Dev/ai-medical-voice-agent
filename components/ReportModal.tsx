"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Loader2 } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: any;
  onOpenChat: () => void;
}

export default function ReportModal({ isOpen, onClose, consultation, onOpenChat }: ReportModalProps) {
  const [dbData, setDbData] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    if (!isOpen || !consultation) {
      setDbData(null);
      return;
    }

    const sId = consultation.sessionId || (consultation.id?.startsWith("session-") ? consultation.id : null);
    if (!sId) {
      setDbData(null);
      return;
    }

    setLoadingDb(true);
    fetch(`/api/create-session?sessionId=${sId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && resData?.data) {
          setDbData(resData.data);
        }
      })
      .catch((err) => console.error("Error loading backend session:", err))
      .finally(() => setLoadingDb(false));
  }, [isOpen, consultation]);

  if (!consultation) return null;

  // Parser helper for report
  const parseReport = (item: any) => {
    if (item.report) {
      try {
        const parsed = typeof item.report === "string" ? JSON.parse(item.report) : item.report;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return {
            chiefComplaint: parsed.chiefComplaint || item.symptoms,
            summary: parsed.summary || "No summary available.",
            symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [item.symptoms],
            duration: parsed.duration || "Not specified",
            severity: parsed.severity || item.severity,
            medicationsMentioned: Array.isArray(parsed.medicationsMentioned) ? parsed.medicationsMentioned : [],
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [item.recommendation]
          };
        }
      } catch (e) {
        console.error("Error parsing stored report:", e);
      }
    }

    return {
      chiefComplaint: item.symptoms,
      summary: `The patient presented with complaints of: "${item.symptoms}". A telehealth consultation was conducted with ${item.doctorSpecialty || "the specialist"}.`,
      symptoms: [item.symptoms],
      duration: "Not specified",
      severity: item.severity || "Moderate",
      medicationsMentioned: [],
      recommendations: [item.recommendation || "Follow up with a physician if symptoms persist."]
    };
  };

  const mergedConsultation = {
    ...consultation,
    ...(dbData || {})
  };

  const report = parseReport(mergedConsultation);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs cursor-pointer"
          />

          {/* Report Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden font-sans text-slate-900 dark:text-white"
          >
            {/* Top Close Button (floating) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer z-20"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Scrollable Report Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Patient/Session Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Patient: {mergedConsultation.patientName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {mergedConsultation.patientAge || "30"} y/o • {mergedConsultation.patientGender || "Male"}
                  </p>
                </div>
                <div className="text-left sm:text-right text-[10px] text-slate-450 dark:text-slate-500 font-bold font-mono">
                  <div className="text-emerald-600 dark:text-emerald-500 uppercase">{mergedConsultation.doctorSpecialty}</div>
                  <div>{mergedConsultation.date} at {mergedConsultation.time}</div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <h3 className="text-[#1d63ed] text-[15px] font-extrabold uppercase tracking-wide border-b border-[#1d63ed] pb-1.5">
                  Summary
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                  {report.summary}
                </p>
              </div>

              {/* Symptoms Section */}
              <div className="space-y-2">
                <h3 className="text-[#1d63ed] text-[15px] font-extrabold uppercase tracking-wide border-b border-[#1d63ed] pb-1.5">
                  Symptoms
                </h3>
                <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-350 space-y-1 font-semibold">
                  {report.symptoms.map((symptom: string, idx: number) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>

              {/* Duration & Severity Section */}
              <div className="space-y-2">
                <h3 className="text-[#1d63ed] text-[15px] font-extrabold uppercase tracking-wide border-b border-[#1d63ed] pb-1.5">
                  Duration & Severity
                </h3>
                <div className="grid grid-cols-2 text-xs text-slate-700 dark:text-slate-350 font-semibold py-1">
                  <div>
                    <span className="font-extrabold">Duration:</span> {report.duration}
                  </div>
                  <div>
                    <span className="font-extrabold">Severity:</span> {report.severity}
                  </div>
                </div>
              </div>

              {/* Medications Section */}
              <div className="space-y-2">
                <h3 className="text-[#1d63ed] text-[15px] font-extrabold uppercase tracking-wide border-b border-[#1d63ed] pb-1.5">
                  Medications Mentioned
                </h3>
                {report.medicationsMentioned.length > 0 ? (
                  <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-350 space-y-1 font-semibold">
                    {report.medicationsMentioned.map((med: string, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-500 italic font-semibold">
                    No medications mentioned during consultation
                  </p>
                )}
              </div>

              {/* Recommendations Section */}
              <div className="space-y-2">
                <h3 className="text-[#1d63ed] text-[15px] font-extrabold uppercase tracking-wide border-b border-[#1d63ed] pb-1.5">
                  Recommendations
                </h3>
                <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-350 space-y-1.5 font-semibold">
                  {report.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                  This report was generated by an AI Medical Assistant for informational purposes
                </p>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                Chat History
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-300"
              >
                Close Report
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
