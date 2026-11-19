import { ArrowUpRight, Crosshair, X } from 'lucide-react';
import {
  PROJECTS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type PortfolioProject
} from '../data/portfolio';
import { wrapDelta } from '../utils/torus';
import { BlackworkFlower } from './BlackworkBotanicals';

interface IndexDrawerProps {
  isOpen: boolean;
  camX: number;
  camY: number;
  onClose: () => void;
  onGlideToProject: (project: PortfolioProject, openModal?: boolean) => void;
  onReturnOrigin: () => void;
}

export function IndexDrawer({
  isOpen,
  camX,
  camY,
  onClose,
  onGlideToProject,
  onReturnOrigin
}: IndexDrawerProps) {
  if (!isOpen) return null;

  // Map toroidal coords [-W/2, W/2] into mini-map SVG coordinates [0..260] x [0..200]
  const mapW = 260;
  const mapH = 200;
  const toMapX = (wx: number) => ((wrapDelta(wx, 0, WORLD_WIDTH) + WORLD_WIDTH / 2) / WORLD_WIDTH) * mapW;
  const toMapY = (wy: number) => ((wrapDelta(wy, 0, WORLD_HEIGHT) + WORLD_HEIGHT / 2) / WORLD_HEIGHT) * mapH;

  const camMapX = toMapX(camX);
  const camMapY = toMapY(camY);

  return (
    <aside className="index-drawer" role="dialog" aria-label="360-degree field map and project index">
      <div className="index-drawer-header">
        <div>
          <p className="drawer-eyebrow">360° TOROIDAL FIELD INDEX</p>
          <h2>Selected Productions</h2>
        </div>
        <button type="button" className="icon-close-btn" onClick={onClose} aria-label="Close index drawer">
          <X size={18} />
        </button>
      </div>

      {/* Interactive Live Toroidal Mini-Map */}
      <div className="minimap-panel">
        <div className="minimap-caption">
          <span>LIVE SPOTLIGHT RADAR</span>
          <button
            type="button"
            className="text-link-btn"
            onClick={() => {
              onReturnOrigin();
              onClose();
            }}
          >
            <Crosshair size={12} /> Origin (000°)
          </button>
        </div>

        <svg className="minimap-svg" viewBox={`0 0 ${mapW} ${mapH}`} aria-label="Spatial field map">
          <rect width={mapW} height={mapH} fill="#10100f" rx="6" />
          {/* Orbit rings & axis lines */}
          <g stroke="rgba(244,241,232,0.14)" strokeWidth="0.8" fill="none">
            <line x1={mapW / 2} y1="0" x2={mapW / 2} y2={mapH} strokeDasharray="3 3" />
            <line x1="0" y1={mapH / 2} x2={mapW} y2={mapH / 2} strokeDasharray="3 3" />
            <circle cx={mapW / 2} cy={mapH / 2} r="44" strokeDasharray="2 3" />
            <circle cx={mapW / 2} cy={mapH / 2} r="82" strokeDasharray="2 3" />
          </g>

          {/* Origin marker */}
          <g
            className="minimap-node"
            onClick={() => {
              onReturnOrigin();
              onClose();
            }}
          >
            <circle cx={mapW / 2} cy={mapH / 2} r="5" fill="#f4f1e8" />
            <circle cx={mapW / 2} cy={mapH / 2} r="2" fill="#10100f" />
          </g>

          {/* Project stations plotted on the torus */}
          {PROJECTS.map((project) => {
            const px = toMapX(project.x);
            const py = toMapY(project.y);
            return (
              <g
                key={project.id}
                className="minimap-node"
                onClick={() => {
                  onGlideToProject(project, false);
                  onClose();
                }}
              >
                <circle cx={px} cy={py} r="7.5" fill="rgba(244,241,232,0.14)" />
                <circle cx={px} cy={py} r="3.4" fill="#f4f1e8" />
                <text
                  x={px}
                  y={py - 9}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill="rgba(244,241,232,0.8)"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {project.index}
                </text>
              </g>
            );
          })}

          {/* Live camera & spotlight beam position */}
          <g>
            <circle
              cx={camMapX}
              cy={camMapY}
              r="18"
              fill="rgba(244,241,232,0.16)"
              stroke="#f4f1e8"
              strokeWidth="1.2"
            />
            <circle cx={camMapX} cy={camMapY} r="2.4" fill="#f4f1e8" />
          </g>
        </svg>
      </div>

      {/* Project Index List */}
      <ul className="index-list">
        {PROJECTS.map((project) => (
          <li key={project.id} className="index-item">
            <button
              type="button"
              className="index-item-glide"
              onClick={() => {
                onGlideToProject(project, false);
                onClose();
              }}
            >
              <span className="index-item-flower" aria-hidden="true">
                <BlackworkFlower styleType={project.flowerStyle} size={30} />
              </span>
              <span className="index-item-copy">
                <span className="index-item-meta">
                  <span>{project.index}</span>
                  <span>{project.bearingLabel}</span>
                  <span>{project.year}</span>
                </span>
                <strong>{project.title}</strong>
                <small>{project.client}</small>
              </span>
            </button>
            <button
              type="button"
              className="index-item-open"
              onClick={() => {
                onGlideToProject(project, true);
                onClose();
              }}
              title={`Open ${project.title} case study`}
              aria-label={`Open ${project.title} case study`}
            >
              <ArrowUpRight size={15} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
