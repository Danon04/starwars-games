import { useTimer } from '../hooks/useTimer';

const CIRCUMFERENCE = 2 * Math.PI * 90;

export default function Timer() {
  const { formatted, progress, isWarning, isDanger } = useTimer();

  const offset = CIRCUMFERENCE * (1 - progress);
  const strokeColor = isDanger ? '#ff3333' : isWarning ? '#ffd700' : '#ffe81f';
  const textColor = isDanger ? 'text-star-red animate-pulse-danger' : isWarning ? 'text-star-yellow' : 'text-star-gold';

  return (
    <div className="text-center mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <div className="w-[200px] h-[200px] mx-auto mb-4 relative">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-orbitron text-[clamp(2.5rem,8vw,4rem)] font-black ${textColor}`}
            style={{ letterSpacing: '0.08em' }}
          >
            {formatted}
          </span>
        </div>
      </div>
      <p className="font-orbitron text-[0.7rem] tracking-[0.4em] uppercase text-white/35">
        Tiempo restante
      </p>
    </div>
  );
}
