import { useEffect } from 'react';
import { ArrowUpRight, Mail, MapPin, X } from 'lucide-react';
import { PRODUCER_PROFILE } from '../data/portfolio';
import { BlackworkFlower } from './BlackworkBotanicals';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      onClick={onClose}
    >
      <article className="dossier-sheet dossier-sheet--about" onClick={(e) => e.stopPropagation()}>
        <header className="dossier-topbar">
          <div className="dossier-stamp">
            <span>STUDIO PROFILE · {PRODUCER_PROFILE.monogram}</span>
            <span>·</span>
            <span>{PRODUCER_PROFILE.availability}</span>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            aria-label="Close about panel"
          >
            <X size={18} />
          </button>
        </header>

        <div className="dossier-scroll">
          <div className="dossier-hero">
            <div className="dossier-hero-text">
              <p className="dossier-category">PRACTICE &amp; INQUIRIES</p>
              <h1 id="about-modal-title" className="dossier-title">
                {PRODUCER_PROFILE.name}
              </h1>
              <p className="dossier-subtitle">{PRODUCER_PROFILE.title}</p>
              <p className="dossier-location">
                <MapPin size={13} /> {PRODUCER_PROFILE.location}
              </p>
            </div>
            <div className="dossier-floral-seal" aria-hidden="true">
              <BlackworkFlower styleType="twin-solid" size={114} withStem />
              <span className="dossier-zine-note">two worlds grew together</span>
            </div>
          </div>

          <p className="about-lead">{PRODUCER_PROFILE.bioLead}</p>

          <div className="dossier-body-grid">
            <section className="dossier-narrative">
              <h2>Approach</h2>
              {PRODUCER_PROFILE.bioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <h3>Recognition &amp; Press</h3>
              <ul className="about-awards">
                {PRODUCER_PROFILE.recognition.map((item, i) => (
                  <li key={i}>
                    <span className="award-year">{item.year}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="dossier-sidebar">
              <div className="dossier-box">
                <h3>Core Disciplines</h3>
                <ul className="dossier-systems">
                  {PRODUCER_PROFILE.disciplines.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="dossier-box">
                <h3>Selected Collaborators</h3>
                <div className="client-tags">
                  {PRODUCER_PROFILE.selectedClients.map((client) => (
                    <span key={client} className="client-tag">
                      {client}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dossier-box dossier-box--contact">
                <h3>Direct Contact</h3>
                <p className="contact-rep">{PRODUCER_PROFILE.contact.representation}</p>
                <a className="contact-link" href={`mailto:${PRODUCER_PROFILE.contact.email}`}>
                  <Mail size={14} />
                  <span>{PRODUCER_PROFILE.contact.email}</span>
                </a>
                <a
                  className="contact-link"
                  href={PRODUCER_PROFILE.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Instagram · {PRODUCER_PROFILE.contact.instagram}</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  className="contact-link"
                  href={PRODUCER_PROFILE.contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LinkedIn · {PRODUCER_PROFILE.contact.linkedin}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
