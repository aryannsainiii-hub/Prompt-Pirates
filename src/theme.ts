export type ThemeId =
  | 'trust-blue'
  | 'dark-slate'
  | 'vibrant-violet'
  | 'organic-sage'
  | 'monochrome-crimson';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  bg: string;
  gridLineColor: string;
  gridDotColor: string;
  headerBg: string;
  cardBg: string;
  cardSubtleBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentText: string;
  buttonPrimary: string;
  interviewerBubble: string;
  candidateBubble: string;
  textareaBg: string;
  pillBg: string;
  tagFollowUpBg: string;
}

export const classNameThemeMap: Record<ThemeId, ThemeConfig> = {
  'dark-slate': {
    id: 'dark-slate',
    name: 'Dark Mode Neon & Slate',
    isDark: true,
    bg: 'bg-[#0B1120] text-slate-100',
    gridLineColor: 'rgba(71, 85, 105, 0.28)',
    gridDotColor: 'rgba(45, 212, 191, 0.35)',
    headerBg: 'bg-[#0B1120]/90 backdrop-blur-md border-slate-800/80 text-slate-100',
    cardBg: 'bg-[#162033] border-slate-700/60 shadow-xl shadow-slate-950/40',
    cardSubtleBg: 'bg-[#101827]/85 border-slate-800',
    border: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'text-[#2DD4BF]',
    accentBg: 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#5EEAD4]',
    accentText: 'text-[#5EEAD4]',
    buttonPrimary: 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20',
    interviewerBubble: 'bg-[#162033] border-slate-700/80 text-slate-100',
    candidateBubble: 'bg-[#0F172A] border-teal-500/40 text-teal-100',
    textareaBg: 'bg-[#0B1120] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#2DD4BF]',
    pillBg: 'bg-slate-800/90 border-slate-700 text-slate-300',
    tagFollowUpBg: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
  },
  'trust-blue': {
    id: 'trust-blue',
    name: 'Trust Blue & Crisp White',
    isDark: false,
    bg: 'bg-[#F8FAFC] text-slate-900',
    gridLineColor: 'rgba(203, 213, 225, 0.65)',
    gridDotColor: 'rgba(37, 99, 235, 0.28)',
    headerBg: 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs',
    cardBg: 'bg-[#FFFFFF] border-slate-200/90 shadow-sm',
    cardSubtleBg: 'bg-[#F8FAFC] border-slate-200',
    border: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textMuted: 'text-slate-500',
    accent: 'text-[#2563EB]',
    accentBg: 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#1D4ED8]',
    accentText: 'text-[#1D4ED8]',
    buttonPrimary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-500/20',
    interviewerBubble: 'bg-white border-slate-200 text-slate-900 shadow-2xs',
    candidateBubble: 'bg-blue-50 border-blue-200 text-blue-950 shadow-2xs',
    textareaBg: 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB]',
    pillBg: 'bg-slate-100 border-slate-200 text-slate-700',
    tagFollowUpBg: 'bg-blue-100 border-blue-300 text-blue-800',
  },
  'vibrant-violet': {
    id: 'vibrant-violet',
    name: 'Vibrant Violet & Soft Lilac',
    isDark: true,
    bg: 'bg-[#100D1F] text-slate-100',
    gridLineColor: 'rgba(124, 108, 196, 0.2)',
    gridDotColor: 'rgba(167, 139, 250, 0.35)',
    headerBg: 'bg-[#16122A]/90 backdrop-blur-md border-violet-900/50 text-slate-100',
    cardBg: 'bg-[#1B1733] border-violet-800/40 shadow-xl shadow-violet-950/40',
    cardSubtleBg: 'bg-[#241D42] border-violet-800/30',
    border: 'border-violet-800/40',
    textPrimary: 'text-slate-100',
    textMuted: 'text-violet-200/65',
    accent: 'text-[#A78BFA]',
    accentBg: 'bg-[#8B5CF6]/15 border-[#8B5CF6]/35 text-[#C4B5FD]',
    accentText: 'text-[#C4B5FD]',
    buttonPrimary: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-lg shadow-violet-900/40',
    interviewerBubble: 'bg-[#211B3B] border-violet-800/50 text-slate-100',
    candidateBubble: 'bg-[#2A2148] border-violet-500/40 text-violet-100',
    textareaBg: 'bg-[#100D1F] border-violet-800/60 text-slate-100 placeholder:text-violet-300/50 focus:border-[#A78BFA]',
    pillBg: 'bg-[#211B3B] border-violet-800/50 text-violet-200',
    tagFollowUpBg: 'bg-violet-500/15 border-violet-400/40 text-violet-200',
  },
  'organic-sage': {
    id: 'organic-sage',
    name: 'Organic Sage & Warm Sand',
    isDark: false,
    bg: 'bg-[#FAFAF7] text-stone-900',
    gridLineColor: 'rgba(203, 201, 190, 0.6)',
    gridDotColor: 'rgba(13, 148, 136, 0.28)',
    headerBg: 'bg-[#FAFAF7]/90 backdrop-blur-md border-stone-200 text-stone-900 shadow-2xs',
    cardBg: 'bg-[#FFFFFF] border-stone-200/90 shadow-xs',
    cardSubtleBg: 'bg-[#F4F3EE] border-stone-300/60',
    border: 'border-stone-300',
    textPrimary: 'text-stone-900',
    textMuted: 'text-stone-600',
    accent: 'text-[#0F766E]',
    accentBg: 'bg-[#0F766E]/10 border-[#0F766E]/25 text-teal-800',
    accentText: 'text-teal-800',
    buttonPrimary: 'bg-[#0F766E] hover:bg-[#115E59] text-white font-bold shadow-md shadow-teal-700/20',
    interviewerBubble: 'bg-[#FFFFFF] border-stone-300/80 text-stone-900',
    candidateBubble: 'bg-[#E6F4F1] border-teal-300/80 text-teal-950',
    textareaBg: 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-[#0F766E]',
    pillBg: 'bg-stone-100/90 border-stone-300 text-stone-700',
    tagFollowUpBg: 'bg-teal-100 border-teal-300 text-teal-900',
  },
  'monochrome-crimson': {
    id: 'monochrome-crimson',
    name: 'Minimalist Monochrome & Crimson',
    isDark: true,
    bg: 'bg-[#090A0C] text-neutral-100',
    gridLineColor: 'rgba(82, 82, 91, 0.3)',
    gridDotColor: 'rgba(244, 63, 94, 0.4)',
    headerBg: 'bg-[#090A0C]/90 backdrop-blur-md border-neutral-800 text-neutral-100',
    cardBg: 'bg-[#141519] border-neutral-800 shadow-2xl shadow-black/60',
    cardSubtleBg: 'bg-[#1B1C21] border-neutral-800',
    border: 'border-neutral-800',
    textPrimary: 'text-neutral-100',
    textMuted: 'text-neutral-400',
    accent: 'text-[#F43F5E]',
    accentBg: 'bg-[#F43F5E]/10 border-[#F43F5E]/30 text-[#FB7185]',
    accentText: 'text-[#FB7185]',
    buttonPrimary: 'bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold shadow-lg shadow-rose-600/20',
    interviewerBubble: 'bg-[#17181C] border-neutral-800 text-neutral-100',
    candidateBubble: 'bg-[#241318] border-rose-900/50 text-rose-100',
    textareaBg: 'bg-[#0D0E11] border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:border-[#F43F5E]',
    pillBg: 'bg-[#191A1E] border-neutral-800 text-neutral-300',
    tagFollowUpBg: 'bg-rose-950/60 border-rose-800 text-rose-300',
  },
};