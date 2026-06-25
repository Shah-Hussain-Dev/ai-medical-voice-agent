"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Loader2 } from "lucide-react";

interface ReportBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: any;
}

export default function ReportBottomSheet({ isOpen, onClose, consultation }: ReportBottomSheetProps) {
  const [dbData, setDbData] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !consultation) {
      setDbData(null);
      return;
    }

    // Query session by sessionId if available, otherwise check if id starts with 'session-'
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

  // Parser helper for conversation
  const parseConversation = (conv: any): any[] => {
    if (!conv) return [];
    if (Array.isArray(conv)) return conv;
    if (typeof conv === "string") {
      try {
        const parsed = JSON.parse(conv);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "string") {
          const parsed2 = JSON.parse(parsed);
          if (Array.isArray(parsed2)) return parsed2;
        }
      } catch (e) {
        console.error("Error parsing conversation:", e);
      }
    }
    return [];
  };

  const mergedConsultation = {
    ...consultation,
    ...(dbData || {})
  };

  const conversation = parseConversation(mergedConsultation.conversation);

  useEffect(() => {
    if (isOpen && conversation.length > 0) {
      const timer = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, conversation.length]);

  if (!consultation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs cursor-pointer"
          />

          {/* Bottom Sheet container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[2.5rem] border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[80vh] z-10 overflow-hidden font-sans text-slate-900 dark:text-white"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-150 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/40 shrink-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Doctor Avatar */}
                <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 shrink-0">
                  <img
                    src={mergedConsultation.doctorImage && mergedConsultation.doctorImage.startsWith(".") ? mergedConsultation.doctorImage.substring(1) : mergedConsultation.doctorImage || "/images/doctor1.png"}
                    alt={mergedConsultation.doctorSpecialty}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Consultation Meta */}
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{mergedConsultation.doctorSpecialty || "Medical Specialist AI"}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20">
                      Doctor
                    </span>
                  </h3>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    Patient: <span className="text-slate-800 dark:text-slate-200">{mergedConsultation.patientName}</span>
                    <span className="mx-1.5">•</span>
                    <span>{mergedConsultation.date} at {mergedConsultation.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {loadingDb && (
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>SYNCING DB...</span>
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Feed Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {loadingDb && conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-emerald-650 animate-spin" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Fetching database records...
                  </p>
                </div>
              ) : conversation.length > 0 ? (
                <div className="space-y-4">
                  {conversation.map((msg: any, idx: number) => {
                    const isDoc = msg.sender === "doctor";
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex flex-col ${isDoc ? "items-start" : "items-end"} space-y-1`}
                      >
                        {/* Label */}
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wide">
                            {msg.senderName}
                          </span>
                          {msg.time && (
                            <span className="text-[8px] text-slate-450 dark:text-slate-655 font-semibold">
                              {msg.time}
                            </span>
                          )}
                        </div>
                        
                        {/* Bubble */}
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isDoc 
                            ? "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200 dark:border-slate-850" 
                            : "bg-emerald-600 text-white rounded-tr-xs shadow-xs"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
                  <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      No Dialogue Log
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      No conversation transcription recorded for this session.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-300"
              >
                Close Chat
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
