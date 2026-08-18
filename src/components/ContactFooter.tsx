import React, { useState } from 'react';
import { Mail, FileDown, Clock, ArrowUpRight, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

export const ContactFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMailTo = () => {
    window.location.href = `mailto:${PERSONAL_INFO.email}`;
  };

  return (
    <footer id="contact" className="pt-16 pb-12 border-t border-flat bg-surface-subtle">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Top Direct Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              Let's build reliable software together.
            </h2>

            <p className="text-secondary text-base max-w-lg leading-relaxed">
              Have a project, engineering role, or Web3/AI architecture question? Reach out directly via email or social networks.
            </p>

            {/* Response Time Guarantee Note */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border-flat text-xs font-medium text-muted">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Response pledge: {PERSONAL_INFO.responsePledge}</span>
            </div>
          </div>

          {/* Action Links & Email Spam-Protection Buttons */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            {/* Primary Obfuscated Email Button with Copy & MailTo Actions */}
            <div className="p-4 rounded-xl bg-primary text-surface font-semibold text-sm flex items-center justify-between shadow-xs gap-3">
              <button
                onClick={handleMailTo}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left cursor-pointer"
                title="Send Email"
              >
                <Mail className="w-5 h-5 shrink-0" />
                <span className="font-mono-code text-xs md:text-sm">
                  {PERSONAL_INFO.email.replace('@', ' [at] ')}
                </span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-surface/20 hover:bg-surface/30 text-surface transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-medium"
                aria-label="Copy Email Address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* GitHub & LinkedIn Links */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-surface border-flat text-primary font-medium text-xs hover:border-accent hover:text-accent transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-muted" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
              </a>

              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-surface border-flat text-primary font-medium text-xs hover:border-accent hover:text-accent transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-muted" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
              </a>
            </div>

            {/* Resume Download */}
            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                alert("Resume download triggered! (Replace link with actual PDF path when deploying)");
              }}
              className="p-3.5 rounded-xl bg-surface border-flat text-muted font-medium text-xs hover:text-primary hover:border-accent transition-colors flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4 text-accent" />
              <span>Download Full CV / Resume (PDF)</span>
            </a>
          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="pt-8 border-t border-flat flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {currentYear} {PERSONAL_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built with React + Vite + Tailwind CSS</span>
            <span>•</span>
            <span className="text-primary font-medium">Monochrome Craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
