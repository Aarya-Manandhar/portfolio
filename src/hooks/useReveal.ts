import { useEffect, useRef, useState } from 'react';

/**
 * useReveal - fires once when the target element is ~15% visible,
 * then unobserves. Respects prefers-reduced-motion automatically
 * (callers receive `visible = true` immediately so CSS transitions
 * are never played for users who prefer reduced motion).
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Immediately resolve for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // fire once, never replay on scroll-up
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
