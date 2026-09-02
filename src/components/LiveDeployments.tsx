import React from 'react';
import { Globe, ExternalLink, Activity } from 'lucide-react';
import { LIVE_DEPLOYMENTS } from '../data/portfolioData';

export const LiveDeployments: React.FC = () => {
  return (
    <section id="deployments" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      {/* Section Header */}
      <div className="space-y-3 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Online & Interactive
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Live Projects
            </h2>
            <p className="text-secondary text-sm md:text-base mt-1 max-w-2xl">
              Web applications and platforms I've built and hosted that you can test out directly in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Deployments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LIVE_DEPLOYMENTS.map((deploy) => (
          <div
            key={deploy.id}
            className="group rounded-2xl bg-surface border border-transparent p-6 flex flex-col justify-between space-y-5 hover:border-accent transition-all duration-300 relative overflow-hidden"
          >
            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-primary tracking-tight flex items-center gap-2 group-hover:text-primary">
                <span>{deploy.name}</span>
              </h3>
              <p className="text-xs md:text-sm text-secondary leading-relaxed">
                {deploy.description}
              </p>
            </div>

            {/* Tags Strip */}
            {deploy.tags && deploy.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {deploy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-surface-subtle text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar: Direct Live URL Launch */}
            <div className="pt-1">
              <a
                href={deploy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface border-flat hover:border-accent text-primary transition-all flex items-center justify-between text-xs font-semibold group/link"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-muted group-hover/link:text-primary transition-colors" />
                  <span className="font-mono-code text-primary">{deploy.displayUrl}</span>
                </div>
                <div className="flex items-center gap-1 text-muted group-hover/link:text-primary transition-colors">
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
