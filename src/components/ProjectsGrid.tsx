import React, { useState } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROJECTS } from '../data/portfolioData';

// Map icon names to Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles: Sparkles,
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

export const ProjectsGrid: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('all');
  const [showEarlier, setShowEarlier] = useState(false);

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

  const ProjectCard = ({ project }: { project: (typeof PROJECTS)[0] }) => {
    const IconComponent = ICON_MAP[project.iconName] || FolderGit2;
    return (
      <div
        key={project.id}
        className="group rounded-2xl bg-surface p-6 flex flex-col justify-between space-y-4 transition-all duration-200"
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
    <section id="projects" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <span>Projects</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Projects & Experiments
          </h2>
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
          {filteredPrimary.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted text-sm">
          No primary projects in this category.
        </div>
      )}

      {/* Earlier / Learning Projects — collapsible, de-emphasised */}
      {(selectedFilter === 'all' || filteredEarlier.length > 0) && (
        <div className="mt-10 pt-8 border-t border-flat border-dashed">
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
              {(selectedFilter === 'all' ? earlierProjects : filteredEarlier).map((project) => (
                <div key={project.id} className="rounded-2xl bg-surface-subtle p-5 flex flex-col justify-between space-y-3 transition-all duration-200 hover:opacity-90">
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
    </section>
  );
};
