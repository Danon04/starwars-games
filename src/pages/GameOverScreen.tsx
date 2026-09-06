export default function GameOverScreen() {
  return (
    <div className="relative z-2 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <div className="text-[5rem] mb-4 animate-scale-in" style={{ filter: 'grayscale(0.5)' }}>&#128308;</div>
        <h1 className="font-orbitron text-[clamp(2rem,5vw,3.5rem)] font-black text-star-red mb-3 animate-fade-up"
          style={{ textShadow: '0 0 40px rgba(255,51,51,0.5)' }}>
          TIEMPO AGOTADO
        </h1>
        <p className="text-white/50 text-[1.1rem] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          El sistema de seguridad ha bloqueado el acceso
        </p>
        <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => location.reload()}
            className="px-8 py-3 rounded-lg border border-star-border bg-transparent
              text-star-cyan font-orbitron text-[0.85rem] font-bold tracking-[0.2em] uppercase
              hover:border-star-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]
              transition-all duration-300"
          >
            Intentar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
