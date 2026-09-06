import { useState } from 'react';
import { useGame } from '../store/gameState';

export default function StartScreen() {
  const { startGame } = useGame();
  const [minutes, setMinutes] = useState(5);

  return (
    <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center mb-12 animate-fade-down">
        <p className="font-orbitron text-[0.8rem] tracking-[0.35em] uppercase text-star-cyan/80 mb-3">
          Escape Room
        </p>
        <h1
          className="font-orbitron text-[clamp(2.5rem,7vw,5rem)] font-black leading-none"
          style={{
            background: 'linear-gradient(135deg, #ffe81f 0%, #fff 50%, #ffe81f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Star Wars
        </h1>
        <p className="text-white/50 text-[1.15rem] mt-4 tracking-wide">
          Resuelve los acertijos antes de que se agote el tiempo
        </p>
      </div>

      <div className="panel-outer w-full max-w-[420px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="panel-inner">
          <p className="font-orbitron text-[0.65rem] tracking-[0.3em] uppercase text-star-cyan/60 mb-6 text-center">
            Configuracion
          </p>

          <div className="mb-8">
            <label className="font-orbitron text-[0.7rem] tracking-[0.2em] uppercase text-white/40 block mb-3 text-center">
              Tiempo del juego
            </label>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setMinutes(m => Math.max(1, m - 1))}
                className="w-10 h-10 rounded-lg border border-star-border bg-transparent text-star-cyan
                  font-orbitron text-lg hover:border-star-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]
                  transition-all duration-300"
              >
                -
              </button>
              <div className="w-24 h-14 rounded-lg bg-star-cyan/[0.03] border border-star-border
                flex items-center justify-center">
                <span className="font-orbitron text-[2rem] font-bold text-star-gold">
                  {minutes}
                </span>
                <span className="font-orbitron text-[0.7rem] text-white/40 ml-2">min</span>
              </div>
              <button
                onClick={() => setMinutes(m => Math.min(30, m + 1))}
                className="w-10 h-10 rounded-lg border border-star-border bg-transparent text-star-cyan
                  font-orbitron text-lg hover:border-star-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]
                  transition-all duration-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => startGame(minutes)}
            className="w-full py-4 rounded-xl font-orbitron text-[0.9rem] font-bold tracking-[0.2em] uppercase
              bg-gradient-to-r from-star-gold to-star-gold-dim text-star-dark
              shadow-[0_4px_20px_rgba(255,232,31,0.3)]
              hover:shadow-[0_6px_30px_rgba(255,232,31,0.5)] hover:-translate-y-0.5
              active:scale-[0.97]
              transition-all duration-300"
          >
            Iniciar Juego
          </button>

          <p className="text-center text-white/25 text-[0.8rem] mt-4">
            3 estaciones &middot; 3 digitos &middot; 1 codigo maestro
          </p>
        </div>
      </div>
    </div>
  );
}
