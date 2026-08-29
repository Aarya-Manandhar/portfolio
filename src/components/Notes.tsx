import React, { useState } from 'react';
import { FileText, Clock, ChevronRight, X } from 'lucide-react';
import { TECHNICAL_NOTES } from '../data/portfolioData';
import type { TechnicalNote } from '../types';

export const Notes: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<TechnicalNote | null>(null);

  return (
    <section id="notes" className="py-16 md:py-24 border-t border-flat max-w-6xl mx-auto px-4 md:px-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-accent" />
        <span>Engineering Notes & Writing</span>
      </div>

      <div className="space-y-3 max-w-3xl mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Architectural reasoning and technical reflections.
        </h2>
        <p className="text-secondary text-base leading-relaxed">
          Short posts detailing engineering decisions, trade-offs, and lessons learned from past builds.
        </p>
      </div>

      {/* List of Notes */}
      <div className="space-y-4">
        {TECHNICAL_NOTES.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note)}
            className="group p-6 rounded-2xl bg-surface space-y-3 cursor-pointer hover:bg-surface-subtle transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                {note.title}
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted shrink-0">
                <span>{note.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" />
                  {note.readTime}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-secondary leading-relaxed">
              {note.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-surface-subtle text-[10px] font-medium text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-flat bg-surface-subtle flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{selectedNote.date}</span>
                  <span>•</span>
                  <span>{selectedNote.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">{selectedNote.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-secondary text-sm md:text-base leading-relaxed whitespace-pre-line">
              {selectedNote.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-flat bg-surface-subtle flex items-center justify-between">
              <div className="flex gap-1.5">
                {selectedNote.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-1.5 rounded-xl bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
