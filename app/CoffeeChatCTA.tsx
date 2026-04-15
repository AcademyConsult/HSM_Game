'use client';

import { useEffect, useState, useCallback } from 'react';

export default function CoffeeChatCTA() {
  const [coffeeInView, setCoffeeInView] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const coffeeEl = document.getElementById('coffee-chats');
    if (!coffeeEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCoffeeInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(coffeeEl);
    return () => observer.disconnect();
  }, [dismissed]);

  const visible = !dismissed && !coffeeInView;

  const handleClick = useCallback(() => {
    const coffeeEl = document.getElementById('coffee-chats');
    if (coffeeEl) {
      coffeeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-3 right-3 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <button
        onClick={handleClick}
        className="relative w-full flex items-center gap-3 rounded-2xl bg-white px-4 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-transform active:scale-[0.98] md:hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] md:hover:scale-[1.01]"
      >
        {/* Coffee icon */}
        <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#993333]/10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#993333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </span>

        {/* Text */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-neutral-900 leading-tight">
            Coffee Chat buchen
          </p>
          <p className="text-xs text-neutral-500 leading-tight mt-0.5 truncate">
            Lerne uns persönlich kennen
          </p>
        </div>

        {/* Arrow */}
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#993333] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M7 7l10 10" />
            <path d="M17 7v10H7" />
          </svg>
        </span>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label="Schließen"
          className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 ring-1 ring-black/5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </button>
    </div>
  );
}
