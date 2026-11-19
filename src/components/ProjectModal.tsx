import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';
import { PROJECTS, type PortfolioProject } from '../data/portfolio';
import { BlackworkFlower, ProjectArtworkPlate } from './BlackworkBotanicals';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onNavigateProject: (project: PortfolioProject) => void;
}

export function ProjectModal({
  project,
  onClose,
  onNavigateProject
}: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const currentIdx = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <article className="dossier-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <header className="dossier-topbar">
          <div className="dossier-stamp">
            <span>DOSSIER {project.index} / 0{PROJECTS.length}</span>
            <span>·</span>
            <span>BEARING {project.bearingLabel}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            aria-label="Close case study"
          >
            <X size={18} />
          </button>
        </header>

        <div className="dossier-scroll">
          {/* Hero Editorial Title & Floral Seal */}
          <div className="dossier-hero">
            <div className="dossier-hero-text">
              <p className="dossier-category">{project.category}</p>
              <h1 id="case-study-title" className="dossier-title">
                {project.title}
              </h1>
              <p className="dossier-subtitle">{project.subtitle}</p>
              <p className="dossier-location">
                <MapPin size={13} /> {project.venue} · {project.location}
              </p>
            </div>
            <div className="dossier-floral-seal" aria-hidden="true">
              <BlackworkFlower styleType={project.flowerStyle} size={108} withStem />
              <span className="dossier-zine-note">{project.marginNote}</span>
            </div>
          </div>

          {/* Bespoke Art-Directed Monochrome Production Plate */}
          <figure className="dossier-plate-figure">
            <ProjectArtworkPlate variant={project.artwork} className="dossier-plate-svg" />
            <figcaption>
              <span>PRODUCTION PLATE {project.index}A</span>
              <span>
                {project.client} — {project.venue} ({project.year})
              </span>
            </figcaption>
          </figure>

          {/* Key Specs Strip */}
          <dl className="dossier-specs-grid">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Client / Commission</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>Scale &amp; Attendance</dt>
              <dd>{project.scale}</dd>
            </div>
            <div>
              <dt>Run / Format</dt>
              <dd>{project.duration}</dd>
            </div>
          </dl>

          {/* Two-Column Editorial Narrative + Technical Architecture */}
          <div className="dossier-body-grid">
            <section className="dossier-narrative">
              <h2>Creative &amp; Spatial Narrative</h2>
              {project.narrative.map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              <h3>Production Highlights</h3>
              <ul className="dossier-bullets">
                {project.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <aside className="dossier-sidebar">
              <div className="dossier-box">
                <h3>Technical &amp; Spatial Systems</h3>
                <ul className="dossier-systems">
                  {project.systems.map((sys, i) => (
                    <li key={i}>{sys}</li>
                  ))}
                </ul>
              </div>

              <div className="dossier-box">
                <h3>Selected Credits</h3>
                <dl className="dossier-credits">
                  {project.credits.map((c, i) => (
                    <div key={i}>
                      <dt>{c.role}</dt>
                      <dd>{c.name}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer Navigation Gliding Around the 360° Torus */}
        <footer className="dossier-footer">
          <button
            type="button"
            className="dossier-nav-btn"
            onClick={() => onNavigateProject(prevProject)}
          >
            <ArrowLeft size={15} />
            <span>
              <small>Previous · {prevProject.index}</small>
              <strong>{prevProject.title}</strong>
            </span>
          </button>

          <button type="button" className="ink-link" onClick={onClose}>
            Return to 360° Field
          </button>

          <button
            type="button"
            className="dossier-nav-btn dossier-nav-btn--right"
            onClick={() => onNavigateProject(nextProject)}
          >
            <span>
              <small>Next · {nextProject.index}</small>
              <strong>{nextProject.title}</strong>
            </span>
            <ArrowRight size={15} />
          </button>
        </footer>
      </article>
    </div>
  );
}
