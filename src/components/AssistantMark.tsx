// src/components/AssistantMark.tsx
// The "A" assistant mark: bold black A with a red band, on a cream disc.
// It carries its own colors, so it looks the same in light and dark mode.
export default function AssistantMark({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true" focusable="false">
      <circle cx="256" cy="256" r="256" fill="#F4EFE4" />
      <g transform="translate(-6.8 5.0)">
        <path d="M210 92 L302 92 L424 410 L334 410 L256.0 206.7 L178 410 L88 410 Z" fill="#161616" />
        <path d="M118.1 331.6 L415.7 242.3 L437.7 299.7 L90.3 403.9 Z" fill="#E3312A" />
      </g>
    </svg>
  );
}
