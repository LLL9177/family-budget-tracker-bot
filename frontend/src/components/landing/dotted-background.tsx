import { useEffect, useRef } from "react";

export default function DottedBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;

    const cols = 80;
    const rows = 40;
    const spacing = 30;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave = Math.sin(x * 0.3 + t) * 6 + Math.cos(y * 0.3 + t) * 6;

          const px = x * spacing + wave;
          const py = y * spacing + wave;

          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);

          ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
          ctx.fill();
        }
      }

      t += 0.02;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas className="fixed inset-0 -z-10 h-screen w-screen" ref={ref} />;
}
