"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sparkles, X, Info, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import axios from "axios";
import Loader from "@/components/ui/Loader";

export interface DoctorAgent {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
}

interface StartConsultationModalProps {
  onClose: () => void;
  selectedAgent: DoctorAgent | null;
}

export default function StartConsultationModal({
  onClose,
  selectedAgent,
}: StartConsultationModalProps) {
  const router = useRouter();

  const [patientNameInput, setPatientNameInput] = useState("");
  const [patientAgeInput, setPatientAgeInput] = useState("");
  const [patientGenderInput, setPatientGenderInput] = useState("Male");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [severityInput, setSeverityInput] = useState("Moderate");
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>([]);
  const [step, setStep] = useState(1);
  const [chosenDoctor, setChosenDoctor] = useState<DoctorAgent | null>(selectedAgent);

  const closeModal = () => {
    onClose();
  };

  const handleNext = async (e?: React.FormEvent) => {
    try {
      setLoading(true);
      if (e) e.preventDefault();
      const result = await axios.post("/api/suggest-doctors", { notes: symptomsInput });
      console.log("result", result.data);
      const suggestions = result.data.suggestedDoctors || [];
      setSuggestedDoctors(suggestions);
      
      // Auto-select the first suggested doctor or fall back to the selectedAgent
      if (suggestions.length > 0) {
        const originalMatch = selectedAgent ? suggestions.find((d: any) => d.id === selectedAgent.id) : null;
        setChosenDoctor(originalMatch || suggestions[0]);
      } else {
        setChosenDoctor(selectedAgent);
      }
      setStep(2);
    } catch (error) {
      console.error("error fetching matches", error);
      setChosenDoctor(selectedAgent);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (doctor: DoctorAgent) => {
    if (!patientNameInput.trim() || !symptomsInput.trim() || !doctor) return;

    const activeSession = {
      patientName: patientNameInput,
      patientAge: patientAgeInput,
      patientGender: patientGenderInput,
      symptoms: symptomsInput,
      severity: severityInput,
      doctorSpecialty: doctor.specialist,
      doctorVoice: doctor.voiceId,
      doctorImage: doctor.image,
    };
    localStorage.setItem("current_active_session", JSON.stringify(activeSession));

    const sessionId = `session-${Math.random().toString(36).substring(2, 11)}`;
    try {
      setLoading(true);
      await axios.post("/api/create-session", {
        sessionId,
        notes: activeSession,
        conversation: [],
        report: {},
        selectedDoctor: doctor
      });
      onClose();
      router.push(`/medical-agent/${sessionId}`);
    } catch (err) {
      console.error("Error creating session in database:", err);
      // Fallback: continue even if DB insert fails to ensure user experience
      onClose();
      router.push(`/medical-agent/${sessionId}`);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAgent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-xl flex flex-col text-slate-950 dark:text-white"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">
                AI Doctor
              </h3>
              <p className="text-[11px] text-slate-455 dark:text-slate-400 -mt-0.5">
                {step === 1 ? `Intake with ${selectedAgent.specialist}` : "Matched AI Specialists"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              {/* Selected Doctor Agent Info */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 rounded-xl mb-2">
                {!imageError[selectedAgent.id] ? (
                  <img
                    src={selectedAgent.image.startsWith('.') ? selectedAgent.image.substring(1) : selectedAgent.image}
                    alt={selectedAgent.specialist}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-750 shadow-xs shrink-0"
                    onError={() => setImageError(prev => ({ ...prev, [selectedAgent.id]: true }))}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
                    {selectedAgent.specialist.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                    Consulting with {selectedAgent.specialist} Agent
                    {selectedAgent.subscriptionRequired ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-550/15">Pro</span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20">Free</span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">
                    Voice model: <span className="font-semibold text-slate-650 capitalize">{selectedAgent.voiceId}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block mb-1">
                  Patient / Consultation Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patient A-28"
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    min="0"
                    max="120"
                    value={patientAgeInput}
                    onChange={(e) => setPatientAgeInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block mb-1">
                    Patient Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Male", "Female", "Other"].map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => setPatientGenderInput(gen)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          patientGenderInput === gen
                            ? "border-emerald-600 bg-emerald-500/10 text-emerald-700"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350"
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block mb-1">
                  Severity Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Low", "Moderate", "High", "Critical"].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverityInput(sev)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        severityInput === sev
                          ? sev === "Critical" ? "border-rose-600 bg-rose-500/10 text-rose-700"
                            : sev === "High" ? "border-amber-600 bg-amber-500/10 text-amber-700"
                            : sev === "Moderate" ? "border-teal-650 bg-teal-500/10 text-teal-700"
                            : "border-slate-655 bg-slate-500/10 text-slate-700"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block mb-1">
                  Add Symptoms Details
                </label>
                <textarea
                  placeholder="Describe patient vital details and symptomatic issues..."
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-450 shrink-0" />
                <p className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-400 leading-tight">
                  Starting this simulated intake consultation automatically consumes <strong>1 credit</strong>.
                </p>
              </div>

              <div className="flex gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-655 dark:text-slate-350 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!patientNameInput.trim() || !symptomsInput.trim() || loading}
                  className="flex-1 py-3 rounded-xl text-white bg-[#0f172a] hover:bg-slate-800 disabled:opacity-50 text-xs font-bold transition-all active:scale-[0.98] shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2
                    className="animate-spin"
                    />
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                    AI Doctor Matches
                  </h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-normal">
                    Based on the symptoms described, we recommend consulting with one of the following matched specialists:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1">
                {suggestedDoctors.map((doc) => {
                  const isChosen = chosenDoctor?.id === doc.id;
                  return (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setChosenDoctor(doc)}
                      className={`p-3 border rounded-xl flex items-center gap-3.5 cursor-pointer transition-all ${
                        isChosen
                          ? "border-emerald-600 dark:border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {/* Doctor Image / Fallback */}
                      {!imageError[doc.id] ? (
                        <img
                          src={doc.image.startsWith('.') ? doc.image.substring(1) : doc.image}
                          alt={doc.specialist}
                          className="h-11 w-11 rounded-lg object-cover border border-slate-200 dark:border-slate-750 shadow-xs shrink-0"
                          onError={() => setImageError(prev => ({ ...prev, [doc.id]: true }))}
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                          {doc.specialist.charAt(0)}
                        </div>
                      )}

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 justify-between">
                          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
                            {doc.specialist}
                          </h4>
                          {doc.subscriptionRequired ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/15 shrink-0">Pro</span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20 shrink-0">Free</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {doc.description}
                        </p>
                      </div>

                      {/* Radio-like indicator */}
                      <div className="shrink-0">
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                          isChosen
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 dark:border-slate-700"
                        }`}>
                          {isChosen && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Agent prompt preview */}
              {chosenDoctor && (
                <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                    Agent specialty focus
                  </p>
                  <p className="text-[10px] text-slate-650 dark:text-slate-350 italic leading-relaxed">
                    "{chosenDoctor.description}"
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-655 dark:text-slate-350 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Symptoms
                </button>
                <button
                  type="button"
                  onClick={() => chosenDoctor && handleStartConsultation(chosenDoctor)}
                  disabled={!chosenDoctor || loading}
                  className="flex-1 py-3 rounded-xl text-white bg-[#0f172a] hover:bg-slate-800 disabled:opacity-50 text-xs font-bold transition-all active:scale-[0.98] shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      Start Consultation
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
