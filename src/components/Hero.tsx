import React, { useState } from 'react';
import { Mail, ArrowRight, Code2, ShieldCheck, Terminal, Cpu, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Hero: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-28 md:pt-36 pb-12 md:pb-20 max-w-6xl mx-auto px-4 md:px-8">
      {/* Grid Layout: reversed order on mobile (photo above text) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">

        {/* Mobile Photo (Shown top on mobile only) */}
        <div className="md:hidden flex justify-center">
          <div className="relative">
            <div className="w-44 h-44 rounded-2xl bg-surface border-flat p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full h-full rounded-xl bg-surface-subtle border-flat flex flex-col items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-primary text-surface flex items-center justify-center text-2xl font-bold">
                  AM
                </div>
                <span className="mt-3 text-xs font-semibold text-primary">{PERSONAL_INFO.name}</span>
                <span className="text-[10px] text-muted">Full-Stack Engineer</span>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-3 -right-3 bg-surface border-flat px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{PERSONAL_INFO.statsBadge}</span>
            </div>
          </div>
        </div>

        {/* Left Column: Text & Content */}
        <div className="md:col-span-7 flex flex-col items-start space-y-6">
          {/* Availability status — update PERSONAL_INFO.availability in portfolioData.ts */}
          {PERSONAL_INFO.availability && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{PERSONAL_INFO.availability}</span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-subtle border-flat text-xs font-medium text-muted">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono-code">{PERSONAL_INFO.greeting}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
            Full-Stack Developer.<br />
            <span className="text-secondary font-semibold text-3xl sm:text-4xl lg:text-5xl block mt-1">
              AI Tools, Secure Platforms & Web3.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-secondary max-w-xl font-normal leading-relaxed">
            {PERSONAL_INFO.positioning}
          </p>

          {/* Action Buttons — Contact is primary CTA for hiring outreach */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 rounded-xl bg-primary text-surface font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </button>

            <button
              onClick={() => scrollToSection('projects')}
              className="px-5 py-2.5 rounded-xl bg-surface border-flat text-primary font-medium text-sm hover:bg-surface-subtle hover:border-accent transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 ml-2 border-l border-flat pl-4">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-subtle transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-subtle transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyEmail}
                aria-label="Copy Email"
                title={copiedEmail ? "Email Copied!" : "Click to copy email"}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Desktop Avatar Card with Floating Stat Badge */}
        <div className="hidden md:col-span-5 md:flex justify-end">
          <div className="relative group">
            <div className="w-64 h-72 rounded-2xl bg-surface border-flat p-3 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group-hover:border-accent">
              <div className="w-full h-full rounded-xl bg-surface-subtle border-flat p-4 flex flex-col items-center justify-center relative">
                <div className="w-20 h-20 rounded-2xl bg-primary text-surface flex items-center justify-center text-3xl font-extrabold shadow-sm mb-3">
                  AM
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-primary text-sm">{PERSONAL_INFO.name}</h3>
                  <p className="text-xs text-muted">Full-Stack & Web3 Developer</p>
                </div>

                {/* Visual Engineering Grid Graphic */}
                <div className="mt-4 w-full grid grid-cols-3 gap-1.5 opacity-80">
                  <div className="p-1.5 rounded-md bg-surface border-flat flex items-center justify-center">
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="p-1.5 rounded-md bg-surface border-flat flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="p-1.5 rounded-md bg-surface border-flat flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stat Badge */}
            <div className="absolute -bottom-4 -left-4 bg-surface border-flat px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2.5 border-l-4 border-l-primary">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-xs font-semibold text-primary">{PERSONAL_INFO.statsBadge}</div>
                <div className="text-[10px] text-muted">AI, Web3 & Security</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Skill-Tag Strip Below Hero (Immediate Stack Visibility) */}
      <div className="mt-12 pt-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-2 font-mono-code">
          Core Tech:
        </span>
        {PERSONAL_INFO.skillsQuickStrip.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-lg text-xs font-medium text-secondary hover:text-primary transition-colors font-mono-code"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};
