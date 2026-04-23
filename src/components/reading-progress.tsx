'use client';

import { useEffect, useState } from 'react';

// A thin amber bar fixed to the top of the viewport that grows as the reader
// scrolls through the current page. Tactile signal for "how much longer is
// this" without introducing heavier UI like an "Estimated read time" pill.
// Animates via transform: scaleX (GPU-cheap) rather than width changes.

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        className="h-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-sm shadow-amber-500/40 transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
