import { useState, useEffect, useRef } from 'react';
import { useGame } from '../store/gameState';
import { shuffleArray } from '../utils/codeGenerator';
import Timer from '../components/Timer';
import DigitCard from '../components/DigitCard';

const CORRECT_ORDER = ['tatooine', 'hoth', 'endor', 'naboo', 'mustafar', 'bespin'];

interface Planet {
  id: string;
  name: string;
  cssClass: string;
}

const PLANETS: Planet[] = [
  { id: 'tatooine', name: 'Tatooine', cssClass: 'planet-tatooine' },
  { id: 'hoth', name: 'Hoth', cssClass: 'planet-hoth' },
  { id: 'endor', name: 'Endor', cssClass: 'planet-endor' },
  { id: 'naboo', name: 'Naboo', cssClass: 'planet-naboo' },
  { id: 'mustafar', name: 'Mustafar', cssClass: 'planet-mustafar' },
  { id: 'bespin', name: 'Bespin', cssClass: 'planet-bespin' },
];

type Feedback = 'correct' | 'wrong' | null;

export default function Station2Planets() {
  const { completeStation, setCurrentStation, targetDigits } = useGame();
  const [order, setOrder] = useState<Planet[]>(() => shuffleArray([...PLANETS]));
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [verified, setVerified] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showDigit, setShowDigit] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const digitRef = useRef(targetDigits.planets);

  const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
  const wrongCount = Object.values(feedback).filter(f => f === 'wrong').length;

  useEffect(() => {
    if (solved) {
      setTimeout(() => {
        completeStation(2, digitRef.current);
        setShowDigit(true);
      }, 1200);
    }
  }, [solved, completeStation]);

  useEffect(() => {
    if (showDigit) {
      const timer = setTimeout(() => {
        setCurrentStation(3);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showDigit, setCurrentStation]);

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setOrder(prev => {
      const next = [...prev];
      [next[dragIdx], next[targetIdx]] = [next[targetIdx], next[dragIdx]];
      return next;
    });
    setDragIdx(null);
    setFeedback({});
    setVerified(false);
  }

  function verify() {
    const fb: Record<string, Feedback> = {};
    order.forEach((planet, i) => {
      if (planet.id === CORRECT_ORDER[i]) {
        fb[planet.id] = 'correct';
      } else {
        fb[planet.id] = 'wrong';
      }
    });
    setFeedback(fb);
    setVerified(true);

    if (order.every((p, i) => p.id === CORRECT_ORDER[i])) {
      setSolved(true);
    }
  }

  function reset() {
    setOrder(shuffleArray([...PLANETS]));
    setFeedback({});
    setVerified(false);
    setSolved(false);
    setShowDigit(false);
  }

  if (showDigit) {
    return (
      <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
        <Timer />
        <DigitCard digit={digitRef.current} stationName="Estacion 2 - Planetas" />
      </div>
    );
  }

  return (
    <div className="relative z-2 flex flex-col items-center min-h-screen px-4 py-8">
      <div className="text-center mb-6 animate-fade-down">
        <p className="font-orbitron text-[0.7rem] tracking-[0.4em] uppercase text-star-cyan/60 mb-3">
          Estacion 2 de 4
        </p>
        <h2 className="font-orbitron text-[clamp(1.5rem,4vw,2.2rem)] font-black text-star-gold text-glow-gold">
          Ordena los Planetas
        </h2>
        <p className="text-white/45 text-[1rem] mt-2">
          Coloca los planetas en el orden de la saga
        </p>
      </div>

      <Timer />

      <div className="w-full max-w-[1100px] animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="panel-outer">
          <div className="panel-inner">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 justify-items-center mb-8">
              {order.map((planet, i) => (
                <div
                  key={planet.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  onClick={() => {
                    if (dragIdx === null) setDragIdx(i);
                    else { handleDrop(i); }
                  }}
                  className={`
                    flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing
                    transition-all duration-300 w-full max-w-[160px]
                    hover:-translate-y-1
                    ${dragIdx === i ? 'opacity-40 scale-95' : ''}
                    ${solved ? 'pointer-events-none' : ''}
                  `}
                  style={{ paddingTop: '2rem' }}
                >
                  <div className="relative">
                    {verified && feedback[planet.id] && (
                      <div
                        className={`
                          absolute -top-8 left-1/2 -translate-x-1/2 z-10
                          px-3 py-1 rounded-full whitespace-nowrap
                          font-orbitron text-[0.65rem] font-bold tracking-wider uppercase
                          ${feedback[planet.id] === 'correct'
                            ? 'bg-star-green/15 border border-star-green text-star-green shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                            : 'bg-star-yellow/15 border border-star-yellow text-star-yellow shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                          }
                        `}
                      >
                        {feedback[planet.id] === 'correct' ? 'Correcto' : 'Posicion incorrecta'}
                      </div>
                    )}
                    <div className="absolute top-0 right-0 -translate-y-1 translate-x-1 w-7 h-7 rounded-full
                      bg-star-panel border border-star-border flex items-center justify-center z-10">
                      <span className="font-orbitron text-[0.7rem] font-bold text-star-cyan">{i + 1}</span>
                    </div>
                    <div className={`planet-sphere ${planet.cssClass}`}>
                      <div className="absolute inset-[-2px] rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]
                        z-[2] pointer-events-none" />
                      <div className="absolute inset-0 rounded-full
                        bg-[linear-gradient(135deg,transparent_40%,rgba(0,0,0,0.6)_100%)]
                        z-[3] pointer-events-none" />
                    </div>
                  </div>
                  <span className="font-orbitron text-[0.85rem] font-semibold tracking-wider uppercase text-white/85">
                    {planet.name}
                  </span>
                </div>
              ))}
            </div>

            {verified && (
              <div className="flex items-center justify-center gap-8 md:gap-12 mb-6 flex-wrap">
                <div className="text-center">
                  <span className="font-orbitron text-[2.5rem] font-black text-star-gold block"
                    style={{ background: 'linear-gradient(135deg, #ffe81f, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {correctCount}
                  </span>
                  <span className="font-orbitron text-[0.75rem] tracking-[0.2em] uppercase text-white/45">
                    Posicion correcta
                  </span>
                </div>
                <div className="w-px h-[50px] bg-star-border" />
                <div className="text-center">
                  <span className="font-orbitron text-[2.5rem] font-black text-star-gold block"
                    style={{ background: 'linear-gradient(135deg, #ffe81f, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {wrongCount}
                  </span>
                  <span className="font-orbitron text-[0.75rem] tracking-[0.2em] uppercase text-white/45">
                    Posicion incorrecta
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={verify}
                disabled={solved}
                className="px-8 py-3 rounded-lg font-orbitron text-[0.85rem] font-bold tracking-[0.2em] uppercase
                  bg-gradient-to-r from-star-gold to-star-gold-dim text-star-dark
                  shadow-[0_4px_20px_rgba(255,232,31,0.3)]
                  hover:shadow-[0_6px_30px_rgba(255,232,31,0.5)] hover:-translate-y-0.5
                  active:scale-[0.97]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-300"
              >
                Verificar Orden
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 rounded-lg border border-star-border bg-transparent
                  text-star-cyan font-orbitron text-[0.85rem] font-bold tracking-[0.2em] uppercase
                  hover:border-star-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]
                  transition-all duration-300"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
