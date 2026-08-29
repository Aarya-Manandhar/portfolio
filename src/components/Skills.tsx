import React from 'react';
import { Cpu, Terminal, Layout, Shield, TestTube, Server } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { TechIcon } from './TechIcon';

const GROUP_ICONS = [Terminal, Layout, Shield, TestTube, Server];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-primary" />
        <span>Technical Proficiency</span>
      </div>

      <div className="space-y-3 max-w-3xl mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Tools, languages, and engineering domains.
        </h2>
        <p className="text-secondary text-base leading-relaxed">
          Categorized by core competency with proof-of-work cross references. Hover any skill badge to see shipped project usage.
        </p>
      </div>

      {/* Grouped Tag Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((category, idx) => {
          const IconComponent = GROUP_ICONS[idx % GROUP_ICONS.length];
          const isWeb3Sec = category.isWeb3Security || category.title.includes('Web3');

          return (
            <div
              key={category.title}
              className={`p-6 rounded-2xl bg-surface space-y-4 transition-all duration-200 relative group overflow-visible ${
                isWeb3Sec
                  ? 'hover:border-l-4 hover:border-l-rose-500 hover:border-accent shadow-xs'
                  : 'hover:border-accent'
              }`}
            >
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center text-primary">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-primary">{category.title}</h3>
                </div>

                {isWeb3Sec && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 font-semibold">
                    CORE DOMAIN
                  </span>
                )}
              </div>

              {/* Icon-Based Skill Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="relative group/badge inline-block">
                    <div className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-subtle text-secondary flex items-center gap-2 hover:text-primary hover:bg-surface transition-all cursor-default">
                      <TechIcon name={skill.name} deviconSlug={skill.deviconSlug} className="w-4 h-4" />
                      <span>{skill.name}</span>
                    </div>

                    {/* Clean Floating Tooltip cross-referencing project proof */}
                    {skill.usedIn && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-mono-code font-medium whitespace-nowrap shadow-2xl border border-zinc-800 dark:border-zinc-200 opacity-0 pointer-events-none group-hover/badge:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/badge:translate-y-0 z-50 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>Used in {skill.usedIn}</span>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-950 dark:border-t-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
