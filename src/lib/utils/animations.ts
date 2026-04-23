// Animation utility functions

export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

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
      y: 0,
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
      p.vy += 0.1; // gravity
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
      canvas.remove();
    }
  };

  animate();
}

export function triggerStarBurst(x: number, y: number) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

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
      s.vy += 0.15; // gravity
      s.opacity -= 0.01;

      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = '#FFD700';
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
      canvas.remove();
    }
  };

  animate();
}
