'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      va: number;
      size: number;
      color: string;
    }> = [];

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.2,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 4,
        angle: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 2,
        color: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98'][
          Math.floor(Math.random() * 5)
        ],
      });
    }

    let animationFrames = 0;
    const maxFrames = 150;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.angle += p.va;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          confetti.splice(i, 1);
        }
      }

      animationFrames++;
      if (animationFrames < maxFrames && confetti.length > 0) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();
  }, [active, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
