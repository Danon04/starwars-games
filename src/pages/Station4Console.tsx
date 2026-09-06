import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { useGame } from '../store/gameState';
import Timer from '../components/Timer';

export default function Station4Console() {
  const { attemptCode, digits, masterCode } = useGame();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusText, setStatusText] = useState('Ingresa el codigo de 3 digitos');
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = useCallback((idx: number) => {
    const el = inputsRef.current[idx];
    if (!el) return;
    el.value = el.value.replace(/[^0-9]/g, '');
    if (el.value && idx < 2) {
      inputsRef.current[idx + 1]?.focus();
    }
    const code = inputsRef.current.map(i => i?.value || '').join('');
    if (code.length === 3) {
      setStatusText('Codigo completo. Presiona Desactivar.');
      setStatus('idle');
    }
  }, []);

  const handleKeydown = useCallback((e: KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !inputsRef.current[idx]?.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === 'Enter') {
      attemptUnlock();
    }
  }, []);

  function attemptUnlock() {
    const code = inputsRef.current.map(i => i?.value || '').join('');
    if (code.length < 3) {
      setStatusText('Ingresa los 3 digitos del codigo');
      setStatus('error');
      return;
    }

    const success = attemptCode(code);
    if (success) {
      setStatus('success');
      setStatusText('CODIGO ACEPTADO. SISTEMA DESACTIVADO.');
      inputsRef.current.forEach(i => {
        if (i) {
          i.classList.remove('border-star-red');
          i.classList.add('border-star-green', 'text-star-green');
        }
      });
    } else {
      setStatus('error');
      setStatusText('CODIGO RECHAZADO. Intenta de nuevo.');
      setShake(true);
      inputsRef.current.forEach(i => {
        if (i) {
          i.classList.remove('border-star-gold');
          i.classList.add('border-star-red', 'text-star-red');
        }
      });
      setTimeout(() => {
        inputsRef.current.forEach(i => { if (i) i.value = ''; });
        inputsRef.current[0]?.focus();
        inputsRef.current.forEach(i => {
          if (i) i.classList.remove('border-star-red', 'text-star-red');
        });
        setShake(false);
      }, 800);
    }
  }

  const digitLabels = [
    { station: 'Estacion 1', name: 'Puzle', digit: digits.puzzle },
    { station: 'Estacion 2', name: 'Planetas', digit: digits.planets },
    { station: 'Estacion 3', name: 'Memoria', digit: digits.memory },
  ];

  return (
    <div className="relative z-2 flex flex-col items-center min-h-screen px-4 py-8">
      <div className="text-center mb-6 animate-fade-down">
        <p className="font-orbitron text-[0.7rem] tracking-[0.4em] uppercase text-star-cyan/60 mb-3">
          Estacion 4 de 4
        </p>
        <h2 className="font-orbitron text-[clamp(1.5rem,4vw,2.2rem)] font-black text-star-gold text-glow-gold">
          Consola de Acceso
        </h2>
        <p className="text-white/45 text-[1rem] mt-2">
          Ingresa el codigo maestro de 3 digitos
        </p>
      </div>

      <Timer />

      <div className="w-full max-w-[500px] animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="panel-outer">
          <div className="panel-inner">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-star-border">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="font-orbitron text-[0.7rem] tracking-[0.3em] uppercase text-white/40 ml-auto">
                Terminal Segura
              </span>
            </div>

            <p className="font-orbitron text-[0.85rem] tracking-[0.15em] text-star-cyan mb-6 text-center">
              &gt; INGRESA EL CODIGO MAESTRO_
            </p>

            <div className={`flex gap-4 justify-center mb-6 ${shake ? 'animate-shake' : ''}`}>
              {[0, 1, 2].map(i => (
                <input
                  key={i}
                  ref={el => { inputsRef.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]"
                  onInput={() => handleInput(i)}
                  onKeyDown={e => handleKeydown(e, i)}
                  className="w-[72px] h-[86px] bg-star-cyan/[0.03] border-2 border-star-border rounded-[0.85rem]
                    text-center font-orbitron text-[2.4rem] font-bold text-star-gold
                    outline-none transition-all duration-300
                    focus:border-star-gold focus:shadow-[0_0_25px_rgba(255,232,31,0.2),inset_0_0_12px_rgba(255,232,31,0.05)]
                    caret-star-gold
                    max-sm:w-[60px] max-sm:h-[72px] max-sm:text-[1.8rem]"
                />
              ))}
            </div>

            <p className={`font-orbitron text-[0.8rem] text-center min-h-[1.8rem] mb-4
              ${status === 'success' ? 'text-star-green' : status === 'error' ? 'text-star-red' : 'text-white/45'}`}>
              {statusText}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {digitLabels.map(d => (
                <div key={d.station} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-center">
                  <span className="font-orbitron text-[0.6rem] text-white/30 block">{d.station}</span>
                  <span className="font-orbitron text-[0.7rem] text-white/50">{d.name}</span>
                  <span className="font-orbitron text-[1.8rem] font-bold text-star-gold mt-1 block">
                    {d.digit !== null ? d.digit : '?'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={attemptUnlock}
              className="w-full py-4 rounded-xl font-orbitron text-[0.9rem] font-bold tracking-[0.2em] uppercase
                bg-gradient-to-r from-star-gold to-star-gold-dim text-star-dark
                shadow-[0_4px_20px_rgba(255,232,31,0.3)]
                hover:shadow-[0_6px_30px_rgba(255,232,31,0.5)] hover:-translate-y-0.5
                active:scale-[0.97]
                transition-all duration-300"
            >
              Desactivar Sistema
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full mt-3 py-2 rounded-lg border border-star-border bg-transparent
                text-white/30 font-orbitron text-[0.65rem] tracking-[0.15em] uppercase
                hover:text-white/50 hover:border-white/30
                transition-all duration-300"
            >
              {showHint ? 'Ocultar pista' : 'Mostrar pista (testing)'}
            </button>

            {showHint && (
              <div className="mt-3 p-3 rounded-lg bg-star-cyan/10 border border-star-cyan/30 text-center">
                <p className="font-orbitron text-[0.7rem] text-star-cyan/70 mb-1">Codigo maestro:</p>
                <p className="font-orbitron text-[2rem] font-black text-star-gold tracking-[0.5em]">
                  {masterCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
