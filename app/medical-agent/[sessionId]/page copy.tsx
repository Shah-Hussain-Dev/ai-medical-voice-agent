"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  ScreenShare, 
  ShieldCheck, 
  Clock, 
  Send, 
  ArrowLeft, 
  Activity,
  MessageSquare,
  User,
  Info,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import Vapi from '@vapi-ai/web';
interface SessionData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  symptoms: string;
  severity: string;
  doctorSpecialty: string;
  doctorVoice: string;
  doctorImage: string;
}

interface Message {
  id: string;
  sender: "doctor" | "patient";
  senderName: string;
  text: string;
  time: string;
}

export default function TelehealthRoom() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on document class or local storage
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") || 
                   document.body.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  // Local state for active session data
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Call Control states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  // Chat/Transcription states
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState<{
    role: "assistant" | "user";
    text: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSessionDetails = async () => {
    try {
      const response = await axios.get(`/api/create-session?sessionId=${sessionId}`);
      const sessionRecord = response.data?.data;
      if (sessionRecord) {
        let parsedNotes: any = null;
        try {
          parsedNotes = typeof sessionRecord.notes === "string" ? JSON.parse(sessionRecord.notes) : sessionRecord.notes;
        } catch (e) {
          console.error("Failed to parse session notes:", e);
        }

        if (parsedNotes && typeof parsedNotes === "object") {
          setSessionData({
            patientName: parsedNotes.patientName || "Patient Intake",
            patientAge: parsedNotes.patientAge || "30",
            patientGender: parsedNotes.patientGender || "Male",
            symptoms: parsedNotes.symptoms || "Unspecified symptoms",
            severity: parsedNotes.severity || "Moderate",
            doctorSpecialty: parsedNotes.doctorSpecialty || (sessionRecord.selectedDoctor?.specialist || "General Physician"),
            doctorVoice: parsedNotes.doctorVoice || (sessionRecord.selectedDoctor?.voiceId || "will"),
            doctorImage: parsedNotes.doctorImage || (sessionRecord.selectedDoctor?.image || "/images/doctor1.png"),
          });
        } else {
          setSessionData({
            patientName: "Patient Intake",
            patientAge: "30",
            patientGender: "Male",
            symptoms: sessionRecord.notes || "Unspecified symptoms",
            severity: "Moderate",
            doctorSpecialty: sessionRecord.selectedDoctor?.specialist || "General Physician",
            doctorVoice: sessionRecord.selectedDoctor?.voiceId || "will",
            doctorImage: sessionRecord.selectedDoctor?.image || "/images/doctor1.png",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const handleStartCall = async () => {
    // Immediately transition call UI states to preview and verify layout flows
    setIsCallActive(true);
    setIsCallStarted(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);
    vapi.on('call-start', () => {
      console.log('Call started');
    });
    vapi.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
      setIsCallStarted(false);
      setVapiInstance(null);
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        console.log(`${message.role}: ${message.transcript}`);
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, sender: message.role === "assistant" ? "doctor" : "patient", senderName: message.role === "assistant" ? "Doctor" : "Patient", text: message.transcript, time: new Date().toLocaleTimeString() }]);
      }
    });
  };

  // Load session data
  useEffect(() => {
    setIsClient(true);
    // 1. Try loading from localStorage first for instant rendering
    const stored = localStorage.getItem("current_active_session");
    if (stored) {
      setSessionData(JSON.parse(stored));
    } else {
      // Fallback placeholder before database loads
      setSessionData({
        patientName: "Patient Intake",
        patientAge: "30",
        patientGender: "Male",
        symptoms: "Unspecified symptoms",
        severity: "Moderate",
        doctorSpecialty: "General Physician",
        doctorVoice: "will",
        doctorImage: "/images/doctor1.png"
      });
    }
    // 2. Fetch the database source of truth
    getSessionDetails();
  }, [sessionId]);

  // Call duration counter
  useEffect(() => {
    if (!isCallStarted) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallStarted]);

  // Scroll to bottom of chat transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isDoctorSpeaking, activeTranscript]);

  // Handle custom user text reply submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionData) return;

    const userText = chatInput.trim();
    const getTimestamp = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Append user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "patient",
      senderName: "You",
      text: userText,
      time: getTimestamp()
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
  };

  // Terminate and save consultation run
  const handleEndCall = () => {
    if (!sessionData) return;

    // 1. Fetch consultations from history
    const stored = localStorage.getItem("dashboard_consultations");
    const consultationsList = stored ? JSON.parse(stored) : [];

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Deduce custom recommendation from inputs
    let recommendation = "Observe symptoms closely, monitor vitals, and arrange a clinical assessment within 72 hours.";
    if (sessionData.doctorSpecialty.includes("Pediatrician")) {
      recommendation = "Arrange pediatric clinical follow-up within 24 hours. Suggest warm hydration and symptom logging.";
    } else if (sessionData.doctorSpecialty.includes("Cardiologist")) {
      recommendation = "Urgent outpatient cardiologist checkup. Suggest resting, vital monitoring, and Rule-Out ischemia protocols.";
    } else if (sessionData.doctorSpecialty.includes("Dermatologist")) {
      recommendation = "Local dermatology observation for inflammatory rashes. Keep skin sanitized and hydrated.";
    }

    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    const duration = `${minutes}m ${seconds}s`;

    const newConsultation = {
      id: `consult-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: formattedDate,
      time: formattedTime,
      duration,
      patientName: sessionData.patientName,
      patientAge: sessionData.patientAge,
      patientGender: sessionData.patientGender,
      symptoms: sessionData.symptoms,
      severity: sessionData.severity,
      status: "Completed",
      recommendation,
      doctorSpecialty: sessionData.doctorSpecialty,
      doctorImage: sessionData.doctorImage
    };

    // 2. Prepend to consultations
    const updated = [newConsultation, ...consultationsList];
    localStorage.setItem("dashboard_consultations", JSON.stringify(updated));

    // 3. Deduct credit
    const savedCredits = localStorage.getItem("user_credits");
    if (savedCredits) {
      const current = Number(savedCredits);
      localStorage.setItem("user_credits", String(current > 0 ? current - 1 : 0));
    }

    // 4. Reset states and return to dashboard
    setIsCallStarted(false);
    setIsCallActive(false);
    localStorage.removeItem("current_active_session");
    router.push("/dashboard");
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!isClient || !sessionData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white">
        <Activity className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const docShortSpecialist = sessionData.doctorSpecialty;
  const docShortName = `Dr. ${sessionData.doctorSpecialty.split(' ')[0]}`;

  if (!isCallStarted) {
    const isConnecting = vapiInstance && !isCallActive;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans select-none overflow-hidden transition-colors duration-300">
        {/* Telehealth Top bar */}
        <header className="px-6 py-4.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => router.push("/dashboard")}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Telehealth Lobby
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20">
                  READY TO JOIN
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850 transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        {/* Lobby Body */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Media Check & Call Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl"
              >
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Media Check & Status
                    </h2>
                    <p className="text-[11px] text-slate-455 dark:text-slate-400 mt-1">
                      Configure your setup before starting the secure HIPAA session.
                    </p>
                  </div>

                  {/* Simulated Camera Preview Box */}
                  <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-855 overflow-hidden flex flex-col items-center justify-center p-4">
                    {/* Pulsing scanning lines & mesh */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_80%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(18,24,38,0.1)_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    
                    {/* Scanning Laser Line */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500/25 top-0 animate-[bounce_4s_infinite]" />

                    {/* Camera Status Overlay Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {!vapiInstance ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-800/80 text-slate-350 border border-slate-700/50 backdrop-blur-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Call Status: Not Connected
                        </span>
                      ) : isConnecting ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                          Call Status: Connecting...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-455 border border-emerald-500/20 backdrop-blur-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Call Status: Connected
                        </span>
                      )}
                    </div>

                    {/* Patient/User Silhouette Placeholder */}
                    <User className="h-12 w-12 text-slate-700 animate-pulse" />
                    <p className="text-[10px] text-slate-450 font-semibold mt-3 tracking-wide">Camera Ready</p>

                    {/* Mock Mic waveform in preview */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] text-slate-450 font-mono">
                      <span>Mic: Active</span>
                      <div className="flex items-center gap-0.5 h-3">
                        {[0.2, 0.4, 0.3, 0.5, 0.2].map((val, i) => (
                          <span 
                            key={i} 
                            style={{ height: `${val * 100}%` }} 
                            className="w-0.5 bg-emerald-500/60 rounded-full animate-pulse" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Secure Consultation Link</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">HIPAA SECURE</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Microphone Input</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">READY</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-[10px] text-slate-450 dark:text-slate-500">
                    By joining, you agree to secure telehealth terms.
                  </p>
                </div>
              </motion.div>

              {/* Right Column: Doctor & Intake Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl"
              >
                {/* Upper Section: Selected Doctor Card */}
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row items-center gap-4.5 text-center sm:text-left">
                    <div className="relative">
                      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-60 blur-xs animate-pulse" />
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-md">
                        {!imageError[100] ? (
                          <img 
                            src={sessionData.doctorImage.startsWith('.') ? sessionData.doctorImage.substring(1) : sessionData.doctorImage} 
                            alt={docShortName} 
                            className="h-full w-full object-cover"
                            onError={() => setImageError(prev => ({ ...prev, [100]: true }))}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-450 font-bold text-2xl">
                            {docShortName.charAt(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20">
                        ASSIGNED SPECIALIST
                      </span>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {docShortName}
                      </h2>
                      <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">
                        {docShortSpecialist} • Voice Profile: <span className="capitalize font-semibold text-slate-700 dark:text-slate-350">{sessionData.doctorVoice} Agent</span>
                      </p>
                    </div>
                  </div>

                  {/* Intake Summary Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">
                      Intake Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-0.5">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Identifier</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{sessionData.patientName}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Age & Gender</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{sessionData.patientAge} y/o • {sessionData.patientGender}</span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-0.5">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Clinical Severity</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        sessionData.severity === "Critical" ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : sessionData.severity === "High" ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : sessionData.severity === "Moderate" ? "border-teal-500/20 bg-teal-500/10 text-teal-650 dark:text-teal-400"
                          : "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400"
                      }`}>
                        {sessionData.severity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Reported Symptoms</span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed max-h-[140px] overflow-y-auto pr-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                        {sessionData.symptoms}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call Control Button Action */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-850/60">
                  {!vapiInstance ? (
                    <button
                      onClick={handleStartCall}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <Activity className="h-4.5 w-4.5 animate-pulse" />
                      Start Consultation Call
                    </button>
                  ) : isConnecting ? (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500 font-bold text-sm flex items-center justify-center gap-2.5 outline-none cursor-not-allowed border border-slate-200 dark:border-slate-800"
                    >
                      <span className="h-4 w-4 rounded-full border-2 border-slate-450 border-t-transparent animate-spin mr-1" />
                      Connecting Securely...
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-not-allowed"
                    >
                      Joined Session
                    </button>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans select-none overflow-hidden transition-colors duration-300">
      
      {/* Telehealth Top bar */}
      <header className="px-6 py-4.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={handleEndCall}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Telehealth Consultation
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-450" />
                SECURE HIPAA LINK
              </span>
            </h1>
            <p className="text-[10px] text-slate-555 dark:text-slate-500 tracking-wide mt-0.5">
              Room ID: <span className="font-mono text-slate-650 dark:text-slate-400">{sessionId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850 transition-all cursor-pointer mr-1"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Active Call Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-350">
            <Clock className="h-3.5 w-3.5 text-slate-450 animate-pulse" />
            {formatTimer(callDuration)}
          </div>
        </div>
      </header>

      {/* Main split dashboard call room */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 overflow-hidden h-[calc(100vh-5.5rem)]">
        
        {/* Left side: Telehealth Camera Window */}
        <div className="lg:col-span-2 flex flex-col h-full gap-4 min-h-[350px]">
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex-1 flex flex-col items-center justify-center p-6 shadow-xs relative">
            
            {/* Ambient blur backdrop glow */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-10 dark:opacity-25 pointer-events-none scale-110 transition-all duration-700" 
              style={{ backgroundImage: `url(${sessionData.doctorImage.startsWith('.') ? sessionData.doctorImage.substring(1) : sessionData.doctorImage})` }}
            />

            {/* Pulsing visual connection effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.02),_transparent_60%)] pointer-events-none animate-pulse" />

            {/* Video status placeholder when Doctor Video is on */}
            <div className="flex flex-col items-center justify-center space-y-5 text-center relative z-10">
              
              {/* Doctor Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-60 blur-xs animate-spin [animation-duration:8s] group-hover:opacity-80 transition-opacity" />
                <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-lg">
                  {!imageError[100] ? (
                    <img 
                      src={sessionData.doctorImage.startsWith('.') ? sessionData.doctorImage.substring(1) : sessionData.doctorImage} 
                      alt={docShortName} 
                      className="h-full w-full object-cover"
                      onError={() => setImageError(prev => ({ ...prev, [100]: true }))}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-450 font-bold text-3xl">
                      {docShortName.charAt(4)}
                    </div>
                  )}
                </div>
                
                {/* Micro speech dot indicator */}
                {isDoctorSpeaking && (
                  <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 border border-slate-950 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  {docShortName}
                  <span className="text-[10px] text-slate-555 dark:text-slate-400 font-normal">({docShortSpecialist})</span>
                </h2>
                <p className="text-[11px] text-slate-555 dark:text-slate-400 mt-0.5">
                  Clinical Agent • Voice: <span className="capitalize text-slate-700 dark:text-slate-350 font-semibold">{sessionData.doctorVoice}</span>
                </p>
              </div>

              {/* Reactive speech waveform bars */}
              <div className="h-12 flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850/60 backdrop-blur-xs mt-3">
                {[1.2, 2.5, 1.8, 3.2, 1.0, 2.7, 1.5, 3.5, 2.1, 1.4, 2.8, 1.1].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    animate={isDoctorSpeaking ? { 
                      height: ["8px", `${((idx * 7) % 26) + 12}px`, "8px"] 
                    } : { 
                      height: "8px" 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.9, 
                      delay: delay * 0.1, 
                      ease: "easeInOut" 
                    }}
                    className={`w-1 rounded-full ${
                      isDoctorSpeaking 
                        ? "bg-gradient-to-t from-emerald-650 to-emerald-400" 
                        : "bg-slate-355 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Picture-in-Picture patient screen overlay (You) */}
            <div className="absolute bottom-4 right-4 w-32 h-44 sm:w-36 sm:h-50 bg-slate-100 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col justify-between p-3 bg-[radial-gradient(circle_at_center,_#f1f5f9_0%,_#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#090d16_100%)] select-none transition-all duration-300 ring-2 ring-emerald-500/20 hover:ring-emerald-500/40">
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide">You</span>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Face grid meshing placeholder simulation */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden my-1">
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6 text-slate-405 dark:text-slate-650" />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Pulsing scanning lines */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500/25 top-0 animate-[bounce_3s_infinite]" />
                    <User className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-350 truncate max-w-[80px]">
                  {sessionData.patientName}
                </span>
                {isMuted && <MicOff className="h-3 w-3 text-rose-500" />}
              </div>
            </div>

            {/* Secure connection overlay text */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800/80 text-[10px] font-bold text-slate-650 dark:text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              End-to-End Secure
            </div>
          </div>

          {/* Media control dashboard overlay */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-4.5 rounded-3xl flex items-center justify-center gap-3 sm:gap-4 shrink-0 shadow-md">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isMuted 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20" 
                  : "bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-805 hover:text-slate-950 dark:hover:text-white"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>

            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isVideoOff 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20" 
                  : "bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-805 hover:text-slate-955 dark:hover:text-white"
              }`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isVideoOff ? <VideoOff className="h-4.5 w-4.5" /> : <VideoIcon className="h-4.5 w-4.5" />}
            </button>

            <button 
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isScreenSharing 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20" 
                  : "bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-805 hover:text-slate-955 dark:hover:text-white"
              }`}
              title="Share Screen"
            >
              <ScreenShare className="h-4.5 w-4.5" />
            </button>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            <button 
              onClick={handleEndCall}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/10 cursor-pointer active:scale-[0.98]"
            >
              <PhoneOff className="h-4 w-4" />
              End Consultation
            </button>
          </div>
        </div>

        {/* Right side: Clinical Transcription Chat */}
        <div className="lg:col-span-1 h-full flex flex-col border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 rounded-3xl p-4 sm:p-5 overflow-hidden justify-between min-h-[350px]">
          
          {/* Transcript Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-555" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                  Transcription Log
                </h3>
                <span className="block text-[9px] text-slate-500 dark:text-slate-500 -mt-0.5">Real-time EHR capture</span>
              </div>
            </div>
            
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/40 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-655 dark:text-slate-400 leading-relaxed">
                Your voice dialogue is securely transcribed below. Add observations by typing in the chat log input.
              </p>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isDoc = msg.sender === "doctor";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isDoc ? "items-start" : "items-end"} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[9px] font-bold text-slate-505 dark:text-slate-450 uppercase tracking-wide">
                        {msg.senderName}
                      </span>
                      <span className="text-[8px] text-slate-450 dark:text-slate-600 font-semibold">{msg.time}</span>
                    </div>

                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isDoc 
                        ? "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-205 rounded-tl-xs border border-slate-200 dark:border-slate-850" 
                        : "bg-emerald-605 text-white rounded-tr-xs shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}

              {/* Streaming active transcript */}
              {activeTranscript && activeTranscript.text.trim() && (
                <motion.div
                  key="active-transcript"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${activeTranscript.role === 'assistant' ? "items-start" : "items-end"} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[9px] font-bold text-slate-505 dark:text-slate-455 uppercase tracking-wide">
                      {activeTranscript.role === 'assistant' ? docShortName : "You"}
                    </span>
                    <span className="text-[8px] text-emerald-500 font-semibold italic animate-pulse">Streaming...</span>
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    activeTranscript.role === 'assistant' 
                      ? "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-205 rounded-tl-xs border border-slate-200 dark:border-slate-850" 
                      : "bg-emerald-605 text-white rounded-tr-xs shadow-xs"
                  }`}>
                    {activeTranscript.text}
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {isDoctorSpeaking && (!activeTranscript || activeTranscript.role !== 'assistant') && (
                <motion.div
                  key="typing-indicator"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start space-y-1"
                >
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[9px] font-bold text-slate-505 dark:text-slate-455 uppercase tracking-wide">
                      {docShortName}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-550 italic font-semibold">Speaking...</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-inner">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Bar */}
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3 shrink-0"
          >
            <input
              type="text"
              placeholder="Type symptom observation..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs placeholder-slate-450 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
