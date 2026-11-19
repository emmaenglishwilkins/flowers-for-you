import { useCallback, useEffect, useRef, useState } from 'react';
import { HeroTwinFlowersPlinth } from './components/BlackworkBotanicals';
import { InkFilters } from './components/InkFilters';
import { ProjectStation } from './components/ProjectStation';
import { PROJECTS, WORLD_HEIGHT, WORLD_WIDTH, type PortfolioProject } from './data/portfolio';
import {
  renderFieldCanvas,
  renderSpotlightOptics,
  type SpotlightState
} from './utils/stageRenderer';
import { bearingDegrees, wrapCoord, wrapDelta } from './utils/torus';

interface GlideTarget {
  x: number;
  y: number;
}

export default function App() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const darkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paperCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const opticsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const illuminatedLayerRef = useRef<HTMLDivElement | null>(null);

  const heroNodeRef = useRef<HTMLDivElement | null>(null);
  const stationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [workLight, setWorkLight] = useState(false);
  const [bloomingId, setBloomingId] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Mutable simulation state kept outside React for locked 60fps toroidal physics
  const simRef = useRef({
    camX: 0,
    camY: 0,
    vx: 0,
    vy: 0,
    bearing: 0,
    glide: null as GlideTarget | null,
    isDragging: false,
    dragMoved: false,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    spotX: 0,
    spotY: 0,
    spotRadius: 365,
    spotVx: 0,
    spotVy: 0,
    motionAngle: 0,
    workLightMix: 0,
    keys: new Set<string>(),
    trail: [] as Array<{ x: number; y: number; alpha: number; r: number }>,
    lastTelemetryAt: 0,
    lastTrailAt: 0,
    viewportW: typeof window !== 'undefined' ? window.innerWidth : 1440,
    viewportH: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  // Sync latest React state flags into refs readable from the rAF loop
  const workLightRef = useRef(workLight);
  workLightRef.current = workLight;

  const hoveredRef = useRef(hoveredProjectId);
  hoveredRef.current = hoveredProjectId;

  const glideTo = useCallback((x: number, y: number) => {
    simRef.current.glide = { x, y };
    simRef.current.vx *= 0.25;
    simRef.current.vy *= 0.25;
  }, []);

  // The flower is the project. Bloom it in place — the gallery comes later.
  const handleSelectProject = useCallback((project: PortfolioProject) => {
    if (simRef.current.dragMoved) return;
    setBloomingId(project.id);
    glideTo(project.x, project.y);
  }, [glideTo]);

  // Canvas resize & HiDPI scaling
  useEffect(() => {
    const syncSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      simRef.current.viewportW = w;
      simRef.current.viewportH = h;
      if (!simRef.current.pointerActive) {
        simRef.current.pointerX = w * 0.5;
        simRef.current.pointerY = h * 0.5;
        simRef.current.spotX = w * 0.5;
        simRef.current.spotY = h * 0.5;
      }

      for (const canvas of [darkCanvasRef.current, paperCanvasRef.current, opticsCanvasRef.current]) {
        if (!canvas) continue;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    syncSize();
    window.addEventListener('resize', syncSize);
    return () => window.removeEventListener('resize', syncSize);
  }, []);

  // Wheel (2D trackpad + mouse wheel) & Keyboard 360° controls
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      simRef.current.glide = null;
      const scale = e.deltaMode === 1 ? 26 : e.deltaMode === 2 ? 220 : 1;
      simRef.current.vx += (e.deltaX * scale) * 0.14;
      simRef.current.vy += (e.deltaY * scale) * 0.14;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        simRef.current.glide = null;
        simRef.current.keys.add(e.key);
      } else if (e.key === 'l' || e.key === 'L') {
        setWorkLight((v) => !v);
      } else if (e.key === 'Home' || e.key === '0') {
        glideTo(0, 0);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keys.delete(e.key);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [glideTo]);

  // Unified 60fps physics, toroidal DOM wrapping, spotlight mask & canvas loop
  useEffect(() => {
    let rafId = 0;

    const tick = (nowMs: number) => {
      const sim = simRef.current;
      const w = sim.viewportW;
      const h = sim.viewportH;
      const halfW = w * 0.5;
      const halfH = h * 0.5;

      // 1. Keyboard 360° steering acceleration
      const accel = 2.35;
      if (sim.keys.has('ArrowLeft')) sim.vx -= accel;
      if (sim.keys.has('ArrowRight')) sim.vx += accel;
      if (sim.keys.has('ArrowUp')) sim.vy -= accel;
      if (sim.keys.has('ArrowDown')) sim.vy += accel;

      // 2. Smooth shortest-path toroidal glide if active
      if (sim.glide) {
        const dx = wrapDelta(sim.glide.x, sim.camX, WORLD_WIDTH);
        const dy = wrapDelta(sim.glide.y, sim.camY, WORLD_HEIGHT);
        const dist = Math.hypot(dx, dy);

        if (dist < 4) {
          sim.camX = wrapCoord(sim.glide.x, WORLD_WIDTH);
          sim.camY = wrapCoord(sim.glide.y, WORLD_HEIGHT);
          sim.vx = 0;
          sim.vy = 0;
          sim.glide = null;
        } else {
          sim.vx = dx * 0.095;
          sim.vy = dy * 0.095;
        }
      }

      // 3. Apply velocity & organic inertia damping
      const maxSpeed = 62;
      const rawSpeed = Math.hypot(sim.vx, sim.vy);
      if (rawSpeed > maxSpeed) {
        sim.vx = (sim.vx / rawSpeed) * maxSpeed;
        sim.vy = (sim.vy / rawSpeed) * maxSpeed;
      }

      sim.camX = wrapCoord(sim.camX + sim.vx, WORLD_WIDTH);
      sim.camY = wrapCoord(sim.camY + sim.vy, WORLD_HEIGHT);

      if (!sim.isDragging && !sim.glide) {
        sim.vx *= 0.915;
        sim.vy *= 0.915;
        if (Math.abs(sim.vx) < 0.025) sim.vx = 0;
        if (Math.abs(sim.vy) < 0.025) sim.vy = 0;
      }

      const speed = Math.hypot(sim.vx, sim.vy);
      if (speed > 0.35) {
        sim.bearing = bearingDegrees(sim.vx, sim.vy);
        sim.motionAngle = Math.atan2(sim.vy, sim.vx);
      }

      // 4. Spotlight physics: responds to cursor + scroll velocity + direction bloom!
      const targetWorkMix = workLightRef.current ? 1 : 0;
      sim.workLightMix += (targetWorkMix - sim.workLightMix) * 0.12;

      // Magnetize follow-spot between viewport center and pointer, plus lead ahead along travel velocity
      const cursorPull = sim.pointerActive ? 0.42 : 0;
      const baseX = halfW + (sim.pointerX - halfW) * cursorPull;
      const baseY = halfH + (sim.pointerY - halfH) * cursorPull;

      const leadX = Math.max(-165, Math.min(165, sim.vx * 3.8));
      const leadY = Math.max(-145, Math.min(145, sim.vy * 3.8));

      const targetSpotX = Math.max(90, Math.min(w - 90, baseX + leadX));
      const targetSpotY = Math.max(90, Math.min(h - 90, baseY + leadY));

      sim.spotX += (targetSpotX - sim.spotX) * 0.14;
      sim.spotY += (targetSpotY - sim.spotY) * 0.14;
      sim.spotVx += (sim.vx - sim.spotVx) * 0.18;
      sim.spotVy += (sim.vy - sim.spotVy) * 0.18;

      const baseRadius = Math.min(w, h) * 0.4;
      const targetRadius = Math.max(250, Math.min(420, baseRadius)) + Math.min(speed * 3.2, 90);
      sim.spotRadius += (targetRadius - sim.spotRadius) * 0.11;

      // Record subtle fading beam motion trail echoes when sweeping across the field
      if (speed > 2.8 && nowMs - sim.lastTrailAt > 48) {
        sim.lastTrailAt = nowMs;
        sim.trail.push({
          x: sim.spotX - sim.spotVx * 2.2,
          y: sim.spotY - sim.spotVy * 2.2,
          alpha: Math.min(0.85, speed / 22),
          r: sim.spotRadius * 0.72
        });
        if (sim.trail.length > 9) sim.trail.shift();
      }
      for (const tp of sim.trail) {
        tp.alpha *= 0.91;
        tp.r *= 1.008;
      }
      sim.trail = sim.trail.filter((tp) => tp.alpha > 0.02);

      // 5. Update CSS custom properties driving the multi-lobe Spotlight mask on the illuminated world
      const layer = illuminatedLayerRef.current;
      if (layer) {
        const maxViewportR = Math.hypot(w, h) * 1.15;
        const effectiveR = sim.spotRadius + (maxViewportR - sim.spotRadius) * sim.workLightMix;
        const speedNorm = Math.min(speed / 24, 1);

        const flareX = sim.spotX + sim.spotVx * 4.5;
        const flareY = sim.spotY + sim.spotVy * 4.5;
        const flareR = effectiveR * (0.58 + speedNorm * 0.34);

        const trailX = sim.spotX - sim.spotVx * 5.2;
        const trailY = sim.spotY - sim.spotVy * 5.2;
        const trailR = effectiveR * (0.48 + speedNorm * 0.25);

        layer.style.setProperty('--spot-x', `${sim.spotX.toFixed(1)}px`);
        layer.style.setProperty('--spot-y', `${sim.spotY.toFixed(1)}px`);
        layer.style.setProperty('--spot-r', `${effectiveR.toFixed(1)}px`);
        layer.style.setProperty('--flare-x', `${flareX.toFixed(1)}px`);
        layer.style.setProperty('--flare-y', `${flareY.toFixed(1)}px`);
        layer.style.setProperty('--flare-r', `${flareR.toFixed(1)}px`);
        layer.style.setProperty('--trail-x', `${trailX.toFixed(1)}px`);
        layer.style.setProperty('--trail-y', `${trailY.toFixed(1)}px`);
        layer.style.setProperty('--trail-r', `${trailR.toFixed(1)}px`);
        layer.style.setProperty(
          '--work-light-on',
          sim.workLightMix > 0.97 ? '1' : '0'
        );
      }

      // 6. Position wrapped toroidal DOM landmarks directly (zero React re-renders per frame)
      if (heroNodeRef.current) {
        const hx = halfW + wrapDelta(0, sim.camX, WORLD_WIDTH);
        const hy = halfH + wrapDelta(0, sim.camY, WORLD_HEIGHT);
        heroNodeRef.current.style.transform = `translate3d(${hx.toFixed(1)}px, ${hy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      for (const project of PROJECTS) {
        const el = stationRefs.current[project.id];
        if (!el) continue;
        const px = halfW + wrapDelta(project.x, sim.camX, WORLD_WIDTH);
        const py = halfH + wrapDelta(project.y, sim.camY, WORLD_HEIGHT);
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      // 7. Render the dark field, the lit paper, and the soft spotlight optics
      const darkCtx = darkCanvasRef.current?.getContext('2d');
      if (darkCtx && sim.workLightMix < 0.99) {
        renderFieldCanvas(darkCtx, w, h, sim.camX, sim.camY, true, hoveredRef.current);
      }

      const paperCtx = paperCanvasRef.current?.getContext('2d');
      if (paperCtx) {
        renderFieldCanvas(paperCtx, w, h, sim.camX, sim.camY, false, hoveredRef.current);
      }

      const opticsCtx = opticsCanvasRef.current?.getContext('2d');
      if (opticsCtx) {
        const spotState: SpotlightState = {
          x: sim.spotX,
          y: sim.spotY,
          radius: sim.spotRadius,
          vx: sim.spotVx,
          vy: sim.spotVy,
          speed,
          workLightMix: sim.workLightMix,
          motionAngle: sim.motionAngle
        };
        renderSpotlightOptics(opticsCtx, w, h, spotState, nowMs * 0.001, sim.trail);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Pointer drag panning + live spotlight cursor tracking
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('.hud-root, .index-drawer, .modal-backdrop')) return;

    const sim = simRef.current;
    sim.isDragging = true;
    sim.dragMoved = false;
    sim.glide = null;
    sim.lastPointerX = e.clientX;
    sim.lastPointerY = e.clientY;
    sim.pointerX = e.clientX;
    sim.pointerY = e.clientY;
    sim.pointerActive = true;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    sim.pointerX = e.clientX;
    sim.pointerY = e.clientY;
    sim.pointerActive = true;

    if (!sim.isDragging) return;
    const dx = e.clientX - sim.lastPointerX;
    const dy = e.clientY - sim.lastPointerY;
    if (Math.hypot(dx, dy) > 4) sim.dragMoved = true;

    sim.lastPointerX = e.clientX;
    sim.lastPointerY = e.clientY;
    // Drag moves the world directly under the hand
    sim.camX = wrapCoord(sim.camX - dx, WORLD_WIDTH);
    sim.camY = wrapCoord(sim.camY - dy, WORLD_HEIGHT);
    sim.vx = -dx * 0.72;
    sim.vy = -dy * 0.72;
  };

  const onPointerUp = () => {
    const sim = simRef.current;
    sim.isDragging = false;
    window.setTimeout(() => {
      sim.dragMoved = false;
    }, 40);
  };

  return (
    <div
      ref={stageRef}
      className={`spatial-stage ${workLight ? 'is-work-light' : 'is-spotlight'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <InkFilters />

      {/* LAYER 1: Dark Silhouetted Stage Field (visible outside the theatrical follow-spot) */}
      <canvas ref={darkCanvasRef} className="stage-canvas stage-canvas--dark" aria-hidden="true" />

      {/* LAYER 2: Illuminated Rag-Paper Black-Work World revealed through the dynamic Spotlight mask */}
      <div
        ref={illuminatedLayerRef}
        className={`illuminated-world ${workLight ? 'is-unmasked' : ''}`}
      >
        <canvas ref={paperCanvasRef} className="stage-canvas stage-canvas--paper" aria-hidden="true" />

        <div ref={heroNodeRef} className="world-node world-node--hero">
          <HeroTwinFlowersPlinth />
        </div>

        {/* 8 Experiential Production Project Stations distributed around 360° */}
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              stationRefs.current[project.id] = el;
            }}
            className="world-node world-node--station"
          >
            <ProjectStation
              project={project}
              isBlooming={bloomingId === project.id}
              isHovered={hoveredProjectId === project.id}
              onHoverChange={setHoveredProjectId}
              onSelect={handleSelectProject}
            />
          </div>
        ))}
      </div>

      <canvas ref={opticsCanvasRef} className="stage-canvas stage-canvas--optics" aria-hidden="true" />
    </div>
  );
}
