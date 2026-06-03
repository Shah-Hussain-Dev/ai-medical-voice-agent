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
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Script generator based on selected doctor specialist and symptoms
const getConversationScript = (patientName: string, doctorSpecialty: string, symptoms: string, severity: string) => [
  {
    sender: "doctor",
    text: `Hello ${patientName}, I am your AI ${doctorSpecialty} agent. I've received your intake transcript detailing: "${symptoms}". Let's start your clinical assessment. How long have you been experiencing these symptoms?`
  },
  {
    sender: "patient",
    text: "It started about 24 hours ago, and it's been pretty constant. It's gotten a bit worse when I try to rest."
  },
  {
    sender: "doctor",
    text: `I've noted that. Given the ${severity} severity index, we need to inspect for secondary indicators. Are you experiencing any dizziness, fever, or pressure spikes?`
  },
  {
    sender: "patient",
    text: "No severe dizziness, but I do feel general fatigue and a slight headache."
  },
  {
    sender: "doctor",
    text: `Understood. I am adding these diagnostic parameters to your clinical recommendation report. I suggest monitoring your vitals closely. Please stay on the line while I prepare the file.`
  }
];

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

  // Local state for active session data
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Call Control states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Chat/Transcription states
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session data
  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      const stored = localStorage.getItem("current_active_session");
      if (stored) {
        setSessionData(JSON.parse(stored));
      } else {
        // Fallback if accessed directly
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
    }, 0);
  }, []);

  // Call duration counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated transcription script playback
  useEffect(() => {
    if (!sessionData) return;

    const script = getConversationScript(
      sessionData.patientName,
      sessionData.doctorSpecialty,
      sessionData.symptoms,
      sessionData.severity
    );

    const docName = `Dr. ${sessionData.doctorSpecialty.split(' ')[0]}`;

    // Helper to format timestamp
    const getTimestamp = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Step 1: Doctor greets (1.5s)
    const t1 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "msg-1",
        sender: "doctor",
        senderName: docName,
        text: script[0].text,
        time: getTimestamp()
      }]);
      setIsDoctorSpeaking(true);
    }, 1500);

    const t1_stop = setTimeout(() => setIsDoctorSpeaking(false), 5500);

    // Step 2: Patient replies (7s)
    const t2 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "msg-2",
        sender: "patient",
        senderName: "You",
        text: script[1].text,
        time: getTimestamp()
      }]);
    }, 7500);

    // Step 3: Doctor follow-up (11.5s)
    const t3 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "msg-3",
        sender: "doctor",
        senderName: docName,
        text: script[2].text,
        time: getTimestamp()
      }]);
      setIsDoctorSpeaking(true);
    }, 11500);

    const t3_stop = setTimeout(() => setIsDoctorSpeaking(false), 15500);

    // Step 4: Patient details fatigue (17.5s)
    const t4 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "msg-4",
        sender: "patient",
        senderName: "You",
        text: script[3].text,
        time: getTimestamp()
      }]);
    }, 17500);

    // Step 5: Doctor wraps up (21.5s)
    const t5 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "msg-5",
        sender: "doctor",
        senderName: docName,
        text: script[4].text,
        time: getTimestamp()
      }]);
      setIsDoctorSpeaking(true);
    }, 21500);

    const t5_stop = setTimeout(() => setIsDoctorSpeaking(false), 25500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t1_stop);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t3_stop);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t5_stop);
    };
  }, [sessionData]);

  // Scroll to bottom of chat transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isDoctorSpeaking]);

  // Handle custom user text reply submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionData) return;

    const userText = chatInput.trim();
    const docName = `Dr. ${sessionData.doctorSpecialty.split(' ')[0]}`;
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

    // Simulate doctor speaking reply after 1.2 seconds
    setIsDoctorSpeaking(false);
    setTimeout(() => {
      setIsDoctorSpeaking(true);
      const docMsg: Message = {
        id: `msg-doc-${Date.now()}`,
        sender: "doctor",
        senderName: docName,
        text: `Understood. I have added your response: "${userText}" into the diagnostic file parameters. Anything else you want to note?`,
        time: getTimestamp()
      };
      setMessages(prev => [...prev, docMsg]);

      // Stop speech animations after 4.5 seconds
      setTimeout(() => {
        setIsDoctorSpeaking(false);
      }, 4500);
    }, 1200);
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

    // 4. Return to dashboard
    router.push("/dashboard");
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!isClient || !sessionData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Activity className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const docShortSpecialist = sessionData.doctorSpecialty;
  const docShortName = `Dr. ${sessionData.doctorSpecialty.split(' ')[0]}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* Telehealth Top bar */}
      <header className="px-6 py-4.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={handleEndCall}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              Telehealth Consultation
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SECURE HIPAA LINK
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wide mt-0.5">
              Room ID: <span className="font-mono text-slate-400">{sessionId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Active Call Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-350">
            <Clock className="h-3.5 w-3.5 text-slate-450 animate-pulse" />
            {formatTimer(callDuration)}
          </div>
        </div>
      </header>

      {/* Main split dashboard call room */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 overflow-hidden h-[calc(100vh-5.5rem)]">
        
        {/* Left side: Telehealth Camera Window */}
        <div className="lg:col-span-2 flex flex-col h-full gap-4 min-h-[350px]">
          
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex-1 flex flex-col items-center justify-center p-6 shadow-inner relative">
            
            {/* Pulsing visual connection effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.02),_transparent_60%)] pointer-events-none" />

            {/* Video status placeholder when Doctor Video is on */}
            <div className="flex flex-col items-center justify-center space-y-5 text-center relative z-10">
              
              {/* Doctor Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-60 blur-xs animate-spin [animation-duration:8s] group-hover:opacity-80 transition-opacity" />
                <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-lg">
                  {!imageError[100] ? (
                    <img 
                      src={sessionData.doctorImage.startsWith('.') ? sessionData.doctorImage.substring(1) : sessionData.doctorImage} 
                      alt={docShortName} 
                      className="h-full w-full object-cover"
                      onError={() => setImageError(prev => ({ ...prev, [100]: true }))}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-emerald-950 text-emerald-450 font-bold text-3xl">
                      {docShortName.charAt(4)}
                    </div>
                  )}
                </div>
                
                {/* Micro speech dot indicator */}
                {isDoctorSpeaking && (
                  <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 border border-slate-900 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-base font-extrabold text-white flex items-center justify-center gap-1.5">
                  {docShortName}
                  <span className="text-[10px] text-slate-500 font-normal">({docShortSpecialist})</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clinical Agent • Voice: <span className="capitalize text-slate-400 font-semibold">{sessionData.doctorVoice}</span>
                </p>
              </div>

              {/* Reactive speech waveform bars */}
              <div className="h-10 flex items-center gap-1 pt-1.5">
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
                        ? "bg-gradient-to-t from-emerald-600 to-emerald-450" 
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Picture-in-Picture patient screen overlay (You) */}
            <div className="absolute bottom-4 right-4 w-32 h-44 sm:w-36 sm:h-50 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl z-10 flex flex-col justify-between p-3 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#090d16_100%)] select-none">
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">You</span>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Face grid meshing placeholder simulation */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden my-1">
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6 text-slate-650" />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Pulsing scanning lines */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500/20 top-0 animate-[bounce_3s_infinite]" />
                    <User className="h-10 w-10 text-slate-500" />
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-350 truncate max-w-[80px]">
                  {sessionData.patientName}
                </span>
                {isMuted && <MicOff className="h-3 w-3 text-rose-500" />}
              </div>
            </div>

            {/* Secure connection overlay text */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-xs border border-slate-800/80 text-[10px] font-bold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              End-to-End Secure
            </div>
          </div>

          {/* Media control dashboard overlay */}
          <div className="bg-slate-900 border border-slate-800 px-6 py-4.5 rounded-3xl flex items-center justify-center gap-3 sm:gap-4 shrink-0 shadow-lg">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isMuted 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20" 
                  : "bg-slate-950 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white"
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
                  : "bg-slate-950 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white"
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
                  : "bg-slate-950 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white"
              }`}
              title="Share Screen"
            >
              <ScreenShare className="h-4.5 w-4.5" />
            </button>

            <div className="h-7 w-px bg-slate-800 mx-2" />

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
        <div className="lg:col-span-1 h-full flex flex-col border border-slate-800 bg-slate-900/60 rounded-3xl p-4 sm:p-5 overflow-hidden justify-between min-h-[350px]">
          
          {/* Transcript Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-emerald-555" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Transcription Log
                </h3>
                <span className="block text-[9px] text-slate-550 -mt-0.5">Real-time EHR capture</span>
              </div>
            </div>
            
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-450 leading-relaxed">
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
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">
                        {msg.senderName}
                      </span>
                      <span className="text-[8px] text-slate-600 font-semibold">{msg.time}</span>
                    </div>

                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isDoc 
                        ? "bg-slate-800/80 text-slate-200 rounded-tl-xs border border-slate-850" 
                        : "bg-emerald-600 text-white rounded-tr-xs shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isDoctorSpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start space-y-1"
                >
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">
                      {docShortName}
                    </span>
                    <span className="text-[9px] text-slate-550 italic font-semibold">Speaking...</span>
                  </div>
                  <div className="p-3 bg-slate-850 border border-slate-800 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-inner">
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
            className="flex items-center gap-2 pt-3 border-t border-slate-800 mt-3 shrink-0"
          >
            <input
              type="text"
              placeholder="Type symptom observation..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs placeholder-slate-500 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
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


