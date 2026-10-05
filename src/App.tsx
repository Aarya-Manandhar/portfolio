import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { CaseStudy } from './components/CaseStudy';
import { ProjectsGrid } from './components/ProjectsGrid';
import { Skills } from './components/Skills';
import { LiveDeployments } from './components/LiveDeployments';
import { ContactFooter } from './components/ContactFooter';
import { CursorEffect } from './components/CursorEffect';
import { CodeCrawler } from './components/CodeCrawler';
import { initConsoleEasterEgg } from './utils/easterEgg';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return false; // Default to light mode
    }
    return false; // Default to light mode
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync Dark/Light class to html body
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Init devtools easter egg
  useEffect(() => {
    initConsoleEasterEgg();
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-surface text-primary transition-colors duration-200 selection:bg-white selection:text-black relative">
      {/* Dynamic Cursor Spotlight & Follower */}
      <CursorEffect />

      {/* Code Crawler — spider-bot that crawls the node network */}
      <CodeCrawler darkMode={darkMode} />

      {/* Sticky Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Single Page Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <ProjectsGrid />
        <CaseStudy />
        <LiveDeployments />
      </main>

      {/* Contact & Footer */}
      <ContactFooter />

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default App;
