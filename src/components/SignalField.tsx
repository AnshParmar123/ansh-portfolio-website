import { useEffect, useRef } from "react";
import "./styles/SignalField.css";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

const SignalField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const pointer = { x: -1000, y: -1000 };

    const createNode = (): Node => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 1.35 + 0.45,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(82, Math.max(42, Math.round((width * height) / 19000)));
      nodes = Array.from({ length: count }, createNode);
    };

    const movePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const pulse = time * 0.00055;

      nodes.forEach((node) => {
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 190 && distance > 0) {
          const force = (190 - distance) / 190;
          node.vx -= (dx / distance) * force * 0.012;
          node.vy -= (dy / distance) * force * 0.012;
        }
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.995;
        node.vy *= 0.995;
        if (node.x < -20 || node.x > width + 20) node.vx *= -1;
        if (node.y < -20 || node.y > height + 20) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 135) {
            const alpha = (1 - distance / 135) * 0.13;
            context.strokeStyle = `rgba(215, 255, 63, ${alpha})`;
            context.lineWidth = 0.6;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const glow = 0.45 + Math.sin(pulse + node.phase) * 0.25;
        context.fillStyle = `rgba(242, 242, 237, ${glow})`;
        context.beginPath();
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fill();
      });

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
    };
  }, []);

  return <canvas className="signal-field" ref={canvasRef} aria-hidden="true" />;
};

export default SignalField;
