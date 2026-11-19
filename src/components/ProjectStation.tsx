import type { PortfolioProject } from '../data/portfolio';
import { BlackworkFlower } from './BlackworkBotanicals';

interface ProjectFlowerProps {
  project: PortfolioProject;
  isBlooming: boolean;
  isHovered: boolean;
  onHoverChange: (id: string | null) => void;
  onSelect: (project: PortfolioProject) => void;
}

/**
 * A project is only its flower. Interacting blooms it in place.
 * The gallery / description it will open is intentionally not built yet.
 */
export function ProjectStation({
  project,
  isBlooming,
  isHovered,
  onHoverChange,
  onSelect
}: ProjectFlowerProps) {
  return (
    <button
      type="button"
      className={`project-flower ${isHovered ? 'is-hovered' : ''} ${isBlooming ? 'is-blooming' : ''}`}
      data-project-id={project.id}
      onMouseEnter={() => onHoverChange(project.id)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(project.id)}
      onBlur={() => onHoverChange(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(project);
      }}
      aria-label={project.title}
    >
      <BlackworkFlower styleType={project.flowerStyle} size={156} withStem />
    </button>
  );
}
