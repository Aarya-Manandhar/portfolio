import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Command } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenCommandPalette,
}) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'featured', label: 'SpecSense AI' },
    { id: 'case-study', label: 'Case Study' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'notes', label: 'Notes' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isClickScrolling.current) return;

      const sectionIds = ['hero', ...navLinks.map((l) => l.id)];
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isClickScrolling.current = true;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/85 backdrop-blur-md border-b border-flat py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
      style={{
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--card-bg) 85%, transparent)'
          : 'transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Wordmark Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2.5 font-bold text-lg text-primary hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary text-surface flex items-center justify-center font-extrabold text-sm shadow-xs group-hover:scale-105 transition-transform">
            {PERSONAL_INFO.initials}
          </div>
          <span className="font-bold tracking-tight hidden sm:inline">{PERSONAL_INFO.name}</span>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-subtle p-1 rounded-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-surface text-primary border-flat shadow-xs'
                    : 'border-transparent text-muted hover:text-primary hover:bg-surface/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Analyze Shortcut + Command Palette + Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Analyze Shortcut Hint Pill */}
          <button
            onClick={() => {
              const el = document.getElementById('specsense-input');
              if (el) {
                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                el.focus();
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-surface-subtle text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
            title="Press 'A' anywhere to jump to SpecSense AI Analyzer"
          >
            <span className="text-[11px]">Analyze</span>
            <kbd className="text-[10px] px-1.5 py-0.2 rounded-sm bg-surface font-mono-code text-primary font-bold">
              A
            </kbd>
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-surface-subtle text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
            title="Open Command Palette (⌘K)"
          >
            <Command className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block text-[10px] px-1.5 py-0.2 rounded-sm bg-surface font-mono-code text-muted">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-surface-subtle text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>
        </div>
      </div>
    </header>
  );
};
