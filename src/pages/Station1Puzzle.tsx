import { useState, useEffect, useRef } from 'react';
import { useGame } from '../store/gameState';
import { shuffleArray } from '../utils/codeGenerator';
import Timer from '../components/Timer';
import DigitCard from '../components/DigitCard';

const COLS = 5;
const ROWS = 6;
const TOTAL = ROWS * COLS;
const IMG = '/images/puzzle.jpg';

interface Piece {
  id: number;
  currentIdx: number;
}

function createPieces(): Piece[] {
  return Array.from({ length: TOTAL }, (_, i) => ({ id: i, currentIdx: i }));
}

function shufflePieces(pieces: Piece[]): Piece[] {
  const indices = shuffleArray(pieces.map(p => p.currentIdx));
  if (indices.every((v, i) => v === i)) [indices[0], indices[1]] = [indices[1], indices[0]];
  return pieces.map((p, i) => ({ id: p.id, currentIdx: indices[i] }));
}

export default function Station1Puzzle() {
  const { completeStation, setCurrentStation, targetDigits } = useGame();
  const [pieces, setPieces] = useState<Piece[]>(() => shufflePieces(createPieces()));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [showDigit, setShowDigit] = useState(false);
  const digitRef = useRef(targetDigits.puzzle);

  const isSolved = pieces.every(p => p.currentIdx === p.id);

  useEffect(() => {
    if (isSolved && !solved) {
      setSolved(true);
      setTimeout(() => {
        completeStation(1, digitRef.current);
        setShowDigit(true);
      }, 500);
    }
  }, [isSolved, solved, completeStation]);

  useEffect(() => {
    if (showDigit) {
      const timer = setTimeout(() => {
        setCurrentStation(2);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showDigit, setCurrentStation]);

  function handleSwap(idx: number) {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      setPieces(prev => {
        const next = prev.map(p => ({ ...p }));
        const a = next.find(p => p.currentIdx === selectedIdx);
        const b = next.find(p => p.currentIdx === idx);
        if (a && b) {
          const tmp = a.currentIdx;
          a.currentIdx = b.currentIdx;
          b.currentIdx = tmp;
        }
        return next;
      });
      setSelectedIdx(null);
    }
  }

  function resetPuzzle() {
    setPieces(shufflePieces(createPieces()));
    setSelectedIdx(null);
    setSolved(false);
    setShowDigit(false);
  }

  if (showDigit) {
    return (
      <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
        <Timer />
        <DigitCard digit={digitRef.current} stationName="Estacion 1 - Puzle" />
      </div>
    );
  }

  return (
    <div className="relative z-2 flex flex-col items-center min-h-screen px-2 md:px-4 py-4">
      <div className="text-center mb-3 animate-fade-down">
        <p className="font-orbitron text-[0.65rem] tracking-[0.4em] uppercase text-star-cyan/60 mb-2">
          Estacion 1 de 4
        </p>
        <h2 className="font-orbitron text-[clamp(1.3rem,3.5vw,2rem)] font-black text-star-gold text-glow-gold">
          Arma el Puzle
        </h2>
        <p className="text-white/45 text-[0.85rem] mt-1">
          Selecciona dos piezas para intercambiarlas
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[min(90vw,600px)]">
        <div className="w-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="panel-outer">
            <div className="panel-inner !p-1.5 md:!p-2">
              <div
                className="grid gap-0.5 md:gap-1"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
              >
                {Array.from({ length: TOTAL }).map((_, displayIdx) => {
                  const piece = pieces.find(p => p.currentIdx === displayIdx);
                  if (!piece) return <div key={displayIdx} className="aspect-square" />;

                  const row = Math.floor(piece.id / COLS);
                  const col = piece.id % COLS;
                  const isSelected = selectedIdx === displayIdx;
                  const isCorrect = piece.currentIdx === piece.id;

                  return (
                    <div
                      key={`${piece.id}-${displayIdx}`}
                      onClick={() => handleSwap(displayIdx)}
                      className={`
                        aspect-square cursor-pointer relative overflow-hidden
                        transition-all duration-200
                        border
                        ${isSelected
                          ? 'border-star-gold shadow-[0_0_12px_rgba(255,232,31,0.5)] z-10 scale-105'
                          : 'border-transparent hover:border-white/30 hover:z-5'
                        }
                        ${isCorrect && solved ? 'border-star-green shadow-[0_0_10px_rgba(0,255,136,0.4)]' : ''}
                      `}
                    >
                      <div
                        className="w-full h-full bg-no-repeat"
                        style={{
                          backgroundImage: `url(${IMG})`,
                          backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                          backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-3">
        <Timer />
        <button
          onClick={resetPuzzle}
          className="px-6 py-2 rounded-lg border border-star-border bg-transparent
            text-star-cyan font-orbitron text-[0.7rem] tracking-[0.15em] uppercase
            hover:border-star-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]
            transition-all duration-300"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
