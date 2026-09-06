import { useGame } from '../store/gameState';

export default function VictoryScreen() {
  const { timeRemaining, timeTotal, masterCode } = useGame();
  const elapsed = timeTotal - timeRemaining;
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;

  return (
    <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <div className="text-[5rem] mb-4 animate-scale-in">&#11088;</div>
        <h1
          className="font-orbitron text-[clamp(2rem,5vw,3.5rem)] font-black mb-3 animate-fade-up"
          style={{
            background: 'linear-gradient(135deg, #ffe81f, #fff, #ffe81f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SISTEMA DESACTIVADO
        </h1>
        <p className="text-white/60 text-[1.1rem] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Escape Room completado con exito
        </p>

        <div className="panel-outer inline-block mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="panel-inner">
            <p className="font-orbitron text-[0.65rem] tracking-[0.4em] uppercase text-white/35 mb-2">
              Tiempo final
            </p>
            <p className="font-orbitron text-[3rem] font-black text-star-gold text-glow-gold">
              {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
            </p>
            <div className="w-[60px] h-px mx-auto bg-gradient-to-r from-transparent via-star-border to-transparent my-4" />
            <p className="font-orbitron text-[0.65rem] tracking-[0.4em] uppercase text-white/35 mb-2">
              Codigo maestro
            </p>
            <p className="font-orbitron text-[2rem] font-bold text-star-cyan text-glow-cyan tracking-[0.3em]">
              {masterCode}
            </p>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => location.reload()}
            className="px-8 py-3 rounded-lg border border-star-border bg-transparent
              text-star-cyan font-orbitron text-[0.85rem] font-bold tracking-[0.2em] uppercase
              hover:border-star-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]
              transition-all duration-300"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
