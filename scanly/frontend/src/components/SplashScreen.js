'use client';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 400);
    }, 2000);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className={`splash-screen transition-opacity duration-400 ${!visible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="splash-logo flex flex-col items-center gap-4">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="72" rx="20" fill="url(#splashGrad)"/>
          <path d="M20 36C20 27.163 27.163 20 36 20C44.837 20 52 27.163 52 36C52 44.837 44.837 52 36 52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M36 52C31.029 52 26.667 49.333 24 45.333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6"/>
          <rect x="30" y="26" width="12" height="2.5" rx="1.25" fill="white"/>
          <rect x="30" y="31.5" width="12" height="2.5" rx="1.25" fill="white"/>
          <rect x="30" y="37" width="7" height="2.5" rx="1.25" fill="white"/>
          <circle cx="44" cy="44" r="7" fill="url(#splashGrad2)" stroke="white" strokeWidth="2"/>
          <path d="M41 44L43.5 46.5L47 42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="splashGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9"/>
              <stop offset="1" stopColor="#0d9488"/>
            </linearGradient>
            <linearGradient id="splashGrad2" x1="37" y1="37" x2="51" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9"/>
              <stop offset="1" stopColor="#14b8a6"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center">
          <div className="text-white text-2xl font-bold tracking-tight">Scanly</div>
          <div className="text-slate-400 text-xs mt-0.5 tracking-widest uppercase">Health Records</div>
        </div>
      </div>
      <div className="splash-bar">
        <div className="splash-bar-fill"/>
      </div>
    </div>
  );
}
