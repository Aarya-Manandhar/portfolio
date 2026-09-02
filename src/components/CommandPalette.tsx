import React, { useEffect, useState } from 'react';
import { Search, X, Folder, Code, Terminal, Mail, Compass, Globe } from 'lucide-react';
import { PROJECTS, LIVE_DEPLOYMENTS, PERSONAL_INFO } from '../data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (id: string) => {
    onClose();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter items
  const filteredSections = [
    { id: 'about', label: 'About Aarya', icon: Compass, type: 'Section' },
    { id: 'skills', label: 'Technical Skills', icon: Terminal, type: 'Section' },
    { id: 'projects', label: 'All Projects', icon: Folder, type: 'Section' },
    { id: 'case-study', label: 'Case Studies: SajiloGig & DeadManSwitch', icon: Code, type: 'Deep Dive' },
    { id: 'deployments', label: 'Live Projects', icon: Globe, type: 'Production' },
    { id: 'contact', label: 'Contact & Resume', icon: Mail, type: 'Section' },
  ].filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

  const filteredProjects = PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
      p.shortDesc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDeployments = LIVE_DEPLOYMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase()) ||
      (d.tags && d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
  );



  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-surface border-flat rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-flat gap-3 bg-surface-subtle">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search sections, projects, tech stack, or writing... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-hidden text-primary placeholder:text-muted text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4">
          {/* Quick Jump Sections */}
          {filteredSections.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Navigation
              </div>
              <div className="mt-1 space-y-1">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => navigateTo(sec.id)}
                      className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-accent-light transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                        <span className="text-sm font-medium text-primary group-hover:text-accent">
                          {sec.label}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-surface-subtle border-flat text-muted group-hover:border-accent">
                        {sec.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Projects ({filteredProjects.length})
              </div>
              <div className="mt-1 space-y-1">
                {filteredProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => navigateTo('projects')}
                    className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-accent-light transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-primary group-hover:text-accent flex items-center gap-2">
                        {proj.name}
                        {proj.featured && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-primary text-surface font-semibold">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted truncate max-w-md mt-0.5">
                        {proj.shortDesc}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {proj.tech.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-subtle border-flat text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Deployments */}
          {filteredDeployments.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted flex items-center justify-between">
                <span>Live Deployments ({filteredDeployments.length})</span>
                <span className="text-[10px] text-emerald-500 font-mono-code font-bold">● LIVE</span>
              </div>
              <div className="mt-1 space-y-1">
                {filteredDeployments.map((deploy) => (
                  <a
                    key={deploy.id}
                    href={deploy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-accent-light transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-primary group-hover:text-accent flex items-center gap-2">
                        {deploy.name}
                        {deploy.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                            {deploy.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted truncate max-w-md mt-0.5">
                        {deploy.description}
                      </div>
                    </div>
                    <span className="text-xs text-muted group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Quick Links
            </div>
            <div className="mt-1 grid grid-cols-2 gap-1 px-1">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-medium border-flat hover:bg-accent-light hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>GitHub Profile</span>
                <span className="text-muted">↗</span>
              </a>
              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-medium border-flat hover:bg-accent-light hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>LinkedIn</span>
                <span className="text-muted">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-flat bg-surface-subtle flex items-center justify-between text-[11px] text-muted">
          <span>Tip: Use <kbd className="px-1.5 py-0.5 rounded-sm bg-surface border-flat">↑</kbd> <kbd className="px-1.5 py-0.5 rounded-sm bg-surface border-flat">↓</kbd> or click to select</span>
          <span><kbd className="px-1.5 py-0.5 rounded-sm bg-surface border-flat">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
