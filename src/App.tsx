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
import { initConsoleEasterEgg } from './utils/easterEgg';
import ChatWidget from './components/ChatWidget';
import { useTheme } from './hooks/useTheme';

export function App() {
  // One shared theme store: it applies the "dark" class, saves the choice, and follows the system setting.
  // (This replaces the old darkMode useState and the effect that wrote to localStorage.)
  const { theme, toggleTheme } = useTheme();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Init devtools easter egg
  useEffect(() => {
    initConsoleEasterEgg();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-white selection:text-black relative">
      {/* Sticky Navigation */}
      <Navbar
        darkMode={theme === 'dark'}
        onToggleDarkMode={toggleTheme}
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

      {/* AI Chat Widget with Copilot & Voice */}
      <ChatWidget onToggleDarkMode={toggleTheme} />
    </div>
  );
}

export default App;