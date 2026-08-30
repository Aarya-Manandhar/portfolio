import React from 'react';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';

export const Education: React.FC = () => {
  return (
    <section
      id="education"
      className="py-10 md:py-14 border-t border-flat max-w-6xl mx-auto px-4 md:px-8"
    >
      {/* Compact two-column layout: credential left, coursework right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">

        {/* Left: Degree block */}
        <div className="md:col-span-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>Education</span>
          </div>

          <div className="p-5 rounded-2xl bg-surface space-y-3">
            {/* Status pill */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-subtle text-[11px] font-semibold text-muted font-mono-code uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {EDUCATION.status}
            </span>

            <div>
              <h3 className="text-base font-bold text-primary leading-snug">
                {EDUCATION.degree}
              </h3>
              <p className="text-sm text-secondary mt-0.5">{EDUCATION.institution}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="px-2 py-0.5 rounded-md bg-surface-subtle font-mono-code font-medium">
                Expected {EDUCATION.graduationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Coursework that cross-references real projects */}
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <span>Academic Foundations — mapped to shipped work</span>
          </div>

          <div className="space-y-2">
            {EDUCATION.relevantCoursework.map((item) => (
              <div
                key={item.subject}
                className="group flex items-start gap-3 p-3.5 rounded-xl bg-surface hover:bg-surface-subtle transition-colors duration-150"
              >
                <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div>
                  <span className="text-xs font-semibold text-primary">{item.subject}</span>
                  <span className="text-muted mx-2 text-xs">·</span>
                  <span className="text-xs text-secondary">{item.relevance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
