export default function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="72" height="72" rx="18" fill="url(#logoGrad)"/>
        <path d="M20 36C20 27.163 27.163 20 36 20C44.837 20 52 27.163 52 36C52 44.837 44.837 52 36 52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M36 52C31.029 52 26.667 49.333 24 45.333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6"/>
        <rect x="30" y="26" width="12" height="2.5" rx="1.25" fill="white"/>
        <rect x="30" y="31.5" width="12" height="2.5" rx="1.25" fill="white"/>
        <rect x="30" y="37" width="7" height="2.5" rx="1.25" fill="white"/>
        <circle cx="44" cy="44" r="7" fill="url(#logoGrad2)" stroke="white" strokeWidth="2"/>
        <path d="M41 44L43.5 46.5L47 42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9"/>
            <stop offset="1" stopColor="#0d9488"/>
          </linearGradient>
          <linearGradient id="logoGrad2" x1="37" y1="37" x2="51" y2="51" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9"/>
            <stop offset="1" stopColor="#14b8a6"/>
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="font-bold text-[var(--text-primary)] tracking-tight" style={{ fontSize: size * 0.5 }}>
          Scanly
        </span>
      )}
    </div>
  );
}
