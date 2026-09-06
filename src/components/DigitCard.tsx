interface DigitCardProps {
  digit: number;
  stationName: string;
}

export default function DigitCard({ digit, stationName }: DigitCardProps) {
  return (
    <div className="text-center animate-scale-in">
      <div className="panel-outer">
        <div className="panel-inner">
          <p className="font-orbitron text-[0.65rem] tracking-[0.4em] uppercase text-white/35 mb-4">
            Tu digito es
          </p>
          <div className="font-orbitron text-[5rem] font-black text-star-gold text-glow-gold leading-none mb-4">
            {digit}
          </div>
          <div className="w-[60px] h-px mx-auto bg-gradient-to-r from-transparent via-star-border to-transparent mb-4" />
          <p className="text-white/45 text-[0.95rem] leading-relaxed">
            <strong className="text-star-gold">{stationName}</strong> completada.
            <br />Anota este numero.
          </p>
        </div>
      </div>
    </div>
  );
}
