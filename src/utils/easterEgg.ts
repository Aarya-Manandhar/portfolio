import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

export const initConsoleEasterEgg = () => {
  if (typeof window === 'undefined') return;

  const styles = [
    'font-size: 13px',
    'font-family: monospace',
    'color: #2563eb',
    'font-weight: bold',
  ].join(';');

  const banner = `
┌──────────────────────────────────────────────────────────┐
│  AARYA MANANDHAR — Full-Stack Developer                  │
│  "Building AI tools, secure platforms & Web3 systems"    │
├──────────────────────────────────────────────────────────┤
│  GitHub: ${PERSONAL_INFO.githubUrl}             │
│  Try typing: window.aarya                                │
└──────────────────────────────────────────────────────────┘
`;

  console.log(`%c${banner}`, styles);

  // Attach interactive console object
  (window as unknown as Record<string, unknown>).aarya = {
    bio: PERSONAL_INFO.bio,
    stack: PERSONAL_INFO.skillsQuickStrip,
    projects: PROJECTS.map((p) => ({ name: p.name, tech: p.tech })),
    secret: () => '🎉 You found the hidden console method! Built with React + Vite + Tailwind CSS.',
  };
};
