import React, { useState, useEffect } from 'react';
import { ShayakLogo } from './ShayakLogo';
import { ThemeConfig } from '../theme';

interface SplashScreenProps {
  theme: ThemeConfig;
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ theme, onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1.5s splash animation duration, then fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 ${theme.bg} flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle radial glow background behind SHAYAK logo */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Centered Uploaded SHAYAK Brand Logo */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center animate-fadeIn">
        <ShayakLogo size="hero" showText={true} />

        <p className={`text-xs font-mono font-semibold tracking-widest uppercase ${theme.textMuted} mt-2`}>
          AI TECHNICAL INTERVIEWER PLATFORM
        </p>

        {/* Minimal loading progress bar */}
        <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#00FF66] to-[#00E5FF] animate-splashProgress rounded-full" />
        </div>
      </div>
    </div>
  );
};
