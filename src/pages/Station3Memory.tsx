import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../store/gameState';
import { shuffleArray } from '../utils/codeGenerator';
import Timer from '../components/Timer';
import DigitCard from '../components/DigitCard';

const SYMBOLS = [
  { id: 'saber', label: 'Sable', icon: '⚔️' },
  { id: 'star', label: 'Estrella', icon: '⭐' },
  { id: 'shield', label: 'Escudo', icon: '🛡️' },
  { id: 'bolt', label: 'Rayo', icon: '⚡' },
  { id: 'fire', label: 'Fuego', icon: '🔥' },
  { id: 'crystal', label: 'Cristal', icon: '💎' },
  { id: 'eye', label: 'Ojo', icon: '👁️' },
  { id: 'skull', label: 'Calavera', icon: '💀' },
  { id: 'moon', label: 'Luna', icon: '🌙' },
];

const ROUNDS = [
  { length: 4, showTime: 4000, label: 'Ronda 1' },
  { length: 5, showTime: 3500, label: 'Ronda 2' },
  { length: 6, showTime: 3000, label: 'Ronda 3' },
];

type Phase = 'countdown' | 'showing' | 'input' | 'success' | 'fail' | 'digit' | 'done';

export default function Station3Memory() {
  const { completeStation, setCurrentStation, targetDigits } = useGame();
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showDigit, setShowDigit] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const digitRef = useRef(targetDigits.memory);

  const currentRound = ROUNDS[round];

  const generateSequence = useCallback((length: number) => {
    const available = SYMBOLS.map((_, i) => i);
    return shuffleArray(available).slice(0, length);
  }, []);

  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown(c => c - 1), 800);
        return () => clearTimeout(t);
      } else {
        const seq = generateSequence(currentRound.length);
        setSequence(seq);
        setShowingIndex(0);
        setPhase('showing');
      }
    }
  }, [phase, countdown, currentRound.length, generateSequence]);

  useEffect(() => {
    if (phase === 'showing' && showingIndex >= 0) {
      if (showingIndex < sequence.length) {
        const t = setTimeout(() => setShowingIndex(i => i + 1), currentRound.showTime / sequence.length);
        return () => clearTimeout(t);
      } else {
        setPhase('input');
        setShowingIndex(-1);
      }
    }
  }, [phase, showingIndex, sequence.length, currentRound.showTime]);

  function handleSymbolPress(idx: number) {
    if (phase !== 'input') return;

    const nextInput = [...playerInput, idx];
    const nextIdx = playerInput.length;

    if (sequence[nextIdx] === idx) {
      setPlayerInput(nextInput);

      if (nextInput.length === sequence.length) {
        setPhase('success');
        setTimeout(() => {
          if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setPlayerInput([]);
            setSequence([]);
            setCountdown(3);
            setPhase('countdown');
          } else {
            setTimeout(() => {
              completeStation(3, digitRef.current);
              setShowDigit(true);
            }, 800);
          }
        }, 1000);
      }
    } else {
      setWrongFlash(true);
      setPhase('fail');
      setTimeout(() => {
        setPlayerInput([]);
        setWrongFlash(false);
        setPhase('input');
      }, 800);
    }
  }

  useEffect(() => {
    if (showDigit) {
      const timer = setTimeout(() => {
        setCurrentStation(4);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showDigit, setCurrentStation]);

  if (showDigit) {
    return (
      <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
        <Timer />
        <DigitCard digit={digitRef.current} stationName="Estacion 3 - Memoria" />
      </div>
    );
  }

  return (
    <div className="relative z-2 flex flex-col items-center min-h-screen px-4 py-6">
      <div className="text-center mb-4 animate-fade-down">
        <p className="font-orbitron text-[0.65rem] tracking-[0.4em] uppercase text-star-cyan/60 mb-2">
          Estacion 3 de 4
        </p>
        <h2 className="font-orbitron text-[clamp(1.3rem,3.5vw,2rem)] font-black text-star-gold text-glow-gold">
          Memoria de Codigos
        </h2>
        <p className="text-white/45 text-[0.85rem] mt-1">
          Memoriza la secuencia y repitela en orden
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[500px] gap-6">
        <div className="panel-outer w-full">
          <div className="panel-inner">
            <div className="flex items-center justify-between mb-4">
              {ROUNDS.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < round ? 'bg-star-green shadow-[0_0_8px_rgba(0,255,136,0.5)]' :
                    i === round ? 'bg-star-gold shadow-[0_0_8px_rgba(255,232,31,0.5)]' :
                    'bg-white/20'
                  }`} />
                  <span className={`font-orbitron text-[0.65rem] tracking-wider ${
                    i === round ? 'text-star-gold' : i < round ? 'text-star-green' : 'text-white/30'
                  }`}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[220px] flex items-center justify-center">
              {phase === 'countdown' && (
                <div className="text-center animate-scale-in">
                  <p className="font-orbitron text-[0.8rem] text-white/50 mb-4">Preparate...</p>
                  <div className="font-orbitron text-[5rem] font-black text-star-gold text-glow-gold leading-none">
                    {countdown}
                  </div>
                  <p className="font-orbitron text-[0.7rem] text-white/40 mt-3">
                    {currentRound.length} simbolos · {currentRound.showTime / 1000}s
                  </p>
                </div>
              )}

              {phase === 'showing' && showingIndex >= 0 && showingIndex < sequence.length && (
                <div className="text-center animate-scale-in">
                  <div className="text-[6rem] leading-none mb-2">
                    {SYMBOLS[sequence[showingIndex]].icon}
                  </div>
                  <p className="font-orbitron text-[0.7rem] text-white/40">
                    {showingIndex + 1} / {sequence.length}
                  </p>
                </div>
              )}

              {phase === 'showing' && showingIndex >= sequence.length && (
                <div className="text-center animate-fade-down">
                  <p className="font-orbitron text-[1.2rem] text-star-cyan">Ahora tu turno</p>
                </div>
              )}

              {phase === 'input' && (
                <div className="text-center">
                  <p className="font-orbitron text-[0.8rem] text-white/50 mb-2">
                    Ingresa la secuencia ({playerInput.length}/{sequence.length})
                  </p>
                  <div className="flex gap-2 justify-center min-h-[3rem]">
                    {sequence.map((_, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-[1.5rem] transition-all duration-200 ${
                          i < playerInput.length
                            ? 'bg-star-gold/20 border border-star-gold/50'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {i < playerInput.length ? SYMBOLS[playerInput[i]].icon : '?'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phase === 'fail' && (
                <div className="text-center animate-shake">
                  <div className="text-[4rem] leading-none mb-2">❌</div>
                  <p className="font-orbitron text-[0.9rem] text-star-red">Secuencia incorrecta</p>
                  <p className="font-orbitron text-[0.7rem] text-white/40 mt-1">Intenta de nuevo</p>
                </div>
              )}

              {phase === 'success' && (
                <div className="text-center animate-scale-in">
                  <div className="text-[4rem] leading-none mb-2">✅</div>
                  <p className="font-orbitron text-[1rem] text-star-green">¡Correcto!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(phase === 'input' || phase === 'fail') && (
          <div className="w-full animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="panel-outer">
              <div className="panel-inner !p-3">
                <div className="grid grid-cols-3 gap-2">
                  {SYMBOLS.map((sym) => (
                    <button
                      key={sym.id}
                      onClick={() => handleSymbolPress(SYMBOLS.indexOf(sym))}
                      disabled={phase === 'fail'}
                      className={`
                        flex flex-col items-center gap-1 py-3 rounded-lg
                        border border-star-border bg-white/[0.03]
                        hover:border-star-gold/50 hover:bg-star-gold/[0.08]
                        active:scale-95
                        transition-all duration-200
                        disabled:opacity-30 disabled:cursor-not-allowed
                        ${wrongFlash ? 'border-star-red/50 bg-star-red/10' : ''}
                      `}
                    >
                      <span className="text-[1.8rem]">{sym.icon}</span>
                      <span className="font-orbitron text-[0.5rem] text-white/30 tracking-wider">{sym.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Timer />
      </div>
    </div>
  );
}
