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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

export const ProjectsGrid: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ai' | 'web3' | 'security' | 'fullstack'>('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI & NLP Tools' },
    { id: 'web3', label: 'Web3 Systems' },
    { id: 'security', label: 'Security & QA' },
    { id: 'fullstack', label: 'Full-Stack Apps' },
  ] as const;

  const filteredProjects = PROJECTS.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const getCategoryBadgeLabel = (category: string) => {
    switch (category) {
      case 'ai':
        return 'AI TOOL';
      case 'web3':
        return 'WEB3';
      case 'security':
        return 'SECURITY & QA';
      case 'fullstack':
        return 'FULLSTACK';
      default:
        return category.toUpperCase();
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <span>Engineering Projects</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Proof through practical software implementations.
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-surface-subtle p-1.5 rounded-xl self-start md:self-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-surface text-primary font-semibold shadow-xs'
                  : 'text-muted hover:text-primary hover:bg-surface/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Projects Grid (1-column on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
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

                  {/* External Link */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-subtle transition-colors"
                      aria-label={`View ${project.name} on GitHub`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
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
        })}
      </div>
    </section>
  );
};
