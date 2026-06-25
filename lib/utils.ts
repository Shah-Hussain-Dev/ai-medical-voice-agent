import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const AI_DOCTOR_SUGGESTION_MODEL= {
  llama:"nvidia/nemotron-nano-12b-v2-vl:free",
  gemini:"google/gemini-2.5-flash-lite-preview-09-2025"
}