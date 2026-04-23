'use client';

import { useEffect, useRef } from 'react';

interface StarBurstProps {
  active: boolean;
  x: number;
  y: number;
  onComplete?: () => void;
}

export function StarBurst({ active, x, y, onComplete }: StarBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
      size: number;
    }> = [];

    // Create star particles in a burst pattern
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = 5 + Math.random() * 3;
      stars.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
        size: Math.random() * 8 + 4,
      });
    }

    let animationFrames = 0;
    const maxFrames = 100;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15;
        s.opacity -= 0.01;

        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.font = `${s.size}px Arial`;
        ctx.fillText('⭐', s.x, s.y);
        ctx.restore();

        if (s.opacity <= 0) {
          stars.splice(i, 1);
        }
      }

      animationFrames++;
      if (animationFrames < maxFrames && stars.length > 0) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();
  }, [active, x, y, onComplete]);

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
