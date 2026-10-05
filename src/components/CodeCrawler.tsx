import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  radius: number;
  opacity: number;
  pulsePhase: number;
}

interface Thread {
  from: number;
  to: number;
  alpha: number;
  age: number;
}

interface SpiderLeg {
  angle: number;
  length: number;
  bend: number;
  phase: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TECH_LABELS = [
  'React', 'TypeScript', 'Python', 'FastAPI', 'Node.js',
  'Web3', 'Solidity', 'Git', 'async/await', 'REST',
  'SQL', 'Docker', 'Vite', 'CSS', 'GraphQL',
  '</>', '{ }', '[ ]', '=>', '#!/',
];

const NODE_COUNT = 18;
const CONNECT_DIST = 180;
const CURSOR_ATTRACT_DIST = 220;
const SPIDER_SPEED = 1.4;
const SPIDER_SIZE = 10;
const THREAD_LIFE = 340;
const LEG_COUNT = 8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function getCSSColor(isDark: boolean, alpha = 1) {
  return isDark
    ? `rgba(255,255,255,${alpha})`
    : `rgba(9,9,11,${alpha})`;
}

function getAccentColor(isDark: boolean, alpha = 1) {
  return isDark
    ? `rgba(180,180,255,${alpha})`
    : `rgba(70,70,180,${alpha})`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CodeCrawler({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    nodes: [] as Node[],
    threads: [] as Thread[],
    spider: { x: 0, y: 0, targetIdx: 0, legPhase: 0 },
    cursor: { x: -9999, y: -9999 },
    legs: [] as SpiderLeg[],
    frame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas!.width;
    const H = () => canvas!.height;

    const s = stateRef.current;

    s.nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: 80 + Math.random() * (W() - 160),
      y: 80 + Math.random() * (H() - 160),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      label: TECH_LABELS[i % TECH_LABELS.length],
      radius: 4 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    s.spider.x = W() / 2;
    s.spider.y = H() / 2;
    s.spider.targetIdx = 0;

    s.legs = Array.from({ length: LEG_COUNT }, (_, i) => ({
      angle: (i / LEG_COUNT) * Math.PI * 2,
      length: SPIDER_SIZE * 2.2,
      bend: SPIDER_SIZE * 1.1,
      phase: (i / LEG_COUNT) * Math.PI * 2,
    }));

    function onMouseMove(e: MouseEvent) {
      s.cursor.x = e.clientX;
      s.cursor.y = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove);

    function drawLeg(
      cx: number, cy: number,
      angle: number, length: number,
      bend: number, walkBob: number,
      isDark: boolean,
    ) {
      const tipX = cx + Math.cos(angle) * length;
      const tipY = cy + Math.sin(angle) * length + walkBob;
      const kneeX = cx + Math.cos(angle + 0.45) * length * 0.55 + Math.cos(angle) * bend;
      const kneeY = cy + Math.sin(angle + 0.45) * length * 0.55 + Math.sin(angle) * bend + walkBob * 0.5;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(kneeX, kneeY, tipX, tipY);
      ctx.strokeStyle = getCSSColor(isDark, 0.7);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = getCSSColor(isDark, 0.5);
      ctx.fill();
    }

    let raf: number;

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!canvas || !ctx) return;

      s.frame++;

      ctx.clearRect(0, 0, W(), H());

      // Move nodes
      for (const n of s.nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 60 || n.x > W() - 60) n.vx *= -1;
        if (n.y < 60 || n.y > H() - 60) n.vy *= -1;
        n.x = Math.max(60, Math.min(W() - 60, n.x));
        n.y = Math.max(60, Math.min(H() - 60, n.y));
      }

      // Passive web lines
      for (let i = 0; i < s.nodes.length; i++) {
        for (let j = i + 1; j < s.nodes.length; j++) {
          const d = dist(s.nodes[i].x, s.nodes[i].y, s.nodes[j].x, s.nodes[j].y);
          if (d < CONNECT_DIST) {
            const a = (1 - d / CONNECT_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(s.nodes[i].x, s.nodes[i].y);
            ctx.lineTo(s.nodes[j].x, s.nodes[j].y);
            ctx.strokeStyle = getCSSColor(darkMode, a);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Cursor threads
      if (s.cursor.x > 0) {
        for (const n of s.nodes) {
          const d = dist(s.cursor.x, s.cursor.y, n.x, n.y);
          if (d < CURSOR_ATTRACT_DIST) {
            const a = (1 - d / CURSOR_ATTRACT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(s.cursor.x, s.cursor.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = getAccentColor(darkMode, a);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Silk threads (spider history)
      s.threads = s.threads.filter(t => t.alpha > 0.005);
      for (const t of s.threads) {
        t.age++;
        t.alpha = Math.max(0, 1 - t.age / THREAD_LIFE);

        const nA = s.nodes[t.from];
        const nB = s.nodes[t.to];
        const mx = (nA.x + nB.x) / 2;
        const my = (nA.y + nB.y) / 2;

        ctx.beginPath();
        ctx.moveTo(nA.x, nA.y);
        ctx.quadraticCurveTo(mx, my, nB.x, nB.y);
        ctx.strokeStyle = getAccentColor(darkMode, t.alpha * 0.55);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Move spider
      const target = s.nodes[s.spider.targetIdx];
      let tX = target.x, tY = target.y;

      const cursorDist = dist(s.spider.x, s.spider.y, s.cursor.x, s.cursor.y);
      if (cursorDist < CURSOR_ATTRACT_DIST && s.cursor.x > 0) {
        const t = 1 - cursorDist / CURSOR_ATTRACT_DIST;
        tX = tX * (1 - t * 0.6) + s.cursor.x * t * 0.6;
        tY = tY * (1 - t * 0.6) + s.cursor.y * t * 0.6;
      }

      const dx = tX - s.spider.x;
      const dy = tY - s.spider.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      s.spider.legPhase += 0.12;

      if (d < 8) {
        const prev = s.spider.targetIdx;
        let next = Math.floor(Math.random() * s.nodes.length);
        while (next === prev) next = Math.floor(Math.random() * s.nodes.length);
        s.threads.push({ from: prev, to: next, alpha: 1, age: 0 });
        s.spider.targetIdx = next;
      } else {
        s.spider.x += (dx / d) * SPIDER_SPEED;
        s.spider.y += (dy / d) * SPIDER_SPEED;
      }

      // Draw spider
      const sp = s.spider;
      const walkBob = Math.sin(sp.legPhase) * 2.5;
      const spiderAngle = Math.atan2(dy, dx);

      // Dashed silk line to target
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = getAccentColor(darkMode, 0.25);
      ctx.lineWidth = 0.6;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legs
      for (let i = 0; i < s.legs.length; i++) {
        const leg = s.legs[i];
        const walkAngle = leg.angle + Math.sin(sp.legPhase + leg.phase) * 0.18;
        const walkLen = leg.length + Math.sin(sp.legPhase + leg.phase + Math.PI) * 2;
        drawLeg(sp.x, sp.y, walkAngle, walkLen, leg.bend, walkBob * (i % 2 === 0 ? 1 : -1), darkMode);
      }

      // Abdomen
      ctx.beginPath();
      ctx.ellipse(
        sp.x - Math.cos(spiderAngle) * SPIDER_SIZE * 0.9,
        sp.y - Math.sin(spiderAngle) * SPIDER_SIZE * 0.9,
        SPIDER_SIZE * 0.85, SPIDER_SIZE * 0.65,
        spiderAngle, 0, Math.PI * 2
      );
      ctx.fillStyle = getCSSColor(darkMode, 0.12);
      ctx.fill();
      ctx.strokeStyle = getCSSColor(darkMode, 0.5);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Cephalothorax
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, SPIDER_SIZE * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getCSSColor(darkMode, 0.18);
      ctx.fill();
      ctx.strokeStyle = getCSSColor(darkMode, 0.8);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eyes
      for (let e = -1; e <= 1; e += 2) {
        const ex = sp.x + Math.cos(spiderAngle) * SPIDER_SIZE * 0.3 + Math.cos(spiderAngle + Math.PI / 2) * 2.2 * e;
        const ey = sp.y + Math.sin(spiderAngle) * SPIDER_SIZE * 0.3 + Math.sin(spiderAngle + Math.PI / 2) * 2.2 * e;
        ctx.beginPath();
        ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = getAccentColor(darkMode, 0.9);
        ctx.fill();
      }

      // Draw nodes
      for (const n of s.nodes) {
        const pulse = 0.6 + 0.4 * Math.sin(s.frame * 0.03 + n.pulsePhase);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = getAccentColor(darkMode, 0.04 * pulse);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = getCSSColor(darkMode, n.opacity * 0.25);
        ctx.fill();
        ctx.strokeStyle = getCSSColor(darkMode, n.opacity * 0.6);
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.font = `500 9px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = getCSSColor(darkMode, n.opacity * 0.55);
        ctx.fillText(n.label, n.x, n.y + n.radius + 11);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      id="code-crawler-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
