"use client";

import React, { useContext } from "react";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { 
  Mail, 
  Coins, 
  Key, 
  Award,
  Calendar,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const userDetails = useContext(UserDetailsContext);

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, security configurations, and credits balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Information */}
        <div className="space-y-6 lg:col-span-1">
          {/* User Details Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-sm object-cover mb-4"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xl mb-4 border border-emerald-200">
                  {userDetails?.name ? userDetails.name.charAt(0) : "U"}
                </div>
              )}

              <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100">
                {userDetails?.name || user?.fullName || "VoiceMed User"}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 justify-center">
                <Mail className="h-3.5 w-3.5" />
                {userDetails?.email || user?.primaryEmailAddress?.emailAddress || "user@voicemed.ai"}
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Award className="h-3.5 w-3.5 text-emerald-600" />
                Clinician Tier
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-850 my-5" />

            {/* Quick stats list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Coins className="h-4 w-4 text-emerald-600" />
                  Available Credits
                </div>
                <span className="text-sm font-bold text-slate-850 dark:text-slate-100">
                  {userDetails?.credits ?? 0} Credits
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Member Since
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-350">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Jun 2026"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  HIPAA Status
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20">
                  Secured
                </span>
              </div>
            </div>
          </div>

          {/* Integration Token Box */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <Key className="h-4 w-4 text-emerald-600" />
              API Developer Tokens
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed mb-4">
              Integrate VoiceMed&apos;s voice clinical consultation engine directly into your EHR (Electronic Health Record) systems.
            </p>
            <button className="w-full py-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:text-emerald-300 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/35 transition-colors">
              Generate API Token
            </button>
          </div>
        </div>

        {/* Right Column: Clerk User Profile Manager */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden p-1 sm:p-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-850">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
              Account Management
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely update your profile name, upload photos, link email addresses, and manage authentication options.
            </p>
          </div>

          <div className="flex justify-center py-6 w-full max-w-full overflow-x-auto">
            {/* Render Clerk's Profile Component */}
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-full shadow-none border-0",
                  cardBox: "shadow-none border-0 w-full max-w-full bg-transparent dark:bg-transparent",
                  navbar: "hidden md:flex bg-slate-50/50 dark:bg-slate-850/50 border-r border-slate-100 dark:border-slate-850 rounded-l-xl p-4",
                  scrollBox: "p-2 sm:p-6 bg-transparent w-full",
                  pageScrollBox: "bg-transparent w-full",
                  headerTitle: "text-slate-900 dark:text-white font-extrabold text-lg",
                  headerSubtitle: "text-slate-500 dark:text-slate-400 text-xs",
                  profileSectionTitle: "text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4",
                  formButtonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-white text-xs py-2 rounded-xl transition-all shadow-sm",
                  avatarImageActionsUpload: "text-emerald-700 hover:text-emerald-850 font-semibold",
                  badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-500/20 rounded-full font-bold",
                  accordionTriggerButton: "text-slate-800 dark:text-slate-200 hover:text-slate-900",
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
