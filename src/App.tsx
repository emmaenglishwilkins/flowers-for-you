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

  // Mutable simulation state kept outside React for locked 60fps+ toroidal physics
  const simRef = useRef({
    camX: 0,
    camY: 0,
    vx: 0,
    vy: 0,
    mouseVx: 0,
    mouseVy: 0,
    wheelVx: 0,
    wheelVy: 0,
    smNormX: 0,
    smNormY: 0,
    bearing: 0,
    glide: null as GlideTarget | null,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    pointerRestAnchor: null as { x: number; y: number } | null,
    spotX: 0,
    spotY: 0,
    spotRadius: 365,
    spotVx: 0,
    spotVy: 0,
    motionAngle: 0,
    workLightMix: 0,
    trail: [] as Array<{ x: number; y: number; alpha: number; r: number }>,
    lastFrameMs: 0,
    lastTrailAt: 0,
    viewportW: typeof window !== 'undefined' ? window.innerWidth : 1440,
    viewportH: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  // Sync latest React state flags into refs readable from the rAF loop
  const workLightRef = useRef(workLight);
  const hoveredRef = useRef(hoveredProjectId);

  useEffect(() => {
    workLightRef.current = workLight;
  }, [workLight]);

  useEffect(() => {
    hoveredRef.current = hoveredProjectId;
  }, [hoveredProjectId]);

  const glideTo = useCallback((x: number, y: number) => {
    const sim = simRef.current;
    sim.glide = { x, y };
    sim.mouseVx = 0;
    sim.mouseVy = 0;
    sim.wheelVx = 0;
    sim.wheelVy = 0;
    sim.smNormX = 0;
    sim.smNormY = 0;
    if (sim.pointerActive) {
      sim.pointerRestAnchor = { x: sim.pointerX, y: sim.pointerY };
    }
  }, []);

  // The flower is the project. Bloom it in place — the gallery comes later.
  const handleSelectProject = useCallback((project: PortfolioProject) => {
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

  // Wheel (2D trackpad + mouse wheel), Work Light key, and viewport leave safety
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sim = simRef.current;
      sim.glide = null;
      sim.pointerRestAnchor = null;
      const scale = e.deltaMode === 1 ? 26 : e.deltaMode === 2 ? 220 : 1;
      sim.wheelVx += (e.deltaX * scale) * 0.12;
      sim.wheelVy += (e.deltaY * scale) * 0.12;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'l' || e.key === 'L') {
        setWorkLight((v) => !v);
      }
    };

    const deactivatePointer = () => {
      simRef.current.pointerActive = false;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', deactivatePointer);
    document.documentElement.addEventListener('mouseleave', deactivatePointer);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', deactivatePointer);
      document.documentElement.removeEventListener('mouseleave', deactivatePointer);
    };
  }, []);

  // Unified frame-rate-independent physics, toroidal DOM wrapping, spotlight mask & canvas loop
  useEffect(() => {
    let rafId = 0;

    const tick = (nowMs: number) => {
      const sim = simRef.current;
      const rawDt = sim.lastFrameMs > 0 ? nowMs - sim.lastFrameMs : 16.6667;
      sim.lastFrameMs = nowMs;
      const dtScale = Math.min(2.5, Math.max(0.25, rawDt / 16.6667));
      const smoothFactor = (alpha60: number) => 1 - Math.pow(1 - alpha60, dtScale);

      const w = sim.viewportW;
      const h = sim.viewportH;
      const halfW = w * 0.5;
      const halfH = h * 0.5;

      // 1. Mouse-position-driven 360° steering (two-stage damped S-curve, zero click-and-drag)
      const steeringActive = sim.pointerActive && !sim.glide && !sim.pointerRestAnchor;
      const rawNx = steeringActive ? (sim.pointerX - halfW) / Math.max(1, halfW) : 0;
      const rawNy = steeringActive ? (sim.pointerY - halfH) / Math.max(1, halfH) : 0;

      const inputAlpha = smoothFactor(0.14);
      sim.smNormX += (rawNx - sim.smNormX) * inputAlpha;
      sim.smNormY += (rawNy - sim.smNormY) * inputAlpha;

      const mag = Math.hypot(sim.smNormX, sim.smNormY);
      const deadZone = 0.14;
      let targetMouseVx = 0;
      let targetMouseVy = 0;

      if (mag > deadZone && !sim.glide && !sim.pointerRestAnchor) {
        const clampedMag = Math.min(1, mag);
        const t = (clampedMag - deadZone) / (1 - deadZone);
        // Progressive ease: calm sanctuary near center, silky cruise toward outer viewport
        const drive = t * t * (0.35 + 0.65 * t);
        // Poise over flowers on hover so selecting a bloom feels effortless
        const hoverPoise = hoveredRef.current ? 0.2 : 1;
        const maxCruiseSpeed = 11.5;
        const speedMag = drive * maxCruiseSpeed * hoverPoise;
        targetMouseVx = (sim.smNormX / mag) * speedMag;
        targetMouseVy = (sim.smNormY / mag) * speedMag;
      }

      const velAlpha = smoothFactor(0.075);
      sim.mouseVx += (targetMouseVx - sim.mouseVx) * velAlpha;
      sim.mouseVy += (targetMouseVy - sim.mouseVy) * velAlpha;
      if (Math.abs(sim.mouseVx) < 0.006 && targetMouseVx === 0) sim.mouseVx = 0;
      if (Math.abs(sim.mouseVy) < 0.006 && targetMouseVy === 0) sim.mouseVy = 0;

      // 2. Smooth 2D trackpad / scroll wheel inertia
      const wheelDecay = Math.pow(0.915, dtScale);
      sim.wheelVx *= wheelDecay;
      sim.wheelVy *= wheelDecay;
      if (Math.abs(sim.wheelVx) < 0.01) sim.wheelVx = 0;
      if (Math.abs(sim.wheelVy) < 0.01) sim.wheelVy = 0;

      // 3. Shortest-path toroidal glide (when centering a bloomed flower) or combined cruise
      if (sim.glide) {
        const dx = wrapDelta(sim.glide.x, sim.camX, WORLD_WIDTH);
        const dy = wrapDelta(sim.glide.y, sim.camY, WORLD_HEIGHT);
        const dist = Math.hypot(dx, dy);

        if (dist < 0.6) {
          sim.camX = wrapCoord(sim.glide.x, WORLD_WIDTH);
          sim.camY = wrapCoord(sim.glide.y, WORLD_HEIGHT);
          sim.vx = 0;
          sim.vy = 0;
          sim.glide = null;
        } else {
          const glideStep = smoothFactor(0.085);
          sim.vx = (dx * glideStep) / dtScale;
          sim.vy = (dy * glideStep) / dtScale;
        }
      } else {
        sim.vx = sim.mouseVx + sim.wheelVx;
        sim.vy = sim.mouseVy + sim.wheelVy;
      }

      const maxSpeed = 48;
      const rawSpeed = Math.hypot(sim.vx, sim.vy);
      if (rawSpeed > maxSpeed) {
        sim.vx = (sim.vx / rawSpeed) * maxSpeed;
        sim.vy = (sim.vy / rawSpeed) * maxSpeed;
      }

      sim.camX = wrapCoord(sim.camX + sim.vx * dtScale, WORLD_WIDTH);
      sim.camY = wrapCoord(sim.camY + sim.vy * dtScale, WORLD_HEIGHT);

      const speed = Math.hypot(sim.vx, sim.vy);
      if (speed > 0.25) {
        sim.bearing = bearingDegrees(sim.vx, sim.vy);
        sim.motionAngle = Math.atan2(sim.vy, sim.vx);
      }

      // 4. Spotlight physics: responds to cursor + travel velocity + direction bloom
      const targetWorkMix = workLightRef.current ? 1 : 0;
      sim.workLightMix += (targetWorkMix - sim.workLightMix) * smoothFactor(0.12);

      // Magnetize follow-spot between viewport center and pointer, plus lead ahead along travel velocity
      const cursorPull = sim.pointerActive ? 0.36 : 0;
      const baseX = halfW + (sim.pointerX - halfW) * cursorPull;
      const baseY = halfH + (sim.pointerY - halfH) * cursorPull;

      const leadX = Math.max(-150, Math.min(150, sim.vx * 3.2));
      const leadY = Math.max(-135, Math.min(135, sim.vy * 3.2));

      const targetSpotX = Math.max(90, Math.min(w - 90, baseX + leadX));
      const targetSpotY = Math.max(90, Math.min(h - 90, baseY + leadY));

      const spotLerp = smoothFactor(0.11);
      const spotVelLerp = smoothFactor(0.16);
      sim.spotX += (targetSpotX - sim.spotX) * spotLerp;
      sim.spotY += (targetSpotY - sim.spotY) * spotLerp;
      sim.spotVx += (sim.vx - sim.spotVx) * spotVelLerp;
      sim.spotVy += (sim.vy - sim.spotVy) * spotVelLerp;

      const baseRadius = Math.min(w, h) * 0.4;
      const targetRadius = Math.max(250, Math.min(420, baseRadius)) + Math.min(speed * 3.2, 90);
      sim.spotRadius += (targetRadius - sim.spotRadius) * smoothFactor(0.11);

      // Record subtle fading beam motion trail echoes when sweeping across the field
      if (speed > 2.4 && nowMs - sim.lastTrailAt > 48) {
        sim.lastTrailAt = nowMs;
        sim.trail.push({
          x: sim.spotX - sim.spotVx * 2.2,
          y: sim.spotY - sim.spotVy * 2.2,
          alpha: Math.min(0.85, speed / 18),
          r: sim.spotRadius * 0.72
        });
        if (sim.trail.length > 9) sim.trail.shift();
      }
      const trailFade = Math.pow(0.91, dtScale);
      const trailGrow = Math.pow(1.008, dtScale);
      for (const tp of sim.trail) {
        tp.alpha *= trailFade;
        tp.r *= trailGrow;
      }
      sim.trail = sim.trail.filter((tp) => tp.alpha > 0.02);

      // 5. Update CSS custom properties driving the multi-lobe Spotlight mask on the illuminated world
      const layer = illuminatedLayerRef.current;
      if (layer) {
        const maxViewportR = Math.hypot(w, h) * 1.15;
        const effectiveR = sim.spotRadius + (maxViewportR - sim.spotRadius) * sim.workLightMix;
        const speedNorm = Math.min(speed / 20, 1);

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

  // Passive mouse-position tracking for smooth 360° camera drift & follow-spot (no click-and-drag)
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const sim = simRef.current;
    const target = e.target as HTMLElement | null;
    const overChrome = Boolean(target?.closest('.hud-root, .index-drawer, .modal-backdrop'));

    sim.pointerX = e.clientX;
    sim.pointerY = e.clientY;
    sim.pointerActive = !overChrome;

    if (sim.pointerRestAnchor) {
      const movedDist = Math.hypot(
        e.clientX - sim.pointerRestAnchor.x,
        e.clientY - sim.pointerRestAnchor.y
      );
      if (movedDist > 28) {
        sim.pointerRestAnchor = null;
        sim.glide = null;
      }
    }
  };

  const onPointerLeave = () => {
    simRef.current.pointerActive = false;
  };

  return (
    <div
      ref={stageRef}
      className={`spatial-stage ${workLight ? 'is-work-light' : 'is-spotlight'}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
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
