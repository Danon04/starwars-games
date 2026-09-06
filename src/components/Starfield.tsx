import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: { x: number; y: number; r: number; a: number; speed: number; phase: number }[] = [];
    let animId = 0;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      const count = Math.floor((w * h) / 3000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.0008 + 0.0002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const flicker = 0.5 + 0.5 * Math.sin(time * s.speed * 1000 + s.phase);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,220,255,${s.a * flicker})`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    animId = requestAnimationFrame(draw);

    const onResize = () => { resize(); createStars(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
