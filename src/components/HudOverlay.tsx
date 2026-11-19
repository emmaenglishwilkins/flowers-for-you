import { PRODUCER_PROFILE, PROJECTS, type PortfolioProject } from '../data/portfolio';
import { compassCardinal, formatSignedCoord } from '../utils/torus';

export interface TelemetrySnapshot {
  camX: number;
  camY: number;
  bearing: number;
  speed: number;
  nearestProject: PortfolioProject;
  nearestDistance: number;
}

interface HudOverlayProps {
  telemetry: TelemetrySnapshot;
  workLight: boolean;
  indexOpen: boolean;
  onToggleWorkLight: () => void;
  onToggleIndex: () => void;
  onOpenAbout: () => void;
  onReturnOrigin: () => void;
  onGlideToProject: (project: PortfolioProject) => void;
  onNudge: (dx: number, dy: number) => void;
}

/**
 * Unboxed, quiet gallery-style HUD floating directly on the open canvas.
 * Zero rectangular pills, zero borders, zero background containers.
 */
export function HudOverlay({
  telemetry,
  workLight,
  indexOpen,
  onToggleWorkLight,
  onToggleIndex,
  onOpenAbout,
  onReturnOrigin,
  onGlideToProject,
  onNudge
}: HudOverlayProps) {
  const bearingRounded = Math.round(telemetry.bearing) % 360;
  const cardinal = compassCardinal(bearingRounded);

  return (
    <div className="hud-root" role="region" aria-label="Spatial navigation controls">
      {/* Top Bar — clean unboxed typography */}
      <header className="hud-top">
        <button
          type="button"
          className="hud-link hud-brand"
          onClick={onReturnOrigin}
          title="Glide back to Origin (0, 0)"
        >
          <strong>{PRODUCER_PROFILE.name}</strong>
          <span>Experiential Producer</span>
        </button>

        <nav className="hud-actions" aria-label="Primary actions">
          <button
            type="button"
            className={`hud-link hud-nav-item ${workLight ? 'is-active' : ''}`}
            onClick={onToggleWorkLight}
            aria-pressed={workLight}
            title="Switch between soft Spotlight and full Work Light"
          >
            {workLight ? 'Work Light' : 'Spotlight'}
          </button>

          <span className="hud-sep" aria-hidden="true">·</span>

          <button
            type="button"
            className={`hud-link hud-nav-item ${indexOpen ? 'is-active' : ''}`}
            onClick={onToggleIndex}
            aria-expanded={indexOpen}
          >
            Index (0{PROJECTS.length})
          </button>

          <span className="hud-sep" aria-hidden="true">·</span>

          <button
            type="button"
            className="hud-link hud-nav-item"
            onClick={onOpenAbout}
          >
            About &amp; Contact
          </button>
        </nav>
      </header>

      {/* Bottom Telemetry & Minimal Compass */}
      <footer className="hud-bottom">
        <div className="hud-compass-cluster">
          <div className="hud-compass-inline" aria-live="polite">
            <svg viewBox="0 0 44 44" width="34" height="34" className="compass-svg" aria-hidden="true">
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeOpacity="0.45"
                strokeDasharray="2 3"
              />
              <g transform={`rotate(${bearingRounded} 22 22)`}>
                <polygon points="22,6 24.5,22 22,19 19.5,22" fill="currentColor" />
                <line x1="22" y1="22" x2="22" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              </g>
            </svg>

            <div className="compass-readout">
              <span className="compass-bearing-text">
                {String(bearingRounded).padStart(3, '0')}° {cardinal}
              </span>
              <span className="compass-coords-line">
                {formatSignedCoord(telemetry.camX)} · {formatSignedCoord(telemetry.camY)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="hud-link hud-nearest"
            onClick={() => onGlideToProject(telemetry.nearestProject)}
            title={`Glide camera to ${telemetry.nearestProject.title}`}
          >
            <span className="hud-nearest-prefix">Near</span>
            <em>{telemetry.nearestProject.title}</em>
          </button>
        </div>

        <div className="hud-steer-cluster">
          <div className="hud-dpad" aria-label="Directional steer">
            <button type="button" onClick={() => onNudge(0, -420)} aria-label="Pan North">N</button>
            <button type="button" onClick={() => onNudge(-420, 0)} aria-label="Pan West">W</button>
            <button type="button" onClick={onReturnOrigin} aria-label="Center at Origin" title="Origin">◎</button>
            <button type="button" onClick={() => onNudge(420, 0)} aria-label="Pan East">E</button>
            <button type="button" onClick={() => onNudge(0, 420)} aria-label="Pan South">S</button>
          </div>
          <span className="hud-whisper">scroll or drag in 360°</span>
        </div>
      </footer>
    </div>
  );
}
