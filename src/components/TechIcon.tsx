import React, { useState } from 'react';
import { ShieldCheck, Cpu, Terminal, Lock, CheckCircle2 } from 'lucide-react';

interface TechIconProps {
  name: string;
  deviconSlug?: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, deviconSlug, className = 'w-4 h-4' }) => {
  const [error, setError] = useState(false);

  if (deviconSlug && !error) {
    const cdnUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${deviconSlug}/${deviconSlug}-original.svg`;
    return (
      <img
        src={cdnUrl}
        alt={name}
        className={`${className} object-contain inline-block shrink-0`}
        onError={() => {
          // Try fallback plain variant or toggle error
          setError(true);
        }}
        loading="lazy"
      />
    );
  }

  // Graceful category-specific icon fallbacks
  if (name.includes('Encryption') || name.includes('Lock')) {
    return <Lock className={`${className} text-rose-400 shrink-0`} />;
  }
  if (name.includes('RBAC') || name.includes('Security')) {
    return <ShieldCheck className={`${className} text-amber-400 shrink-0`} />;
  }
  if (name.includes('API') || name.includes('REST')) {
    return <Terminal className={`${className} text-primary shrink-0`} />;
  }
  if (name.includes('State') || name.includes('Modeling')) {
    return <Cpu className={`${className} text-muted shrink-0`} />;
  }

  return <CheckCircle2 className={`${className} text-muted shrink-0`} />;
};
