import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROJECTS } from '../data/portfolioData';
import type { RequirementAnalysis } from '../types';

// Heuristic database of ambiguous/vague words
const VAGUE_DICTIONARY: Record<string, { category: 'subjective' | 'ambiguous' | 'untestable'; reason: string; suggestion: string }> = {
  fast: {
    category: 'ambiguous',
    reason: 'Vague performance target. Cannot be verified without concrete SLA bounds.',
    suggestion: 'Specify target response time (e.g., "p95 latency < 200ms under 500 RPS").',
  },
  'user-friendly': {
    category: 'subjective',
    reason: 'Subjective usability term. Unmeasurable in automated test suites.',
    suggestion: 'Define usability metrics (e.g., "First-time task completion time < 30 seconds").',
  },
  intuitive: {
    category: 'subjective',
    reason: 'Subjective user experience descriptor.',
    suggestion: 'Specify design system guidelines or user testing target (e.g., "System Usability Scale score > 80").',
  },
  'real-time': {
    category: 'ambiguous',
    reason: 'Ambiguous synchronization expectation.',
    suggestion: 'Quantify maximum update latency (e.g., "Data synchronized via WebSockets within 100ms").',
  },
  secure: {
    category: 'untestable',
    reason: 'Broad non-verifiable security statement.',
    suggestion: 'List compliance standards or threat models (e.g., "AES-256 encryption at rest & OWASP Top 10 mitigation").',
  },
  robust: {
    category: 'untestable',
    reason: 'Non-verifiable fault tolerance claim.',
    suggestion: 'Specify error handling SLAs (e.g., "Automatic retry logic for 5xx errors with 99.9% uptime").',
  },
  scalable: {
    category: 'ambiguous',
    reason: 'Vague growth capability.',
    suggestion: 'Quantify load capacity (e.g., "Autoscale from 10 to 1,000 instances at 70% CPU threshold").',
  },
  seamless: {
    category: 'subjective',
    reason: 'Subjective integration claim.',
    suggestion: 'Specify zero downtime deployment or single sign-on integration standards.',
  },
  easy: {
    category: 'subjective',
    reason: 'Unquantifiable difficulty rating.',
    suggestion: 'Detail step-by-step UX workflow or maximum clicks required.',
  },
  efficient: {
    category: 'ambiguous',
    reason: 'Vague resource usage requirement.',
    suggestion: 'Specify memory/CPU limits (e.g., "Memory footprint under 256MB under peak load").',
  },
};

const SAMPLE_PRESETS = [
  "The system should be fast, user-friendly, and provide real-time updates.",
  "User authentication must be robust and secure with zero lag.",
  "The dashboard should be intuitive and seamless for all active users.",
  "API response times must be under 150ms at p95 for 10k concurrent users.",
];

export const FeaturedSpecSense: React.FC = () => {
  const specProject = PROJECTS.find((p) => p.id === 'specsense-ai') || PROJECTS[0];
  const [inputText, setInputText] = useState(SAMPLE_PRESETS[0]);
  const [pulsing, setPulsing] = useState(false);

  // Keyboard shortcut listener ('A' for analyze)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          const inputEl = document.getElementById('specsense-input') as HTMLTextAreaElement;
          const sectionEl = document.getElementById('featured');

          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          }

          if (inputEl) {
            inputEl.focus();
          }

          if (!prefersReducedMotion) {
            setPulsing(true);
            setTimeout(() => setPulsing(false), 400);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Analyze text in real time
  const analyzeRequirement = (text: string): RequirementAnalysis => {
    const words = text.split(/\s+/);
    const issues: RequirementAnalysis['issues'] = [];

    words.forEach((rawWord, index) => {
      const cleanWord = rawWord.toLowerCase().replace(/[^a-z-]/g, '');
      if (VAGUE_DICTIONARY[cleanWord]) {
        const item = VAGUE_DICTIONARY[cleanWord];
        issues.push({
          word: rawWord.replace(/[^a-zA-Z-]/g, ''),
          index,
          reason: item.reason,
          suggestion: item.suggestion,
          category: item.category,
        });
      }
    });

    const totalWords = words.filter((w) => w.length > 0).length;
    const vagueCount = issues.length;
    let score = 100;

    if (totalWords > 0) {
      score = Math.max(0, Math.round(100 - (vagueCount / totalWords) * 150));
    }

    return { score, vagueCount, totalWords, issues };
  };

  const analysis = analyzeRequirement(inputText);

  return (
    <section id="featured" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Featured Project & Live Interactive Demo</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
          Featured Innovation
        </span>
      </div>

      {/* Main SpecSense Card Container */}
      <div className="rounded-2xl bg-surface p-6 md:p-8 space-y-8">
        {/* Project Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl md:text-3xl font-bold text-primary">{specProject.name}</h3>
              <span className="px-2.5 py-0.5 rounded-md bg-primary text-surface text-xs font-semibold">
                AI / NLP Tool
              </span>
            </div>
            <p className="text-secondary text-base leading-relaxed">
              {specProject.fullDesc || specProject.shortDesc}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {specProject.tech.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {specProject.githubUrl && (
              <a
                href={specProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-surface-subtle text-primary font-medium text-xs hover:text-accent transition-colors flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Embedded Interactive Live Demo Widget */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Try SpecSense AI Live Requirement Analyzer</span>
              </h4>
              <p className="text-xs text-muted">
                Type or paste a requirement sentence to detect ambiguous, untestable language in real time. (Shortcut: Press <kbd className="font-mono-code font-bold text-primary bg-surface-subtle px-1 rounded-sm">A</kbd> anywhere)
              </p>
            </div>

            {/* Quality Score Indicator */}
            <div
              className={`flex items-center gap-3 px-3 py-1.5 rounded-xl bg-surface-subtle self-start sm:self-auto transition-all duration-300 ${
                pulsing ? 'scale-110 border-primary ring-2 ring-primary/40' : ''
              }`}
            >
              <span className="text-xs text-muted font-medium">Quality Score:</span>
              <span
                className={`text-sm font-bold ${
                  analysis.score >= 80
                    ? 'text-emerald-500'
                    : analysis.score >= 50
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
              >
                {analysis.score}/100
              </span>
              {analysis.score >= 80 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase text-muted">Sample Presets:</span>
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-subtle text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>

          {/* Input Text Area */}
          <div className="relative">
            <textarea
              id="specsense-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a requirement sentence here (e.g. 'The system should be fast and user-friendly...')"
              className="w-full p-4 rounded-xl bg-surface-subtle text-primary text-sm font-medium focus:outline-hidden transition-colors resize-none"
            />
          </div>

          {/* Real-time Analysis Feedback Panel */}
          <div className="rounded-xl bg-surface-subtle p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-primary border-b border-flat pb-2">
              <span>Analysis Results ({analysis.vagueCount} terms flagged)</span>
              <span className="text-muted">{analysis.totalWords} total words</span>
            </div>

            {analysis.issues.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>No vague or non-verifiable terms detected! This requirement is clear and testable.</span>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {analysis.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-surface space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono-code text-xs font-bold">
                          "{issue.word}"
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm bg-surface-subtle text-muted">
                          {issue.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted font-mono-code">Issue #{i + 1}</span>
                    </div>

                    <p className="text-xs text-secondary flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{issue.reason}</span>
                    </p>

                    <div className="text-xs text-primary font-medium flex items-start gap-1.5 bg-surface-subtle p-2 rounded-md">
                      <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold">Suggestion:</strong> {issue.suggestion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
