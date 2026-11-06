import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FolderGit2,
  ExternalLink,
  Shield,
  Briefcase,
  ShoppingBag,
  FileCheck,
  TestTube,
  Gamepad2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Archive,
  MessageSquareText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROJECTS } from '../data/portfolioData';

// Map icon names to Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles: Sparkles,
  MessageSquareText: MessageSquareText,
  ShieldLock: Shield,
  Briefcase: Briefcase,
  ShoppingBag: ShoppingBag,
  FileCheck: FileCheck,
  TestTube: TestTube,
  Gamepad2: Gamepad2,
};

// Projects to de-emphasise (earlier/learning work)
const EARLIER_PROJECT_IDS = new Set(['console-game', 'baa-ko-achar']);

type FilterId = 'all' | 'ai' | 'web3' | 'platforms' | 'qa' | 'fullstack';
type PopupPosition = { top: number; left: number; width: number };

export const ProjectsGrid: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('all');
  const [showEarlier, setShowEarlier] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof PROJECTS)[number] | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const popupRef = useRef<HTMLElement>(null);

  const dismissPopup = useCallback((restoreFocus = false) => {
    const anchor = popupAnchor;
    setSelectedProject(null);
    setPopupAnchor(null);
    setPopupPosition(null);
    if (restoreFocus) anchor?.focus();
  }, [popupAnchor]);

  useEffect(() => {
    if (!selectedProject || !popupAnchor) return;
    const updatePosition = () => {
      if (!popupAnchor.isConnected) {
        dismissPopup();
        return;
      }

      const rect = popupAnchor.getBoundingClientRect();
      const width = Math.min(544, window.innerWidth - 32);
      const height = Math.min(520, window.innerHeight - 32);
      const left = Math.min(
        Math.max(16, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - 16,
      );
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const top = below >= height
        ? rect.bottom + 12
        : above >= height
          ? rect.top - height - 12
          : Math.min(Math.max(16, rect.bottom + 12), window.innerHeight - height - 16);
      setPopupPosition({ top, left, width });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissPopup(true);
    };
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (popupRef.current?.contains(target) || popupAnchor.contains(target)) return;
      dismissPopup();
    };
    const handlePageScroll = () => dismissPopup();

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handlePageScroll);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [selectedProject, popupAnchor, dismissPopup]);

  const openProject = (project: (typeof PROJECTS)[number], anchor: HTMLElement) => {
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
      setPopupAnchor(null);
      setPopupPosition(null);
      return;
    }
    setSelectedProject(project);
    setPopupAnchor(anchor);
  };

  const closeProject = () => {
    dismissPopup(true);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, project: (typeof PROJECTS)[number]) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(project, event.currentTarget);
    }
  };

  const filters: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI & NLP Tools' },
    { id: 'web3', label: 'Web3 Systems' },
    { id: 'platforms', label: 'Platforms' },
    { id: 'qa', label: 'QA & Testing' },
    { id: 'fullstack', label: 'Full-Stack Apps' },
  ];

  // Primary projects (excluding earlier work)
  const primaryProjects = PROJECTS.filter((p) => !EARLIER_PROJECT_IDS.has(p.id));
  // Earlier projects
  const earlierProjects = PROJECTS.filter((p) => EARLIER_PROJECT_IDS.has(p.id));

  const filteredPrimary = primaryProjects.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const filteredEarlier = earlierProjects.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const getCategoryBadgeLabel = (category: string) => {
    switch (category) {
      case 'ai':
        return 'AI TOOL';
      case 'web3':
        return 'WEB3';
      case 'platforms':
        return 'PLATFORM';
      case 'qa':
        return 'QA & TESTING';
      case 'security':
        return 'SECURITY';
      case 'fullstack':
        return 'FULLSTACK';
      default:
        return category.toUpperCase();
    }
  };

  const renderProjectDetails = (project: (typeof PROJECTS)[number]) => (
    <section
      ref={popupRef}
      className="project-detail-popover fixed z-[60] max-h-[min(520px,calc(100dvh-2rem))] overflow-y-auto rounded-2xl border border-flat bg-surface p-5 md:p-6"
      style={popupPosition ? { top: popupPosition.top, left: popupPosition.left, width: popupPosition.width } : undefined}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`project-details-title-${project.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono-code font-semibold tracking-wider text-muted">
            {getCategoryBadgeLabel(project.category)}
          </span>
          <h4 id={`project-details-title-${project.id}`} className="mt-1 text-base font-bold text-primary">
            {project.name}
          </h4>
        </div>
        <button
          type="button"
          onClick={closeProject}
          className="shrink-0 rounded-lg px-2.5 py-1 text-xs text-muted hover:bg-surface hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label={`Close ${project.name} details`}
        >
          Close
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-secondary">
        {project.fullDesc || project.shortDesc}
      </p>

      {project.highlights && project.highlights.length > 0 && (
        <div className="mt-5">
          <h5 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Key highlights</h5>
          <ul className="mt-2.5 space-y-2">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5 text-sm leading-relaxed text-secondary">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="rounded-lg bg-surface px-3 py-2 text-xs font-medium text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              View on GitHub <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith('#') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-surface hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Live project <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </section>
  );

  const renderProjectCard = (project: (typeof PROJECTS)[0]) => {
    const IconComponent = ICON_MAP[project.iconName] || FolderGit2;
    const isExpanded = selectedProject?.id === project.id;
    return (
      <div
        key={project.id}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? `project-details-title-${project.id}` : undefined}
        onClick={(event) => openProject(project, event.currentTarget)}
        onKeyDown={(event) => handleCardKeyDown(event, project)}
        className="group rounded-2xl bg-surface p-6 flex flex-col justify-between space-y-4 transition-all duration-200 cursor-pointer hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div className="space-y-3">
          {/* Header: Icon, Title & Links */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center text-primary transition-colors">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                  {project.name}
                  {project.featured && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-primary text-surface font-semibold">
                      FEATURED
                    </span>
                  )}
                </h3>
                <span className="text-[10px] font-mono-code font-semibold text-muted tracking-wider">
                  {getCategoryBadgeLabel(project.category)}
                </span>
              </div>
            </div>

            {/* External Links: GitHub & Live Deployment */}
            <div className="flex items-center gap-1.5 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-subtle transition-colors"
                  title="View Source on GitHub"
                  aria-label={`View ${project.name} on GitHub`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target={project.liveUrl.startsWith('#') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface-subtle text-primary hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 border border-transparent hover:border-accent transition-all flex items-center gap-1 text-xs font-medium"
                  title="View Live Project / Deployment"
                  aria-label={`View Live Demo of ${project.name}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <span>Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* One-Line Pitch */}
          <p className="text-xs md:text-sm text-secondary leading-relaxed">
            {project.shortDesc}
          </p>
        </div>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium text-muted"
            >
              {t}
            </span>
          ))}
        </div>

      </div>
    );
  };

  return (
    <section id="projects" className="py-12 md:py-16 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <span>Projects</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Projects & Experiments
          </h2>
          <p className="text-xs text-muted">Select a project to expand its description and key highlights.</p>
        </div>

        {/* Filter Pills — updated taxonomy */}
        <div className="flex flex-wrap gap-1.5 bg-surface-subtle p-1.5 rounded-xl self-start md:self-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedFilter === f.id
                  ? 'bg-surface text-primary font-semibold shadow-xs'
                  : 'text-muted hover:text-primary hover:bg-surface/50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary 2-Column Projects Grid */}
      {filteredPrimary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrimary.map((project) => renderProjectCard(project))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted text-sm">
          No primary projects in this category.
        </div>
      )}

      {/* Earlier / Learning Projects — collapsible, de-emphasised */}
      {(selectedFilter === 'all' || filteredEarlier.length > 0) && (
        <div className="mt-10 pt-4">
          <button
            onClick={() => setShowEarlier((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-primary transition-colors cursor-pointer group"
          >
            <Archive className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            <span className="uppercase tracking-wider">
              Earlier Work & Learning Projects ({earlierProjects.length})
            </span>
            {showEarlier ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showEarlier && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedFilter === 'all' ? earlierProjects : filteredEarlier).map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  aria-expanded={selectedProject?.id === project.id}
                  aria-controls={selectedProject?.id === project.id ? `project-details-title-${project.id}` : undefined}
                  onClick={(event) => openProject(project, event.currentTarget)}
                  onKeyDown={(event) => handleCardKeyDown(event, project)}
                  className="rounded-2xl bg-surface-subtle p-5 flex flex-col justify-between space-y-3 transition-all duration-200 hover:opacity-90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-secondary">{project.name}</h3>
                        <span className="text-[10px] font-mono-code font-semibold text-muted tracking-wider">
                          {getCategoryBadgeLabel(project.category)}
                        </span>
                      </div>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-surface transition-colors"
                          aria-label={`View ${project.name} on GitHub`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{project.shortDesc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[11px] font-medium text-muted bg-surface">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!showEarlier && (
            <p className="mt-2 text-xs text-muted">
              C++ terminal games and early e-commerce builds — foundational work, lower narrative priority.
            </p>
          )}
        </div>
      )}

      {selectedProject && popupPosition && createPortal(renderProjectDetails(selectedProject), document.body)}

    </section>
  );
};
